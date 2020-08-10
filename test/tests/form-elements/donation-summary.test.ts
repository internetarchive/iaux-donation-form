import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import { DonationSummary } from '../../../src/form-elements/header/donation-summary';
import '../../../src/form-elements/header/donation-summary';
import { DonationPaymentInfo } from '../../../src/models/donation-info/donation-payment-info';
import { DonationType } from '../../../src/models/donation-info/donation-type';

describe('DonationSummary', () => {
  it('shows the proper title for one-time donations', async () => {
    const el = (await fixture(html`
      <donation-summary></donation-summary>>
    `)) as DonationSummary;

    const donationInfo = new DonationPaymentInfo({
      amount: 3.5,
      donationType: DonationType.OneTime,
      coverFees: false,
    });

    el.donationInfo = donationInfo;

    await elementUpdated(el);

    const titleElement = el.shadowRoot?.querySelector('h1');

    expect(titleElement?.innerText).to.equal('$3.50 Donation');
  });

  it('shows the proper title for monthly donations', async () => {
    const el = (await fixture(html`
      <donation-summary></donation-summary>>
    `)) as DonationSummary;

    const donationInfo = new DonationPaymentInfo({
      amount: 7.5,
      donationType: DonationType.Monthly,
      coverFees: false,
    });

    el.donationInfo = donationInfo;

    await elementUpdated(el);

    const titleElement = el.shadowRoot?.querySelector('h1');

    expect(titleElement?.innerText).to.equal('$7.50 Monthly Donation');
  });
});
