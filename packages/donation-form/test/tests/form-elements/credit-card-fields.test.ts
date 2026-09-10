import { fixture, elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../../../src/form-elements/credit-card-fields';
import type { CreditCardFields } from '../../../src/form-elements/credit-card-fields';
import type { BadgedInput } from '../../../src/form-elements/badged-input';
import { HostedFieldName } from '../../../src/braintree-manager/payment-providers/credit-card/hosted-field-container';

describe('CreditCardFields', () => {
  it('renders a visible label above each card field', async () => {
    const el = (await fixture(html`<credit-card-fields></credit-card-fields>`)) as CreditCardFields;

    const labels = Array.from(el.querySelectorAll('.field-label')) as HTMLElement[];
    const labelTexts = labels.map(label => label.textContent?.trim());

    expect(labelTexts).to.include('Card number');
    expect(labelTexts).to.include('Expiration');
    expect(labelTexts).to.include('CVC');

    // labels must actually be visible (not sr-only clipped off-screen)
    labels.forEach(label => {
      const style = getComputedStyle(label);
      expect(style.position).to.not.equal('absolute');
    });
  });

  it('marks and clears field errors on the correct badged-input via hostedFieldContainer', async () => {
    const el = (await fixture(html`<credit-card-fields></credit-card-fields>`)) as CreditCardFields;

    const numberBadgedInput = el.querySelector('badged-input.creditcard') as BadgedInput;
    const cvvBadgedInput = el.querySelector('badged-input.cvv') as BadgedInput;

    expect(numberBadgedInput.error).to.be.false;
    expect(cvvBadgedInput.error).to.be.false;

    el.hostedFieldContainer.markFieldErrors([HostedFieldName.Number, HostedFieldName.CVV]);
    await elementUpdated(numberBadgedInput);
    await elementUpdated(cvvBadgedInput);

    expect(numberBadgedInput.error).to.be.true;
    expect(cvvBadgedInput.error).to.be.true;

    el.hostedFieldContainer.removeFieldErrors([HostedFieldName.Number, HostedFieldName.CVV]);
    await elementUpdated(numberBadgedInput);
    await elementUpdated(cvvBadgedInput);

    expect(numberBadgedInput.error).to.be.false;
    expect(cvvBadgedInput.error).to.be.false;
  });

  it('shows and hides the shared error message', async () => {
    const el = (await fixture(html`<credit-card-fields></credit-card-fields>`)) as CreditCardFields;

    const errorMessage = el.querySelector('#braintree-error-message') as HTMLDivElement;

    el.hostedFieldContainer.showErrorMessage('Something went wrong');
    expect(errorMessage.innerHTML).to.equal('Something went wrong');
    expect(errorMessage.style.display).to.equal('block');

    el.hostedFieldContainer.hideErrorMessage();
    expect(errorMessage.style.display).to.equal('none');
  });

  it('resets the hosted field containers, clearing any injected Braintree iframes', async () => {
    const el = (await fixture(html`<credit-card-fields></credit-card-fields>`)) as CreditCardFields;

    const numberField = el.querySelector('#braintree-creditcard') as HTMLDivElement;
    numberField.appendChild(document.createElement('iframe'));
    expect(numberField.childNodes.length).to.equal(1);

    el.hostedFieldContainer.resetHostedFields();

    expect(numberField.childNodes.length).to.equal(0);
  });
});
