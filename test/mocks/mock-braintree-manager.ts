/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { mockSuccessResponse } from './models/mock-success-response';
import { MockBraintreeClient } from './payment-clients/mock-braintree-client';
import { ErrorResponse } from '../../src/models/response-models/error-models/error-response';

export class MockBraintreeManager implements BraintreeManagerInterface {
  private submitDonationError = false;
  private submitDonationResponse: 'success' | 'failure' = 'success';

  constructor(options?: {
    submitDonationError?: boolean;
    submitDonationResponse?: 'success' | 'failure';
  }) {
    this.submitDonationError = options?.submitDonationError ?? false;
    this.submitDonationResponse = options?.submitDonationResponse ?? 'success';
  }

  paymentProviders: PaymentProvidersInterface = new MockPaymentProviders();
  instance: PromisedSingleton<Client> = new PromisedSingleton<Client>({
    generator: new Promise(resolve => {
      resolve(new MockBraintreeClient());
    }),
  });

  setReferrer(referrer: string): void {}

  setLoggedInUser(loggedInUser: string): void {}

  startup(): void {}

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
    if (this.submitDonationError) {
      throw 'oh no';
    }

    if (this.submitDonationResponse === 'success') {
      return new DonationResponse({
        success: true,
        value: mockSuccessResponse,
      });
    } else {
      return new DonationResponse({
        success: false,
        value: new ErrorResponse({ message: 'error' }),
      });
    }
  }

  async submitUpsellDonation(options: {
    oneTimeDonationResponse: SuccessResponse;
    amount: number;
  }): Promise<DonationResponse> {
    const response = new DonationResponse({
      success: true,
      value: mockSuccessResponse,
    });
    return response;
  }

  donationSuccessful(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse | undefined;
  }): void {}
}
