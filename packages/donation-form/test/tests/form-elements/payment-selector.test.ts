import { html, fixture, expect, elementUpdated, oneEvent } from '@open-wc/testing';
import { PaymentSelector } from '../../../src/form-elements/payment-selector';
import '../../../src/form-elements/payment-selector';
import { MockPaymentProviders } from '../../mocks/payment-providers/mock-payment-providers';
import { promisedSleep } from '../../../src/util/promisedSleep';

describe('Payment Selector', () => {
  it('shows Venmo if it is available', async () => {
    const el = (await fixture(html` <payment-selector></payment-selector> `)) as PaymentSelector;

    const paymentProviders = new MockPaymentProviders();
    el.paymentProviders = paymentProviders;
    await elementUpdated(el);
    await promisedSleep(250);

    const venmoButton = el.shadowRoot?.querySelector('.venmo.provider-button');
    expect(venmoButton?.classList.contains('available')).to.be.true;
  });

  it('can show PayPal when called', async () => {
    const el = (await fixture(html` <payment-selector></payment-selector> `)) as PaymentSelector;
    el.showPaypalButton();
    await elementUpdated(el);
    const paypalButton = el.shadowRoot?.querySelector('.paypal-container.provider-button');
    expect(paypalButton?.classList.contains('available')).to.be.true;
  });

  it('emits paypalBlockerSelected event when paypal is selected in an error state', async () => {
    const el = (await fixture(html` <payment-selector></payment-selector> `)) as PaymentSelector;
    const paypalBlocker = el.shadowRoot?.querySelector('.paypal-local-button');
    const clickEvent = new MouseEvent('click');
    setTimeout(() => {
      paypalBlocker?.dispatchEvent(clickEvent);
    });
    const response = await oneEvent(el, 'paypalBlockerSelected');
    expect(response).to.exist;
  });

  it('emits applePaySelected event with original click event when ApplePay is selected', async () => {
    const el = (await fixture(html` <payment-selector></payment-selector> `)) as PaymentSelector;
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
    const el = (await fixture(html` <payment-selector></payment-selector> `)) as PaymentSelector;
    const paypalBlocker = el.shadowRoot?.querySelector('.googlepay.provider-button');
    const clickEvent = new MouseEvent('click');
    setTimeout(() => {
      paypalBlocker?.dispatchEvent(clickEvent);
    });
    const response = await oneEvent(el, 'googlePaySelected');
    expect(response).to.exist;
  });

  describe('credit-card-fields slot', () => {
    it('does not render the credit-card-fields slot before a payment method is selected', async () => {
      const el = (await fixture(html`
        <payment-selector>
          <div slot="credit-card-fields" id="my-card-fields">card fields here</div>
        </payment-selector>
      `)) as PaymentSelector;

      const slot = el.shadowRoot?.querySelector('slot[name="credit-card-fields"]');
      expect(slot).to.not.exist;
    });

    it('renders the credit-card-fields slot below the Change payment method button once a payment method is selected', async () => {
      const el = (await fixture(html`
        <payment-selector>
          <div slot="credit-card-fields" id="my-card-fields">card fields here</div>
        </payment-selector>
      `)) as PaymentSelector;

      const creditCardButton = el.shadowRoot?.querySelector(
        '.credit-card-button',
      ) as HTMLButtonElement;
      creditCardButton.click();
      await elementUpdated(el);

      const changeButton = el.shadowRoot?.querySelector('#change-payment-method');
      const slot = el.shadowRoot?.querySelector('slot[name="credit-card-fields"]');
      expect(slot).to.exist;

      // the slot should come after the "Change payment method" button in DOM order
      expect(changeButton?.compareDocumentPosition(slot as Node)).to.equal(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );

      // content passed into the slot is actually projected (assignedElements)
      const assigned = (slot as HTMLSlotElement).assignedElements();
      expect(assigned.map(node => node.id)).to.include('my-card-fields');
    });
  });
});
