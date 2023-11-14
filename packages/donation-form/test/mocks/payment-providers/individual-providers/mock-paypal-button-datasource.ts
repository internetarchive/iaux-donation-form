import { DonationPaymentInfo, DonationType } from '@internetarchive/donation-form-data-models';
import {
  TokenizePayload,
  CancellationData,
} from '../../../../src/@types/paypal-checkout-components';
import {
  PayPalButtonDataSourceDelegate,
  PayPalButtonDataSourceInterface,
} from '../../../../src/braintree-manager/payment-providers/paypal/paypal-button-datasource';

export class MockPayPalButtonDataSource implements PayPalButtonDataSourceInterface {
  delegate?: PayPalButtonDataSourceDelegate | undefined;
  donationInfo: DonationPaymentInfo = new DonationPaymentInfo({
    donationType: DonationType.OneTime,
    amount: 5,
    coverFees: false,
  });
  async payment(): Promise<string> {
    this.delegate?.payPalPaymentStarted(this, {});
    return 'foo';
  }
  async onAuthorize(): Promise<TokenizePayload | undefined> {
    this.delegate?.payPalPaymentAuthorized(this, {
      nonce: 'foo',
      type: 'bar',
      details: { email: 'foo@bar.com', payerId: '1234', firstName: 'Joe', lastName: 'Boop' },
    });
    return undefined;
  }
  onCancel(data: CancellationData): void {
    this.delegate?.payPalPaymentCancelled(this, data);
  }
  onError(error: string): void {
    this.delegate?.payPalPaymentError(this, error);
  }
}
