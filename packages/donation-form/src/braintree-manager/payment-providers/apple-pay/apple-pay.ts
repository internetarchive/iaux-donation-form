import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { BraintreeManagerInterface } from '../../braintree-interfaces';
import { ApplePaySessionManagerInterface } from './apple-pay-session-manager';
import { DonationType, DonationPaymentInfo } from '@internetarchive/donation-form-data-models';
import { ApplePaySessionDataSource } from './apple-pay-session-datasource';
import { ApplePayHandlerInterface } from './apple-pay-interface';

export class ApplePayHandler implements ApplePayHandlerInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instance: PromisedSingleton<any | undefined>;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    applePayClient: braintree.ApplePay;
    applePaySessionManager: ApplePaySessionManagerInterface;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instancePromisedSingleton?: PromisedSingleton<any | undefined>;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.applePayClient = options.applePayClient;
    this.applePaySessionManager = options.applePaySessionManager;

    this.instance =
      options.instancePromisedSingleton ??
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new PromisedSingleton<any | undefined>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generator: async (): Promise<any | undefined> => {
          if (!this.applePaySessionManager.canMakePayments()) {
            return undefined;
          }

          const braintreeClient = await this.braintreeManager.instance.get();
          const instance = await this.applePayClient.create({
            client: braintreeClient,
          });

          return instance;
        },
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
