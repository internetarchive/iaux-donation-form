import { html, fixture, expect, elementUpdated } from '@open-wc/testing';

import '../src/donation-form';
import { DonationForm } from '../src/donation-form';
import { DonationType } from '../src/models/donation-info/donation-type';
import { PaymentSelector } from '../src/form-elements/payment-selector';

describe('Donation Form', () => {
  describe('Configuration', () => {
    it('has no configuration', async () => {
      const el = (await fixture(html`
        <donation-form></donation-form>
      `)) as DonationForm;

      expect(el.braintreeManager).to.equal(undefined);
      expect(el.donationRequest).to.equal(undefined);
    });

    it('updates donationInfo when user changes donation info', async () => {
      const el = (await fixture(html`
        <donation-form></donation-form>
      `)) as DonationForm;

      const donationHeader = el.shadowRoot?.querySelector('donation-form-header');
      const editDonation = donationHeader?.shadowRoot?.querySelector('edit-donation');
      const monthlyOption = editDonation?.shadowRoot?.querySelector('#donationType-monthly-option');

      const clickEvent = new MouseEvent('click');

      monthlyOption?.dispatchEvent(clickEvent);
      await elementUpdated(el);
      expect(el.donationInfo.donationType).to.equal(DonationType.Monthly);
    });
  });

  it('shows the contact form when Credit Card is selected', async () => {
    const el = (await fixture(html`
      <donation-form></donation-form>
    `)) as DonationForm;

    const contactFormSection = el.shadowRoot?.querySelector('.contact-form-section');
    const paymentSelector = el.shadowRoot?.querySelector('payment-selector') as PaymentSelector;
    const creditCardButton = paymentSelector.shadowRoot?.querySelector(
      '.credit-card-button',
    ) as HTMLButtonElement;

    expect(contactFormSection?.classList.contains('hidden')).to.be.true;

    const clickEvent = new MouseEvent('click');
    creditCardButton.dispatchEvent(clickEvent);
    await elementUpdated(el);

    expect(contactFormSection?.classList.contains('hidden')).to.be.false;
  });
});
