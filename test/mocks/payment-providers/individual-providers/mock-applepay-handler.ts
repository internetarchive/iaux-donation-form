/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplePayHandlerInterface } from '../../../../src/braintree-manager/payment-providers/apple-pay/apple-pay';
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { DonationPaymentInfo } from '../../../../src/models/donation-info/donation-payment-info';
import { MockApplePayClient } from '../../payment-clients/mock-applepay-client';
import { ApplePaySessionDataSource } from '../../../../src/braintree-manager/payment-providers/apple-pay/apple-pay-session-datasource';

export class MockApplePayHandler implements ApplePayHandlerInterface {
  instance: PromisedSingleton<any> = new PromisedSingleton<braintree.ApplePay>({
    generator: new Promise<any>(resolve => {
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
