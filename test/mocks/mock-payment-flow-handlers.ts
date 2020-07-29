import { createNanoEvents, Emitter, Unsubscribe } from 'nanoevents';

import { PaymentFlowHandlersInterface } from '../../src/payment-flow-handlers/payment-flow-handlers';
import { CreditCardFlowHandlerInterface } from '../../src/payment-flow-handlers/handlers/creditcard-flow-handler';
import { PayPalFlowHandlerInterface } from '../../src/payment-flow-handlers/handlers/paypal-flow-handler';
import { ApplePayFlowHandlerInterface } from '../../src/payment-flow-handlers/handlers/applepay-flow-handler';
import { VenmoFlowHandlerInterface } from '../../src/payment-flow-handlers/handlers/venmo-flow-handler';
import { GooglePayFlowHandlerInterface } from '../../src/payment-flow-handlers/handlers/googlepay-flow-handler';
import { DonationPaymentInfo } from '../../src/models/donation-info/donation-payment-info';
import { DonorContactInfo } from '../../src/models/common/donor-contact-info';

interface Events {
  validityChanged: (isValid: boolean) => void;
}

export class MockCreditCardFlowHandler implements CreditCardFlowHandlerInterface {
  private emitter: Emitter<Events> = createNanoEvents<Events>();

  async startup(): Promise<void> {
    console.debug('startup');
  }
  async paymentInitiated(
    donationInfo: DonationPaymentInfo,
    donorContactInfo: DonorContactInfo,
  ): Promise<void> {
    console.debug('paymentInitiated');
  }
  on<E extends keyof Events>(event: E, callback: Events[E]): Unsubscribe {
    console.debug('on');
    return this.emitter.on(event, callback);
  }
}

export class MockPaymentFlowHandlers implements PaymentFlowHandlersInterface {
  startup(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  creditCardHandler: CreditCardFlowHandlerInterface | undefined;
  paypalHandler: PayPalFlowHandlerInterface | undefined;
  applePayHandler: ApplePayFlowHandlerInterface | undefined;
  venmoHandler: VenmoFlowHandlerInterface | undefined;
  googlePayHandler: GooglePayFlowHandlerInterface | undefined;
}
