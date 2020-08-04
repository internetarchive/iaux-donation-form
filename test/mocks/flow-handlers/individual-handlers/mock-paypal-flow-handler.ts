import { PayPalFlowHandlerInterface } from '../../../../src/payment-flow-handlers/handlers/paypal-flow-handler';
import { DonationPaymentInfo } from '../../../../src/models/donation-info/donation-payment-info';

export class MockPayPalFlowHandler implements PayPalFlowHandlerInterface {
  donationInfo?: DonationPaymentInfo;
  upsellDonationInfo?: DonationPaymentInfo;
  renderPayPalCalledDonationInfo?: DonationPaymentInfo;

  updateDonationInfo(donationInfo: DonationPaymentInfo): void {
    this.donationInfo = donationInfo;
  }
  updateUpsellDonationInfo(donationInfo: DonationPaymentInfo): void {
    this.upsellDonationInfo = donationInfo;
  }
  async renderPayPalButton(donationInfo: DonationPaymentInfo): Promise<void> {
    this.renderPayPalCalledDonationInfo = donationInfo;
  }
}
