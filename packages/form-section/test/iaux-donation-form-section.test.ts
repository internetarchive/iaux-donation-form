import { html, fixture, expect } from '@open-wc/testing';
import { DonationFormSection } from '../src/donation-form-section';
import '../src/donation-form-section';

describe('DonationFormSection', () => {
  it('has a default number 0, no headline, and shows the number', async () => {
    const el: DonationFormSection = await fixture(html`
      <donation-form-section></donation-form-section>
    `);

    const contentContainerDiv = el.shadowRoot?.querySelector(
      '.content-container'
    ) as HTMLElement;

    expect(el.number).to.equal(0);
    expect(el.headline).to.equal(undefined);
    expect(contentContainerDiv.classList.contains('cover-number')).to.be.false;
  });

  it('can be configured with a headline and number', async () => {
    const el: DonationFormSection = await fixture(html`
      <donation-form-section
        number="3"
        headline="Foo Bar"
      ></donation-form-section>
    `);

    const numberDiv = el.shadowRoot?.querySelector('.number') as HTMLElement;
    const headlineDiv = el.shadowRoot?.querySelector('.title') as HTMLElement;

    expect(numberDiv.innerText).to.equal('3');
    expect(headlineDiv.innerText).to.equal('Foo Bar');
  });

  it('can be configured to hide the number', async () => {
    const el: DonationFormSection = await fixture(html`
      <donation-form-section
        number="3"
        headline="Foo Bar"
        numberMode="hidenumber"
      ></donation-form-section>
    `);

    const contentContainerDiv = el.shadowRoot?.querySelector(
      '.content-container'
    ) as HTMLElement;

    expect(contentContainerDiv.classList.contains('cover-number')).to.be.true;
  });
});
