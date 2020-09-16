import {
  GooglePayFlowHandlerInterface,
  GooglePayFlowHandlerEvents,
} from '../../../../src/payment-flow-handlers/handlers/googlepay-flow-handler';
import { DonationPaymentInfo } from '@internetarchive/donation-form-data-models';
import { Unsubscribe, createNanoEvents, Emitter } from 'nanoevents';

export class MockGooglePayFlowHandler implements GooglePayFlowHandlerInterface {
  private emitter: Emitter<GooglePayFlowHandlerEvents> = createNanoEvents<
    GooglePayFlowHandlerEvents
  >();

  on<E extends keyof GooglePayFlowHandlerEvents>(
    event: E,
    callback: GooglePayFlowHandlerEvents[E],
  ): Unsubscribe {
    return this.emitter.on(event, callback);
  }

  paymentInitiatedDonationInfo?: DonationPaymentInfo;

  async paymentInitiated(donationInfo: DonationPaymentInfo): Promise<void> {
    this.paymentInitiatedDonationInfo = donationInfo;
  }
}
