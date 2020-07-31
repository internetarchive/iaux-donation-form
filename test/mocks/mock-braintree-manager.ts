import { BraintreeManagerInterface } from '../../src/braintree-manager/braintree-interfaces';
import { PaymentProvidersInterface } from '../../src/braintree-manager/payment-providers';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { Client } from 'braintree-web';
import { PaymentProvider } from '../../src/models/common/payment-provider-name';
import { DonationPaymentInfo } from '../../src/models/donation-info/donation-payment-info';
import { BillingInfo } from '../../src/models/common/billing-info';
import { DonationResponse } from '../../src/models/response-models/donation-response';
import { CustomerInfo } from '../../src/models/common/customer-info';
import { SuccessResponse } from '../../src/models/response-models/success-models/success-response';
import { MockPaymentProviders } from './payment-providers/mock-payment-providers';
import { mockSuccessResponse } from './mock-success-response';
import { MockBraintreeClient } from './payment-clients/mock-braintree-client';

export class MockBraintreeManager implements BraintreeManagerInterface {
  paymentProviders: PaymentProvidersInterface = new MockPaymentProviders();
  instance: PromisedSingleton<Client> = new PromisedSingleton<Client>({
    generator: new Promise(resolve => {
      resolve(new MockBraintreeClient());
    }),
});

  setReferrer(referrer: string): void {
    console.debug('setReferrer', referrer);
  }

  setLoggedInUser(loggedInUser: string): void {
    console.debug('setLoggedInUser', loggedInUser);
  }

  startup(): void {
    console.debug('startup');
  }

  async submitDonation(options: {
    nonce: string;
    paymentProvider: PaymentProvider;
    donationInfo: DonationPaymentInfo;
    billingInfo: BillingInfo;
    customerInfo: CustomerInfo;
    upsellOnetimeTransactionId?: string | undefined;
    customerId?: string | undefined;
    recaptchaToken?: string | undefined;
    bin?: string | undefined;
    binName?: string | undefined;
  }): Promise<DonationResponse> {
    console.debug('submitDonation', options);
    const response = new DonationResponse({
      success: true,
      value: mockSuccessResponse
    })
    return response;
  }

  async submitUpsellDonation(options: {
    oneTimeDonationResponse: SuccessResponse;
    amount: number;
  }): Promise<DonationResponse> {
    console.debug('submitUpsellDonation', options);
    const response = new DonationResponse({
      success: true,
      value: mockSuccessResponse
    })
    return response;
  }

  donationSuccessful(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse | undefined;
  }): void {
    console.debug('submitUpsellDonation', options);
  }
}
