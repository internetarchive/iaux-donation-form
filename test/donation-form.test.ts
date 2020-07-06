import {
  html, fixture, expect
} from '@open-wc/testing';

import { DonationForm } from '../src/donation-form';


describe('Donation Form', () => {
  describe('Configuration', () => {
    it('has no configuration', async () => {
      const el = await fixture(html`
        <donation-form></donation-form>
      `) as DonationForm;

      expect(el.braintreeManager).to.equal(undefined);
    });
  });
});
