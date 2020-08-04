/* eslint-disable @typescript-eslint/no-unused-vars */
import { Emitter, createNanoEvents, Unsubscribe } from 'nanoevents';
import { CreditCardFlowHandlerInterface } from '../../../../src/payment-flow-handlers/handlers/creditcard-flow-handler';
import { DonationPaymentInfo } from '../../../../src/models/donation-info/donation-payment-info';
import { DonorContactInfo } from '../../../../src/models/common/donor-contact-info';

interface Events {
  validityChanged: (isValid: boolean) => void;
}

export class MockCreditCardFlowHandler implements CreditCardFlowHandlerInterface {
  startupCalled = false;
  paymentInitiatedDonationInfo?: DonationPaymentInfo;
  paymentInitiatedDonorContactInfo?: DonorContactInfo;

  private emitter: Emitter<Events> = createNanoEvents<Events>();

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

  on<E extends keyof Events>(event: E, callback: Events[E]): Unsubscribe {
    return this.emitter.on(event, callback);
  }
}
