import { html, fixture, expect } from '@open-wc/testing';

import '../../../src/donation-form-controller';
import { DonationFormController } from '../../../src/donation-form-controller';

describe('Donation form amount param', () => {
  const originalUrl = window.location.href;

  afterEach(() => {
    window.history.replaceState({}, '', originalUrl);
  });

  async function amountFor(search: string): Promise<number> {
    window.history.replaceState({}, '', `${window.location.pathname}${search}`);
    const el = (await fixture(html`
      <donation-form-controller></donation-form-controller>
    `)) as DonationFormController;
    return el.donationInfo.amount;
  }

  it('reads ?amt=1234.50 as 1234.50', async () => {
    expect(await amountFor('?amt=1234.50')).to.equal(1234.5);
  });

  it('reads ?amt=10,50 as 10.50, not 1050', async () => {
    expect(await amountFor('?amt=10,50')).to.equal(10.5);
  });

  it('reads ?amt=1,234.50 as 1234.50', async () => {
    expect(await amountFor('?amt=1,234.50')).to.equal(1234.5);
  });

  it('reads ?amt=$10 and ?amt=10 USD as 10', async () => {
    expect(await amountFor('?amt=%2410')).to.equal(10);
    expect(await amountFor('?amt=10%20USD')).to.equal(10);
  });

  it('reads ?amt=1000 as 1000', async () => {
    expect(await amountFor('?amt=1000')).to.equal(1000);
  });

  it('ignores an ?amt it cannot read instead of guessing', async () => {
    const defaultAmount = await amountFor('');
    expect(await amountFor('?amt=10.5055')).to.equal(defaultAmount);
    expect(await amountFor('?amt=12abc')).to.equal(defaultAmount);
    expect(await amountFor('?amt=1.000')).to.equal(defaultAmount);
  });
});
