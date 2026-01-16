import { fixture, elementUpdated, expect } from '@open-wc/testing';
import { html } from 'lit';
import '../../../src/form-elements/contact-form/contact-form';
import type { ContactForm } from '../../../src/form-elements/contact-form/contact-form';

describe('ContactForm', () => {
  it('validates required fields', async () => {
    const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
    const firstNameInput = el.querySelector(
      '#donation-contact-form-first-name',
    ) as HTMLInputElement;
    const lastNameInput = el.querySelector('#donation-contact-form-last-name') as HTMLInputElement;
    const emailInput = el.querySelector('#donation-contact-form-email') as HTMLInputElement;

    firstNameInput.value = '   ';
    lastNameInput.value = ' ';
    emailInput.value = '';

    expect(firstNameInput.checkValidity()).to.be.false;
    expect(lastNameInput.checkValidity()).to.be.false;
    expect(emailInput.checkValidity()).to.be.false;

    firstNameInput.value = 'John';
    lastNameInput.value = 'Doe';
    emailInput.value = 'john.doe@example.com';
    await elementUpdated(el);

    expect(firstNameInput.checkValidity()).to.be.true;
    expect(lastNameInput.checkValidity()).to.be.true;
    expect(emailInput.checkValidity()).to.be.true;
  });

  it('requires minimum number of characters for first and last name', async () => {
    const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
    const firstNameInput = el.querySelector(
      '#donation-contact-form-first-name',
    ) as HTMLInputElement;
    const lastNameInput = el.querySelector('#donation-contact-form-last-name') as HTMLInputElement;
    expect(firstNameInput.minLength).to.equal(1);
    expect(lastNameInput.minLength).to.equal(1);
  });

  it('requires email by default', async () => {
    const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
    const emailInput = el.querySelector('#donation-contact-form-email') as HTMLInputElement;
    expect(emailInput.required).to.be.true;
  });

  describe('region and postal code requirements', () => {
    it('state and postal code required for US address', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      el.selectedCountry = 'US';
      await elementUpdated(el);
      const regionInput = el.querySelector('#donation-contact-form-region') as HTMLInputElement;
      const postalCodeInput = el.querySelector(
        '#donation-contact-form-postal-code',
      ) as HTMLInputElement;
      expect(regionInput.required).to.be.true;
      expect(postalCodeInput.required).to.be.true;
    });

    it('state and postal code optional for non-US address', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      el.selectedCountry = 'CA';
      await elementUpdated(el);
      const regionInput = el.querySelector('#donation-contact-form-region') as HTMLInputElement;
      const postalCodeInput = el.querySelector(
        '#donation-contact-form-postal-code',
      ) as HTMLInputElement;
      expect(regionInput.required).to.be.false;
      expect(postalCodeInput.required).to.be.false;
    });
  });

  describe('country selector', () => {
    it('defaults selectedCountry to US', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      expect(el.selectedCountry).to.equal('US');
    });

    it('dropdown updates selectedCountry property', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      const countrySelect = el.querySelector(
        '#donation-contact-form-countryCodeAlpha2',
      ) as HTMLSelectElement;
      countrySelect.value = 'CA';
      countrySelect.dispatchEvent(new Event('change'));
      await elementUpdated(el);
      expect(el.selectedCountry).to.equal('CA');
    });

    it('does not update selectedCountry property for invalid country code', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      const countrySelect = el.querySelector(
        '#donation-contact-form-countryCodeAlpha2',
      ) as HTMLSelectElement;
      const initialCountry = el.selectedCountry;
      countrySelect.value = 'XX'; // Invalid country code
      countrySelect.dispatchEvent(new Event('change'));
      await elementUpdated(el);
      expect(el.selectedCountry).to.equal(initialCountry);
    });
  });

  describe('reportValidity()', () => {
    it('returns false if required fields are empty and shows validation messages', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      const firstNameInput = el.querySelector(
        '#donation-contact-form-first-name',
      ) as HTMLInputElement;
      const lastNameInput = el.querySelector(
        '#donation-contact-form-last-name',
      ) as HTMLInputElement;
      const emailInput = el.querySelector('#donation-contact-form-email') as HTMLInputElement;

      firstNameInput.value = '';
      lastNameInput.value = '';
      emailInput.value = '';

      const validityResult = el.reportValidity();

      expect(validityResult).to.be.false;
      expect(firstNameInput.validationMessage).to.not.equal('');
      expect(lastNameInput.validationMessage).to.not.equal('');
      expect(emailInput.validationMessage).to.not.equal('');
    });

    it('returns true if all required fields are filled correctly', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      const firstNameInput = el.querySelector(
        '#donation-contact-form-first-name',
      ) as HTMLInputElement;
      const lastNameInput = el.querySelector(
        '#donation-contact-form-last-name',
      ) as HTMLInputElement;
      const emailInput = el.querySelector('#donation-contact-form-email') as HTMLInputElement;
      const streetAddressInput = el.querySelector(
        '#donation-contact-form-street-address',
      ) as HTMLInputElement;
      const cityInput = el.querySelector('#donation-contact-form-locality') as HTMLInputElement;
      const regionInput = el.querySelector('#donation-contact-form-region') as HTMLInputElement;
      const postalCodeInput = el.querySelector(
        '#donation-contact-form-postal-code',
      ) as HTMLInputElement;

      streetAddressInput.value = '123 Main St';
      cityInput.value = 'Anytown';
      regionInput.value = 'CA';
      postalCodeInput.value = '12345';

      firstNameInput.value = 'John';
      lastNameInput.value = 'Doe';
      emailInput.value = 'john.doe@example.com';

      const validityResult = el.reportValidity();

      expect(validityResult).to.be.true;
      expect(firstNameInput.validationMessage).to.equal('');
      expect(lastNameInput.validationMessage).to.equal('');
      expect(emailInput.validationMessage).to.equal('');
    });
  });
});
