/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BraintreeManagerEvents,
  BraintreeManagerInterface,
} from '../../src/braintree-manager/braintree-interfaces';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import {
  PaymentProvider,
  DonationPaymentInfo,
  BillingInfo,
  DonationResponse,
  CustomerInfo,
  SuccessResponse,
  ErrorResponse,
} from '@internetarchive/donation-form-data-models';
import { MockPaymentProviders } from './payment-providers/mock-payment-providers';
import { mockSuccessResponse } from './models/mock-success-response';
import { MockBraintreeClient } from './payment-clients/mock-braintree-client';
import { PaymentProvidersInterface } from '../../src/braintree-manager/payment-providers-interface';
import { createNanoEvents, Unsubscribe } from 'nanoevents';

export class MockBraintreeManager implements BraintreeManagerInterface {
  donationSuccessfulOptions?: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse | undefined;
  };

  private submitDonationError = false;
  private submitDonationResponse: 'success' | 'failure' = 'success';

  constructor(options?: {
    submitDonationError?: boolean;
    submitDonationResponse?: 'success' | 'failure';
  }) {
    this.submitDonationError = options?.submitDonationError ?? false;
    this.submitDonationResponse = options?.submitDonationResponse ?? 'success';
  }

  private emitter = createNanoEvents<BraintreeManagerEvents>();

  on<E extends keyof BraintreeManagerEvents>(
    event: E,
    callback: BraintreeManagerEvents[E],
  ): Unsubscribe {
    return this.emitter.on(event, callback);
  }

  paymentProviders: PaymentProvidersInterface = new MockPaymentProviders();

  instance = new PromisedSingleton<braintree.Client>({
    generator: (): Promise<braintree.Client> =>
      new Promise(resolve => {
        resolve(new MockBraintreeClient());
      }),
  });

  setReferrer(referrer: string): void {}

  setLoggedInUser(loggedInUser: string): void {}

  setOrigin(origin: string): void {}

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
      const response = new SuccessResponse({
        paymentMethodNonce: options.nonce,
        paymentProvider: options.paymentProvider,
        amount: options.donationInfo.amount,
        donationType: options.donationInfo.donationType,
        transaction_id: 'foo',
        customer_id: 'bar',
        customer: options.customerInfo,
        billing: options.billingInfo,
      });

      return new DonationResponse({
        success: true,
        value: response,
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
  }): void {
    this.donationSuccessfulOptions = options;
  }
}
