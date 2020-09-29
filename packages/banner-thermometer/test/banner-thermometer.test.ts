import { html, fixture, expect } from '@open-wc/testing';

import {
  BannerThermometer,
  GoalMessageMode,
} from '../src/banner-thermometer.js';
import '../banner-thermometer.js';

describe('BannerThermometer', () => {
  it('has a background track and fill layer', async () => {
    const el: BannerThermometer = await fixture(html`
      <banner-thermometer></banner-thermometer>
    `);

    const background = el.shadowRoot?.querySelector('.thermometer-background');
    const fill = el.shadowRoot?.querySelector('.thermometer-fill');

    expect(background).to.exist;
    expect(fill).to.exist;
  });

  it('defaults to showing the goal value at the end of the thermometer', async () => {
    const el: BannerThermometer = await fixture(html`
      <banner-thermometer .goalAmount=${1_000_000}></banner-thermometer>
    `);

    const goalMessage = el.shadowRoot?.querySelector(
      '.donate-goal'
    ) as HTMLDivElement;
    expect(goalMessage.innerText).to.equal('$1,000,000');
  });

  it('can display goal met message', async () => {
    const el: BannerThermometer = await fixture(html`
      <banner-thermometer
        .goalMetMessage=${'GOAL MET'}
        .goalMessageMode=${GoalMessageMode.GoalMet}
      >
      </banner-thermometer>
    `);

    const goalMessage = el.shadowRoot?.querySelector(
      '.donate-goal'
    ) as HTMLDivElement;
    expect(goalMessage.innerText).to.equal('GOAL MET');
  });
});
