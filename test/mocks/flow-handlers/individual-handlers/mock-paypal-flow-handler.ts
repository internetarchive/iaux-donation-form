import { PayPalFlowHandlerInterface, PayPalFlowHandlerEvents } from '../../../../src/payment-flow-handlers/handlers/paypal-flow-handler';
import { DonationPaymentInfo } from '../../../../src/models/donation-info/donation-payment-info';
import { Unsubscribe, createNanoEvents, Emitter } from 'nanoevents';

export class MockPayPalFlowHandler implements PayPalFlowHandlerInterface {
  private emitter: Emitter<PayPalFlowHandlerEvents> = createNanoEvents<PayPalFlowHandlerEvents>();

  on<E extends keyof PayPalFlowHandlerEvents>(event: E, callback: PayPalFlowHandlerEvents[E]): Unsubscribe {
    return this.emitter.on(event, callback);
  }

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
