import {
  PayPalFlowHandlerInterface,
  PayPalFlowHandlerEvents,
} from '../../../../src/payment-flow-handlers/handlers/paypal-flow-handler';
import { DonationPaymentInfo } from '@internetarchive/donation-form-data-models';
import { Unsubscribe, createNanoEvents, Emitter } from 'nanoevents';
import { MockPayPalButtonDataSource } from '../../payment-providers/individual-providers/mock-paypal-button-datasource';

export class MockPayPalFlowHandler implements PayPalFlowHandlerInterface {
  private emitter: Emitter<PayPalFlowHandlerEvents> = createNanoEvents<PayPalFlowHandlerEvents>();

  emitPaymentCancelledEvent(): void {
    const mockDataSource = new MockPayPalButtonDataSource();
    this.emitter.emit('payPalPaymentCancelled', mockDataSource, {});
  }

  emitPaymentErrorEvent(): void {
    const mockDataSource = new MockPayPalButtonDataSource();
    this.emitter.emit('payPalPaymentError', mockDataSource, 'foo-error');
  }

  on<E extends keyof PayPalFlowHandlerEvents>(
    event: E,
    callback: PayPalFlowHandlerEvents[E],
  ): Unsubscribe {
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
