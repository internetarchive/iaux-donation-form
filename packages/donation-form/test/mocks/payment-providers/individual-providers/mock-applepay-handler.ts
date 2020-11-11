/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { DonationPaymentInfo } from '@internetarchive/donation-form-data-models';
import { MockApplePayClient } from '../../payment-clients/mock-applepay-client';
import { ApplePaySessionDataSource } from '../../../../src/braintree-manager/payment-providers/apple-pay/apple-pay-session-datasource';
import { ApplePayHandlerInterface } from '../../../../src/braintree-manager/payment-providers/apple-pay/apple-pay-interface';
import { BraintreeManagerInterface } from '../../../../src/braintree-manager/braintree-interfaces';
import { MockApplePaySession } from '../../payment-clients/mock-applepay-session';
import { ApplePaySessionDataSourceInterface } from '../../../../src/braintree-manager/payment-providers/apple-pay/apple-pay-session-datasource-interface';

export class MockApplePayHandler implements ApplePayHandlerInterface {
  dataSource?: ApplePaySessionDataSourceInterface;

  private braintreeManager: BraintreeManagerInterface;

  constructor(braintreeManager: BraintreeManagerInterface) {
    this.braintreeManager = braintreeManager;
  }

  instance: PromisedSingleton<any> = new PromisedSingleton<braintree.ApplePay>({
    generator: new Promise<any>(resolve => {
      resolve(new MockApplePayClient());
    }),
  });

  isAvailable(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async createPaymentRequest(
    e: Event,
    donationInfo: DonationPaymentInfo,
  ): Promise<ApplePaySessionDataSourceInterface> {
    const session = new MockApplePaySession();
    this.dataSource = new ApplePaySessionDataSource({
      donationInfo: donationInfo,
      session: session,
      applePayInstance: 'foo',
      braintreeManager: this.braintreeManager,
    });
    return this.dataSource;
  }
}
