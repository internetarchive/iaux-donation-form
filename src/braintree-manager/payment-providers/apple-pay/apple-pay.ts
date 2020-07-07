import { BraintreeManagerInterface } from '../../braintree-interfaces';
import { ApplePaySessionManagerInterface } from './apple-pay-session-manager';
import { DonationType } from '../../../models/donation-info/donation-type';
import { ApplePaySessionDataSource } from './apple-pay-session-datasource';
import { DonationPaymentInfo } from '../../../models/donation-info/donation-payment-info';

export interface ApplePayHandlerInterface {
  isAvailable(): Promise<boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getInstance(): Promise<any | undefined>;
  createPaymentRequest(
    e: Event,
    donationInfo: DonationPaymentInfo,
  ): Promise<ApplePaySessionDataSource>;
}

export class ApplePayHandler implements ApplePayHandlerInterface {
  constructor(
    braintreeManager: BraintreeManagerInterface,
    applePayClient: braintree.ApplePay,
    applePaySessionManager: ApplePaySessionManagerInterface,
  ) {
    this.braintreeManager = braintreeManager;
    this.applePayClient = applePayClient;
    this.applePaySessionManager = applePaySessionManager;
  }

  private braintreeManager: BraintreeManagerInterface;

  private applePaySessionManager: ApplePaySessionManagerInterface;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applePayInstance: any | undefined;

  private applePayClient: braintree.ApplePay;

  async isAvailable(): Promise<boolean> {
    console.debug('isAvailable start');
    try {
      const instance = await this.getInstance();
      console.debug('isAvailable instance', instance);
      return !!instance;
    } catch (err) {
      console.error('ERROR', err);
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getInstance(): Promise<any | undefined> {
    console.debug('getInstance start');
    if (this.applePayInstance) {
      console.debug('getInstance', this.applePayInstance);
      return this.applePayInstance;
    }

    if (!this.applePaySessionManager.canMakePayments()) {
      console.debug('ApplePay: Can not make payments');
      return undefined;
    }

    const braintreeClient = await this.braintreeManager.getInstance();
    if (!braintreeClient) {
      return undefined;
    }

    console.debug('CREATE');
    return (
      this.applePayClient
        .create({
          client: braintreeClient,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(async (instance: any) => {
          console.debug('ApplePaySession');

          const canMakePayments = await ApplePaySession.canMakePaymentsWithActiveCard(
            instance.merchantIdentifier,
          );
          console.debug('canMakePayments', canMakePayments);
          if (canMakePayments) {
            this.applePayInstance = instance;
            return this.applePayInstance;
          } else {
            return undefined;
          }
        })
    );
  }

  // In order to trigger the Apple Pay flow, you HAVE to pass in the event
  // that triggered the launch. Notice we're not actually using the event
  // but ApplePay won't launch without it.
  async createPaymentRequest(
    e: Event,
    donationInfo: DonationPaymentInfo,
  ): Promise<ApplePaySessionDataSource> {
    const applePayInstance = await this.getInstance();

    let label = 'Internet Archive Monthly';
    if (donationInfo.donationType === DonationType.OneTime) {
      label = 'Internet Archive';
    }

    console.debug('createPaymentRequest', donationInfo);

    const paymentRequest = applePayInstance.createPaymentRequest({
      total: {
        label: label,
        amount: donationInfo.total,
      },
      requiredBillingContactFields: ['postalAddress'],
      requiredShippingContactFields: ['name', 'email'],
    });
    const session = this.applePaySessionManager.createNewPaymentSession(paymentRequest);

    const sessionDataSource = new ApplePaySessionDataSource({
      donationInfo: donationInfo,
      session: session,
      applePayInstance: applePayInstance,
      braintreeManager: this.braintreeManager,
    });

    console.log('createPaymentRequest', session, paymentRequest);

    session.onvalidatemerchant = sessionDataSource.onvalidatemerchant.bind(sessionDataSource);
    session.onpaymentauthorized = sessionDataSource.onpaymentauthorized.bind(sessionDataSource);
    session.oncancel = sessionDataSource.oncancel.bind(sessionDataSource);

    console.log('session, sessionDataSource', session, sessionDataSource);
    session.begin();

    return sessionDataSource;
  }
}
