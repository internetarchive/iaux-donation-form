import { html, fixture, expect } from '@open-wc/testing';

import '../../src/donation-form-controller';
import { DonationFormController } from '../../src/donation-form-controller';

describe('Donation Form Controller', () => {
  it('has no shadowRoot', async () => {
    const el = (await fixture(html`
      <donation-form-controller></donation-form-controller>
    `)) as DonationFormController;

    expect(el.shadowRoot).to.equal(null);
  });
});
