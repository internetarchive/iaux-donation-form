/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaymentFlowHandlersInterface } from '../../../src/payment-flow-handlers/payment-flow-handlers';
import { MockCreditCardFlowHandler } from './individual-handlers/mock-creditcard-flow-handler';
import { MockPayPalFlowHandler } from './individual-handlers/mock-paypal-flow-handler';
import { MockApplePayFlowHandler } from './individual-handlers/mock-applepay-flow-handler';
import { MockVenmoFlowHandler } from './individual-handlers/mock-venmo-flow-handler';
import { MockGooglePayFlowHandler } from './individual-handlers/mock-googlepay-flow-handler';
import { UpsellModalCTAMode } from '../../../src/modals/upsell-modal-content';
import { DonationType } from '@internetarchive/donation-form-data-models';

export class MockPaymentFlowHandlers implements PaymentFlowHandlersInterface {
  showUpsellModal(options: {
    oneTimeAmount: number;
    ctaMode?: UpsellModalCTAMode;
    yesSelected?: (amount: number) => void;
    noSelected?: () => void;
    amountChanged?: (amount: number) => void;
    userClosedModalCallback?: () => void;
  }): Promise<void> {
    throw new Error('Method not implemented.');
  }
  showConfirmationStepModal(options: {
    amount: number;
    donationType: DonationType;
    currencyType: string;
  }): Promise<void> {
    throw new Error('Method not implemented.');
  }
  startupCalled = false;
  async startup(): Promise<void> {
    this.startupCalled = true;
    this.venmoHandler?.startup();
  }
  creditCardHandler: MockCreditCardFlowHandler = new MockCreditCardFlowHandler();
  paypalHandler: MockPayPalFlowHandler = new MockPayPalFlowHandler();
  applePayHandler: MockApplePayFlowHandler = new MockApplePayFlowHandler();
  venmoHandler: MockVenmoFlowHandler = new MockVenmoFlowHandler();
  googlePayHandler: MockGooglePayFlowHandler = new MockGooglePayFlowHandler();
}
