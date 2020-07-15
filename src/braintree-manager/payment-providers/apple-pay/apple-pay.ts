import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { BraintreeManagerInterface } from '../../braintree-interfaces';
import { ApplePaySessionManagerInterface } from './apple-pay-session-manager';
import { DonationType } from '../../../models/donation-info/donation-type';
import { ApplePaySessionDataSource } from './apple-pay-session-datasource';
import { DonationPaymentInfo } from '../../../models/donation-info/donation-payment-info';

export interface ApplePayHandlerInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instance: PromisedSingleton<any | undefined>;
  isAvailable(): Promise<boolean>;
  createPaymentRequest(
    e: Event,
    donationInfo: DonationPaymentInfo,
  ): Promise<ApplePaySessionDataSource>;
}

export class ApplePayHandler implements ApplePayHandlerInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instance: PromisedSingleton<any | undefined>;

  constructor(
    braintreeManager: BraintreeManagerInterface,
    applePayClient: braintree.ApplePay,
    applePaySessionManager: ApplePaySessionManagerInterface,
  ) {
    this.braintreeManager = braintreeManager;
    this.applePayClient = applePayClient;
    this.applePaySessionManager = applePaySessionManager;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.instance = new PromisedSingleton<any | undefined>({
      generator: new Promise(resolve => {
        if (!this.applePaySessionManager.canMakePayments()) {
          return resolve(undefined);
        }

        return this.braintreeManager.instance.get().then(async braintreeClient => {
          const instance = await this.applePayClient.create({
            client: braintreeClient,
          });

          const canMakePayments = await ApplePaySession.canMakePaymentsWithActiveCard(
            instance.merchantIdentifier,
          );

          if (canMakePayments) {
            return resolve(instance);
          } else {
            return resolve(undefined);
          }
        });
      }),
    });
  }

  private braintreeManager: BraintreeManagerInterface;

  private applePaySessionManager: ApplePaySessionManagerInterface;

  private applePayClient: braintree.ApplePay;

  async isAvailable(): Promise<boolean> {
    try {
      const instance = await this.instance.get();
      return !!instance;
    } catch (err) {
      return false;
    }
  }

  // In order to trigger the Apple Pay flow, you HAVE to pass in the event
  // that triggered the launch. Notice we're not actually using the event
  // but ApplePay won't launch without it.
  async createPaymentRequest(
    e: Event,
    donationInfo: DonationPaymentInfo,
  ): Promise<ApplePaySessionDataSource> {
    const applePayInstance = await this.instance.get();

    let label = 'Internet Archive Monthly';
    if (donationInfo.donationType === DonationType.OneTime) {
      label = 'Internet Archive';
    }

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

    session.onvalidatemerchant = sessionDataSource.onvalidatemerchant.bind(sessionDataSource);
    session.onpaymentauthorized = sessionDataSource.onpaymentauthorized.bind(sessionDataSource);
    session.oncancel = sessionDataSource.oncancel.bind(sessionDataSource);

    session.begin();

    return sessionDataSource;
  }
}
