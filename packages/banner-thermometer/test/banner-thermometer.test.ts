import { html, fixture, expect } from '@open-wc/testing';

import { DonationBannerThermometer } from '../src/banner-thermometer';
import '../src/banner-thermometer';

import { MockSharedResizeObserver } from '@internetarchive/shared-resize-observer/dist/test/mock-shared-resize-observer';

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

  it('defaults to showing the goal value at the end of the thermometer and the current value', async () => {
    const el: DonationBannerThermometer = await fixture(html`
      <donation-banner-thermometer
        .currentAmount="${500_000}"
        .goalAmount=${1_000_000}
      ></donation-banner-thermometer>
    `);

    const goalMessage = el.shadowRoot?.querySelector(
      '.donate-goal'
    ) as HTMLDivElement;
    const currentValue = el.shadowRoot?.querySelector(
      '.thermometer-value'
    ) as HTMLDivElement;
    expect(goalMessage.innerText).to.equal('$1MM GOAL');
    expect(currentValue.innerText).to.equal('$0.5MM');
  });

  it('can hide the goal', async () => {
    const el: DonationBannerThermometer = await fixture(html`
      <donation-banner-thermometer
        .goalMessageMode=${'off'}
        .goalAmount=${1_000}
        .currentAmount=${1_200}
      >
      </donation-banner-thermometer>
    `);

    const goalMessage = el.shadowRoot?.querySelector('.donate-goal');
    expect(goalMessage).to.be.null;
  });

  it('can hide the current amount', async () => {
    const el: DonationBannerThermometer = await fixture(html`
      <donation-banner-thermometer
        .currentAmountMode=${'off'}
        .goalAmount=${1_000}
        .currentAmount=${1_200}
      >
      </donation-banner-thermometer>
    `);

    const currentValue = el.shadowRoot?.querySelector('.thermometer-value');
    expect(currentValue).to.be.null;
  });

  it('can display goal met message', async () => {
    const el: DonationBannerThermometer = await fixture(html`
      <donation-banner-thermometer
        .goalReachedMessage=${'GOAL MET'}
        .goalMessageMode=${'message'}
        .goalAmount=${1_000}
        .currentAmount=${1_200}
      >
      </donation-banner-thermometer>
    `);

    const goalMessage = el.shadowRoot?.querySelector(
      '.donate-goal'
    ) as HTMLDivElement;
    expect(goalMessage.innerText).to.equal('GOAL MET');
  });

  it('can display goal near message', async () => {
    const el: DonationBannerThermometer = await fixture(html`
      <donation-banner-thermometer
        .goalNearMessage=${'GOAL NEAR'}
        .goalMessageMode=${'message'}
        .goalAmount=${1_000}
        .currentAmount=${800}
      >
      </donation-banner-thermometer>
    `);

    const goalMessage = el.shadowRoot?.querySelector(
      '.donate-goal'
    ) as HTMLDivElement;
    expect(goalMessage.innerText).to.equal('GOAL NEAR');
  });

  it('rounds the display value properly', async () => {
    const el: DonationBannerThermometer = await fixture(html`
      <donation-banner-thermometer
        .goalAmount=${50_000_000}
        .currentAmount=${35_000_000}
      >
      </donation-banner-thermometer>
    `);

    const currentAmountMessage = el.shadowRoot?.querySelector(
      '.thermometer-value'
    ) as HTMLDivElement;
    expect(currentAmountMessage.innerText).to.equal('$35MM');
  });

  it('shows the current value on the right if the fill is too skinny', async () => {
    const el: DonationBannerThermometer = await fixture(html`
      <donation-banner-thermometer
        .goalAmount=${1_000_000}
        .currentAmount=${1_000}
      ></donation-banner-thermometer>
    `);

    const thermometerValue = el.shadowRoot?.querySelector(
      '.thermometer-value'
    ) as HTMLDivElement;
    const thermometerFill = el.shadowRoot?.querySelector(
      '.thermometer-fill'
    ) as HTMLDivElement;

    const sizes = new Map<Element, DOMRectReadOnly>();
    sizes.set(thermometerValue, {
      bottom: 0,
      height: 20,
      left: 0,
      right: 0,
      top: 0,
      width: 150,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    sizes.set(thermometerFill, {
      bottom: 0,
      height: 20,
      left: 0,
      right: 0,
      top: 0,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    await new Promise<void>(resolve => {
      const mockResizeObserver = new MockSharedResizeObserver({
        targetSizes: sizes,
        addObserverComplete: (): void => {
          resolve();
        },
      });

      el.resizeObserver = mockResizeObserver;
    });

    await el.updateComplete;
    const thermometerBackground = el.shadowRoot?.querySelector(
      '.thermometer-background'
    ) as HTMLDivElement;
    expect(thermometerBackground.classList.contains('value-right')).to.be.true;
  });

  it('shows the current value on the left if there is room', async () => {
    const el: DonationBannerThermometer = await fixture(html`
      <donation-banner-thermometer
        .goalAmount=${1_000_000}
        .currentAmount=${750_000}
      ></donation-banner-thermometer>
    `);

    const thermometerValue = el.shadowRoot?.querySelector(
      '.thermometer-value'
    ) as HTMLDivElement;
    const thermometerFill = el.shadowRoot?.querySelector(
      '.thermometer-fill'
    ) as HTMLDivElement;

    const sizes = new Map<Element, DOMRectReadOnly>();
    sizes.set(thermometerValue, {
      bottom: 0,
      height: 20,
      left: 0,
      right: 0,
      top: 0,
      width: 50,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    sizes.set(thermometerFill, {
      bottom: 0,
      height: 20,
      left: 0,
      right: 0,
      top: 0,
      width: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    await new Promise<void>(resolve => {
      const mockResizeObserver = new MockSharedResizeObserver({
        targetSizes: sizes,
        addObserverComplete: (): void => {
          resolve();
        },
      });

      el.resizeObserver = mockResizeObserver;
    });

    await el.updateComplete;
    const thermometerBackground = el.shadowRoot?.querySelector(
      '.thermometer-background'
    ) as HTMLDivElement;
    expect(thermometerBackground.classList.contains('value-left')).to.be.true;
  });

  it('sets the height of the banner on resize', async () => {
    const el: DonationBannerThermometer = await fixture(html`
      <donation-banner-thermometer
        .goalAmount=${1_000_000}
        .currentAmount=${1_000}
      ></donation-banner-thermometer>
    `);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const host = el.shadowRoot!.host;

    const sizes = new Map<Element, DOMRectReadOnly>();
    sizes.set(host, {
      bottom: 0,
      height: 35,
      left: 0,
      right: 0,
      top: 0,
      width: 150,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    await new Promise<void>(resolve => {
      const mockResizeObserver = new MockSharedResizeObserver({
        targetSizes: sizes,
        addObserverComplete: (): void => {
          resolve();
        },
      });

      el.resizeObserver = mockResizeObserver;
    });

    await el.updateComplete;
    const styleProperty = el.style.getPropertyValue(
      '--bannerThermometerHeight'
    );
    expect(styleProperty).to.equal('35px');
  });
});
