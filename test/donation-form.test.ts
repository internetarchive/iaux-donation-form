import { html, fixture, expect, elementUpdated } from '@open-wc/testing';

import '../src/donation-form';
import { DonationForm } from '../src/donation-form';
import { DonationType } from '../src/models/donation-info/donation-type';

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
});
