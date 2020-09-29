import { html, fixture, expect } from '@open-wc/testing';

import {
  DonationBannerThermometer,
  GoalMessageMode,
} from '../src/banner-thermometer';
import '../src/banner-thermometer';

describe('DonationBannerThermometer', () => {
  it('has a background track and fill layer', async () => {
    const el: DonationBannerThermometer = await fixture(html`
      <donation-banner-thermometer></donation-banner-thermometer>
    `);

    const background = el.shadowRoot?.querySelector('.thermometer-background');
    const fill = el.shadowRoot?.querySelector('.thermometer-fill');

    expect(background).to.exist;
    expect(fill).to.exist;
  });

  it('defaults to showing the goal value at the end of the thermometer', async () => {
    const el: DonationBannerThermometer = await fixture(html`
      <donation-banner-thermometer
        .goalAmount=${1_000_000}
      ></donation-banner-thermometer>
    `);

    const goalMessage = el.shadowRoot?.querySelector(
      '.donate-goal'
    ) as HTMLDivElement;
    expect(goalMessage.innerText).to.equal('$1,000,000 GOAL');
  });

  it('can display goal met message', async () => {
    const el: DonationBannerThermometer = await fixture(html`
      <donation-banner-thermometer
        .goalMessage=${'GOAL MET'}
        .goalMessageMode=${GoalMessageMode.ShowGoalMessage}
      >
      </donation-banner-thermometer>
    `);

    const goalMessage = el.shadowRoot?.querySelector(
      '.donate-goal'
    ) as HTMLDivElement;
    expect(goalMessage.innerText).to.equal('GOAL MET');
  });
});
