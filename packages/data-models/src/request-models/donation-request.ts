import { CustomerInfo } from '../common/customer-info';
import { BillingInfo } from '../common/billing-info';
import { DonationType } from '../donation-info/donation-type';
import { PaymentProvider } from '../common/payment-provider-name';
import { DonationRequestCustomFields } from './donation-request-custom-fields';

/**
 * The request that gets submitted to the backend to perform a donation
 *
 * @export
 * @class DonationRequest
 */
export class DonationRequest {
  paymentProvider: PaymentProvider;
  paymentMethodNonce: string;
  recaptchaToken?: string;
  customerId?: string;
  deviceData?: string;
  upsellOnetimeTransactionId?: string;

  bin?: string; // first 6 digits of CC
  binName?: string; // credit card bank name

  amount: number;
  donationType: DonationType;

  customer: CustomerInfo;
  billing: BillingInfo;
  customFields: DonationRequestCustomFields = new DonationRequestCustomFields();

  constructor(options: {
    paymentProvider: PaymentProvider;
    paymentMethodNonce: string;
    recaptchaToken?: string;
    customerId?: string;
    deviceData?: string;
    upsellOnetimeTransactionId?: string;

    bin?: string; // first 6 digits of CC
    binName?: string; // credit card bank name

    amount: number;
    donationType: DonationType;

    customer: CustomerInfo;
    billing: BillingInfo;
    customFields?: DonationRequestCustomFields;
  }) {
    this.paymentProvider = options.paymentProvider;
    this.paymentMethodNonce = options.paymentMethodNonce;
    this.recaptchaToken = options.recaptchaToken;
    this.customerId = options.customerId;
    this.deviceData = options.deviceData;
    this.upsellOnetimeTransactionId = options.upsellOnetimeTransactionId;

    this.bin = options.bin;
    this.binName = options.binName;

    this.amount = options.amount;
    this.donationType = options.donationType;

    this.customer = options.customer;
    this.billing = options.billing;

    if (options.customFields) {
      this.customFields = options.customFields;
    }
  }
}
