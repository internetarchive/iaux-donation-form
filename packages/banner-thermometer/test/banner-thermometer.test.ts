import { html, fixture, expect } from '@open-wc/testing';

import { BannerThermometer } from '../src/BannerThermometer.js';
import '../banner-thermometer.js';

describe('BannerThermometer', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el: BannerThermometer = await fixture(html`
      <banner-thermometer></banner-thermometer>
    `);

    expect(el.title).to.equal('Hey there');
    expect(el.counter).to.equal(5);
  });

  it('increases the counter on button click', async () => {
    const el: BannerThermometer = await fixture(html`
      <banner-thermometer></banner-thermometer>
    `);
    el.shadowRoot!.querySelector('button')!.click();

    expect(el.counter).to.equal(6);
  });

  it('can override the title via attribute', async () => {
    const el: BannerThermometer = await fixture(html`
      <banner-thermometer title="attribute title"></banner-thermometer>
    `);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el: BannerThermometer = await fixture(html`
      <banner-thermometer></banner-thermometer>
    `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
