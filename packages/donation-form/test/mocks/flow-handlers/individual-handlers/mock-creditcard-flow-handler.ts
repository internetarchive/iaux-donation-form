import { Emitter, createNanoEvents, Unsubscribe } from 'nanoevents';
import {
  CreditCardFlowHandlerInterface,
  CreditCardFlowHandlerEvents,
} from '../../../../src/payment-flow-handlers/handlers/creditcard-flow-handler';
import { DonationPaymentInfo, DonorContactInfo } from '@internetarchive/donation-form-data-models';

export class MockCreditCardFlowHandler implements CreditCardFlowHandlerInterface {
  startupCalled = false;
  paymentInitiatedDonationInfo?: DonationPaymentInfo;
  paymentInitiatedDonorContactInfo?: DonorContactInfo;
  hostedFieldsResponse?: braintree.HostedFieldsTokenizePayload;

  private emitter: Emitter<CreditCardFlowHandlerEvents> =
    createNanoEvents<CreditCardFlowHandlerEvents>();

  emitValidHostedFieldsEvent(): void {
    this.emitter.emit('validityChanged', true);
  }

  async startup(): Promise<void> {
    this.startupCalled = true;
  }

  async tokenizeFields(): Promise<braintree.HostedFieldsTokenizePayload | undefined> {
    return undefined;
  }

  async paymentInitiated(
    hostedFieldsResponse: braintree.HostedFieldsTokenizePayload,
    donationInfo: DonationPaymentInfo,
    donorContactInfo: DonorContactInfo,
  ): Promise<void> {
    this.hostedFieldsResponse = hostedFieldsResponse;
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
