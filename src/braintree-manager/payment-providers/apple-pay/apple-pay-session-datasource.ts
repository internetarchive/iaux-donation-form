import { DonationPaymentInfo } from '../../../models/donation-info/donation-payment-info';
import { BraintreeManagerInterface } from '../../braintree-interfaces';
import { BillingInfo } from '../../../models/common/billing-info';
import { CustomerInfo } from '../../../models/common/customer-info';
import { DonationResponse } from '../../../models/response-models/donation-response';
import { PaymentProvider } from '../../../models/common/payment-provider-name';

export interface ApplePaySessionDataSourceInterface {
  delegate?: ApplePaySessionDataSourceDelegate;
  donationInfo: DonationPaymentInfo;
  onvalidatemerchant(event: ApplePayJS.ApplePayValidateMerchantEvent): Promise<void>;
  onpaymentauthorized(event: ApplePayJS.ApplePayPaymentAuthorizedEvent): Promise<void>;
  oncancel(): Promise<void>;
}

export interface ApplePaySessionDataSourceDelegate {
  paymentComplete(response: DonationResponse): void;
  paymentFailed(error: string): void;
  paymentCancelled(): void;
}

export class ApplePaySessionDataSource implements ApplePaySessionDataSourceInterface {
  delegate?: ApplePaySessionDataSourceDelegate;
  donationInfo: DonationPaymentInfo;

  private session: ApplePaySession;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applePayInstance: any;
  private braintreeManager: BraintreeManagerInterface;

  constructor(options: {
    donationInfo: DonationPaymentInfo;
    session: ApplePaySession;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    applePayInstance: any;
    braintreeManager: BraintreeManagerInterface;
  }) {
    this.session = options.session;
    this.donationInfo = options.donationInfo;
    this.applePayInstance = options.applePayInstance;
    this.braintreeManager = options.braintreeManager;
  }

  async onvalidatemerchant(event: ApplePayJS.ApplePayValidateMerchantEvent): Promise<void> {
    return new Promise((resolve, reject) => {
      this.applePayInstance.performValidation(
        {
          validationURL: event.validationURL,
          displayName: 'Internet Archive',
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (validationErr: any, validationData: any) => {
          if (validationErr) {
            this.delegate?.paymentFailed(validationErr);
            this.session.abort();
            reject(`Merchant validation error: ${validationErr}`);
          } else {
            this.session.completeMerchantValidation(validationData);
            resolve();
          }
        },
      );
    });
  }

  async oncancel(): Promise<void> {
    this.delegate?.paymentCancelled();
  }

  async onpaymentauthorized(event: ApplePayJS.ApplePayPaymentAuthorizedEvent): Promise<void> {
    let payload;

    try {
      payload = await this.applePayInstance.tokenize({
        token: event.payment.token,
      });
    } catch (err) {
      this.delegate?.paymentFailed(err);
      this.session.completePayment(ApplePaySession.STATUS_FAILURE);
      return;
    }

    const payment = event.payment;
    const billingContact = payment.billingContact;
    const shippingContact = payment.shippingContact;
    const addressLines = billingContact?.addressLines;

    let line1: string | undefined = undefined;
    let line2: string | undefined = undefined;

    if (addressLines) {
      line1 = addressLines[0];
      line2 = addressLines[1];
    }

    const billingInfo = new BillingInfo({
      streetAddress: line1,
      extendedAddress: line2,
      locality: billingContact?.locality,
      region: billingContact?.administrativeArea,
      postalCode: billingContact?.postalCode,
      countryCodeAlpha2: billingContact?.countryCode,
    });

    const customerInfo = new CustomerInfo({
      email: shippingContact?.emailAddress,
      firstName: shippingContact?.givenName,
      lastName: shippingContact?.familyName,
    });

    try {
      const donationResponse = await this.braintreeManager.submitDonation({
        nonce: payload.nonce,
        paymentProvider: PaymentProvider.ApplePay,
        donationInfo: this.donationInfo,
        billingInfo: billingInfo,
        customerInfo: customerInfo,
      });
      if (donationResponse.success) {
        this.delegate?.paymentComplete(donationResponse);
        this.session.completePayment(ApplePaySession.STATUS_SUCCESS);
      } else {
        this.delegate?.paymentFailed('Failure submitting data');
        this.session.completePayment(ApplePaySession.STATUS_FAILURE);
      }
    } catch (err) {
      this.delegate?.paymentFailed(err);
      this.session.completePayment(ApplePaySession.STATUS_FAILURE);
    }
  }
}
