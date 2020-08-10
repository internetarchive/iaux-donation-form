/* eslint-disable @typescript-eslint/no-unused-vars */
import { Emitter, createNanoEvents, Unsubscribe } from 'nanoevents';
import {
  CreditCardFlowHandlerInterface,
  CreditCardFlowHandlerEvents,
} from '../../../../src/payment-flow-handlers/handlers/creditcard-flow-handler';
import { DonationPaymentInfo } from '../../../../src/models/donation-info/donation-payment-info';
import { DonorContactInfo } from '../../../../src/models/common/donor-contact-info';

export class MockCreditCardFlowHandler implements CreditCardFlowHandlerInterface {
  startupCalled = false;
  paymentInitiatedDonationInfo?: DonationPaymentInfo;
  paymentInitiatedDonorContactInfo?: DonorContactInfo;

  private emitter: Emitter<CreditCardFlowHandlerEvents> = createNanoEvents<
    CreditCardFlowHandlerEvents
  >();

  emitValidHostedFieldsEvent(): void {
    this.emitter.emit('validityChanged', true);
  }

  async startup(): Promise<void> {
    this.startupCalled = true;
  }

  async paymentInitiated(
    donationInfo: DonationPaymentInfo,
    donorContactInfo: DonorContactInfo,
  ): Promise<void> {
    this.paymentInitiatedDonationInfo = donationInfo;
    this.paymentInitiatedDonorContactInfo = donorContactInfo;
  }

  on<E extends keyof CreditCardFlowHandlerEvents>(
    event: E,
    callback: CreditCardFlowHandlerEvents[E],
  ): Unsubscribe {
    return this.emitter.on(event, callback);
  }
}
