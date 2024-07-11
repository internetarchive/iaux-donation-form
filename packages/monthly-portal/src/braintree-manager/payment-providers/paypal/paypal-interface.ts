import { PromisedSingleton } from '@internetarchive/promised-singleton';
import { DonationPaymentInfo } from '@internetarchive/donation-form-data-models';
import { PayPalButtonDataSourceInterface } from './paypal-button-datasource';

export interface PayPalHandlerInterface {
  instance: PromisedSingleton<braintree.PayPalCheckout | undefined>;

  renderPayPalButton(params: {
    selector: string;
    style: paypal.ButtonStyle;
    donationInfo: DonationPaymentInfo;
  }): Promise<PayPalButtonDataSourceInterface | undefined>;
}
