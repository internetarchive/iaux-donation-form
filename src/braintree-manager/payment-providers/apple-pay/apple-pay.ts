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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applePayInstancePromise?: Promise<any>;

  async isAvailable(): Promise<boolean> {
    try {
      const instance = await this.getInstance();
      return !!instance;
    } catch (err) {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getInstance(): Promise<any | undefined> {
    if (this.applePayInstance) {
      return this.applePayInstance;
    }

    if (!this.applePaySessionManager.canMakePayments()) {
      return undefined;
    }

    // we only want one instance of this to be created so this chains the promise
    // calls if multiple callers request the instance
    if (this.applePayInstancePromise) {
      this.applePayInstancePromise = this.applePayInstancePromise.then(handler => {
        return handler;
      });
      return this.applePayInstancePromise;
    }

    this.applePayInstancePromise = this.braintreeManager
      .getInstance()
      .then(async braintreeClient => {
        const instance = await this.applePayClient.create({
          client: braintreeClient,
        });

        const canMakePayments = await ApplePaySession.canMakePaymentsWithActiveCard(
          instance.merchantIdentifier,
        );

        if (canMakePayments) {
          this.applePayInstance = instance;
          return this.applePayInstance;
        } else {
          return undefined;
        }
      });

    return this.applePayInstancePromise;
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
