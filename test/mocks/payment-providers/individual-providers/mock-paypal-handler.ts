/* eslint-disable @typescript-eslint/no-unused-vars */
import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { MockPayPalClient } from '../../payment-clients/mock-paypal-client';
import { DonationPaymentInfo } from '../../../../src/models/donation-info/donation-payment-info';
import { PayPalButtonDataSourceInterface } from '../../../../src/braintree-manager/payment-providers/paypal/paypal-button-datasource';
import { PayPalHandlerInterface } from '../../../../src/braintree-manager/payment-providers/paypal/paypal-interface';

export class MockPayPalHandler implements PayPalHandlerInterface {
  instance: PromisedSingleton<braintree.PayPalCheckout | undefined> = new PromisedSingleton<
    braintree.PayPalCheckout
  >({
    generator: new Promise<braintree.PayPalCheckout>(resolve => {
      resolve(new MockPayPalClient());
    }),
  });

  renderPayPalButton(params: {
    selector: string;
    style: paypal.ButtonStyle;
    donationInfo: DonationPaymentInfo;
  }): Promise<PayPalButtonDataSourceInterface | undefined> {
    throw new Error('Method not implemented.');
  }
}
