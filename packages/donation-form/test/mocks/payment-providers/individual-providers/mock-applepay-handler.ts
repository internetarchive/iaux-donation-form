/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { DonationPaymentInfo } from '@internetarchive/donation-form-data-models';
import { MockApplePayClient } from '../../payment-clients/mock-applepay-client';
import { ApplePaySessionDataSource } from '../../../../src/braintree-manager/payment-providers/apple-pay/apple-pay-session-datasource';
import { ApplePayHandlerInterface } from '../../../../src/braintree-manager/payment-providers/apple-pay/apple-pay-interface';

export class MockApplePayHandler implements ApplePayHandlerInterface {
  instance = new PromisedSingleton<braintree.ApplePay>({
    generator: (): Promise<braintree.ApplePay> =>
      new Promise<any>(resolve => {
        resolve(new MockApplePayClient());
      }),
  });

  isAvailable(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  createPaymentRequest(
    e: Event,
    donationInfo: DonationPaymentInfo,
  ): Promise<ApplePaySessionDataSource> {
    throw new Error('Method not implemented.');
  }
}
