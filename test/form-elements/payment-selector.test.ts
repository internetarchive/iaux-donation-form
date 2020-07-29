import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import { PaymentSelector } from '../../src/form-elements/payment-selector';
import '../../src/form-elements/payment-selector';
import { MockPaymentProviders } from '../mocks/payment-providers/mock-payment-providers';
import { promisedSleep } from '../helpers/promisedSleep';

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
});
