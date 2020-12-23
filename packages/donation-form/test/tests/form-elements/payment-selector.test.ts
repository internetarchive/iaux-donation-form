import { html, fixture, expect, elementUpdated, oneEvent } from '@open-wc/testing';
import { PaymentSelector } from '../../../src/form-elements/payment-selector';
import '../../../src/form-elements/payment-selector';
import { MockPaymentProviders } from '../../mocks/payment-providers/mock-payment-providers';
import { promisedSleep } from '../../helpers/promisedSleep';

describe('Payment Selector', () => {
  it('shows Venmo if it is available', async () => {
    const el = (await fixture(html`
      <payment-selector></payment-selector>
    `)) as PaymentSelector;

    const paymentProviders = new MockPaymentProviders();
    el.paymentProviders = paymentProviders;
    await elementUpdated(el);
    await promisedSleep(250);

    const venmoButton = el.shadowRoot?.querySelector('.venmo.provider-button');
    expect(venmoButton?.classList.contains('available')).to.be.true;
  });

  it('can show PayPal when called', async () => {
    const el = (await fixture(html`
      <payment-selector></payment-selector>
    `)) as PaymentSelector;
    el.showPaypalButton();
    await elementUpdated(el);
    const paypalButton = el.shadowRoot?.querySelector('.paypal-container.provider-button');
    expect(paypalButton?.classList.contains('available')).to.be.true;
  });

  it('emits paypalBlockerSelected event when paypal is selected in an error state', async () => {
    const el = (await fixture(html`
      <payment-selector></payment-selector>
    `)) as PaymentSelector;
    const paypalBlocker = el.shadowRoot?.querySelector('.paypal-local-button');
    const clickEvent = new MouseEvent('click');
    setTimeout(() => {
      paypalBlocker?.dispatchEvent(clickEvent);
    });
    const response = await oneEvent(el, 'paypalBlockerSelected');
    expect(response).to.exist;
  });

  it('emits applePaySelected event with original click event when ApplePay is selected', async () => {
    const el = (await fixture(html`
      <payment-selector></payment-selector>
    `)) as PaymentSelector;
    const paypalBlocker = el.shadowRoot?.querySelector('.applepay.provider-button');
    const clickEvent = new MouseEvent('click');
    setTimeout(() => {
      paypalBlocker?.dispatchEvent(clickEvent);
    });
    const response = await oneEvent(el, 'applePaySelected');
    const event = response.detail.originalEvent;
    expect(event).to.equal(clickEvent);
  });

  it('emits googlePaySelected when GooglePay is selected', async () => {
    const el = (await fixture(html`
      <payment-selector></payment-selector>
    `)) as PaymentSelector;
    const paypalBlocker = el.shadowRoot?.querySelector('.googlepay.provider-button');
    const clickEvent = new MouseEvent('click');
    setTimeout(() => {
      paypalBlocker?.dispatchEvent(clickEvent);
    });
    const response = await oneEvent(el, 'googlePaySelected');
    expect(response).to.exist;
  });

  it('shows the credit card text if requested', async () => {
    const el = (await fixture(html`
      <payment-selector ?showCreditCardButtonText=${true}></payment-selector>
    `)) as PaymentSelector;
    const paymentContainer = el.shadowRoot?.querySelector('.payment-container');
    const hasShowTextClass = paymentContainer?.classList.contains('show-cc-text');
    expect(hasShowTextClass).to.be.true;
  });

  it('hides the credit card text if requested', async () => {
    const el = (await fixture(html`
      <payment-selector ?showCreditCardButtonText=${false}></payment-selector>
    `)) as PaymentSelector;
    const paymentContainer = el.shadowRoot?.querySelector('.payment-container');
    const hasHideTextClass = paymentContainer?.classList.contains('hide-cc-text');
    expect(hasHideTextClass).to.be.true;
  });
});
