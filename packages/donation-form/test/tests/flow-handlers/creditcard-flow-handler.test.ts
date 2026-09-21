import { expect, fixture, html } from '@open-wc/testing';
import { CreditCardFlowHandler } from '../../../src/payment-flow-handlers/handlers/creditcard-flow-handler';
import { DonationFlowModalManagerInterface } from '../../../src/payment-flow-handlers/donation-flow-modal-manager';
import { MockBraintreeManager } from '../../mocks/mock-braintree-manager';
import { MockRecaptchaManager } from '../../mocks/mock-recaptcha-manager';
import { MockHostedFieldsClient } from '../../mocks/payment-clients/mock-hostedfields-client';
import { CreditCardHandlerInterface } from '../../../src/braintree-manager/payment-providers/credit-card/credit-card-interface';
import '../../../src/form-elements/badged-input';
import type { BadgedInput } from '../../../src/form-elements/badged-input';

// CreditCardFlowHandler.startup() never touches the modal manager - only a
// stand-in to satisfy the constructor's type.
const stubModalManager = {
  closeModal: () => undefined,
  showProcessingModal: () => undefined,
  showErrorModal: () => undefined,
} as unknown as DonationFlowModalManagerInterface;

describe('CreditCardFlowHandler', () => {
  it('clears a field error and hides the error message on focus', async () => {
    const braintreeManager = new MockBraintreeManager();
    const creditCardHandler: CreditCardHandlerInterface =
      await braintreeManager.paymentProviders.creditCardHandler.get();

    let hideErrorMessageCalled = false;
    creditCardHandler.hideErrorMessage = (): void => {
      hideErrorMessageCalled = true;
    };

    const flowHandler = new CreditCardFlowHandler({
      braintreeManager,
      donationFlowModalManager: stubModalManager,
      recaptchaManager: new MockRecaptchaManager(),
    });
    await flowHandler.startup();

    const instance = (await creditCardHandler.instance.get()) as MockHostedFieldsClient;

    const badgedInput = (await fixture(html`<badged-input></badged-input>`)) as BadgedInput;
    const container = document.createElement('div');
    badgedInput.appendChild(container);
    badgedInput.error = true;

    instance.emitEvent('focus', {
      emittedBy: 'number',
      cards: [],
      fields: {
        number: {
          container,
          isFocused: true,
          isEmpty: false,
          isPotentiallyValid: true,
          isValid: true,
        },
      },
    } as unknown as braintree.HostedFieldsStateObject);

    expect(badgedInput.error).to.be.false;
    expect(hideErrorMessageCalled).to.be.true;
  });

  it('does not mark an empty field errored on blur', async () => {
    // Regression test for WEBDEV-8310 QA feedback: clicking a nearby button
    // (e.g. "Change payment method") blurs a hosted field. An untouched/empty
    // field shouldn't flash red just from that - only actually-invalid
    // content should.
    const braintreeManager = new MockBraintreeManager();
    const creditCardHandler: CreditCardHandlerInterface =
      await braintreeManager.paymentProviders.creditCardHandler.get();

    const flowHandler = new CreditCardFlowHandler({
      braintreeManager,
      donationFlowModalManager: stubModalManager,
      recaptchaManager: new MockRecaptchaManager(),
    });
    await flowHandler.startup();

    const instance = (await creditCardHandler.instance.get()) as MockHostedFieldsClient;

    const badgedInput = (await fixture(html`<badged-input></badged-input>`)) as BadgedInput;
    const container = document.createElement('div');
    badgedInput.appendChild(container);

    instance.emitEvent('blur', {
      emittedBy: 'number',
      cards: [],
      fields: {
        number: {
          container,
          isFocused: false,
          isEmpty: true,
          isPotentiallyValid: true,
          isValid: false,
        },
      },
    } as unknown as braintree.HostedFieldsStateObject);

    expect(badgedInput.error).to.be.false;
  });

  it('marks a non-empty invalid field errored on blur', async () => {
    const braintreeManager = new MockBraintreeManager();
    const creditCardHandler: CreditCardHandlerInterface =
      await braintreeManager.paymentProviders.creditCardHandler.get();

    const flowHandler = new CreditCardFlowHandler({
      braintreeManager,
      donationFlowModalManager: stubModalManager,
      recaptchaManager: new MockRecaptchaManager(),
    });
    await flowHandler.startup();

    const instance = (await creditCardHandler.instance.get()) as MockHostedFieldsClient;

    const badgedInput = (await fixture(html`<badged-input></badged-input>`)) as BadgedInput;
    const container = document.createElement('div');
    badgedInput.appendChild(container);

    instance.emitEvent('blur', {
      emittedBy: 'number',
      cards: [],
      fields: {
        number: {
          container,
          isFocused: false,
          isEmpty: false,
          isPotentiallyValid: false,
          isValid: false,
        },
      },
    } as unknown as braintree.HostedFieldsStateObject);

    expect(badgedInput.error).to.be.true;
  });

  it('emits validityChanged based on the combined validity of number/cvv/expirationDate', async () => {
    const braintreeManager = new MockBraintreeManager();
    const creditCardHandler: CreditCardHandlerInterface =
      await braintreeManager.paymentProviders.creditCardHandler.get();

    const flowHandler = new CreditCardFlowHandler({
      braintreeManager,
      donationFlowModalManager: stubModalManager,
      recaptchaManager: new MockRecaptchaManager(),
    });
    await flowHandler.startup();

    const instance = (await creditCardHandler.instance.get()) as MockHostedFieldsClient;

    const emitted: boolean[] = [];
    flowHandler.on('validityChanged', isValid => emitted.push(isValid));

    instance.emitValidityChangedEvent(true);
    instance.emitValidityChangedEvent(false);

    expect(emitted).to.deep.equal([true, false]);
  });
});
