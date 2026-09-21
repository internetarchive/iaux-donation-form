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
    firstNameInput.value = 'A';
    lastNameInput.value = 'B';
    await elementUpdated(el);
    expect(firstNameInput.checkValidity()).to.be.false;
    expect(lastNameInput.checkValidity()).to.be.false;
  });

  it('requires email by default', async () => {
    const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
    const emailInput = el.querySelector('#donation-contact-form-email') as HTMLInputElement;
    expect(emailInput.required).to.be.true;
  });

  it('street address requires minimum number of characters', async () => {
    const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
    const streetAddressInput = el.querySelector(
      '#donation-contact-form-street-address',
    ) as HTMLInputElement;
    streetAddressInput.value = '1 b';
    await elementUpdated(el);
    expect(streetAddressInput.checkValidity()).to.be.false;
    streetAddressInput.value = '1 st';
    await elementUpdated(el);
    expect(streetAddressInput.checkValidity()).to.be.true;
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

    it('only validates zip code pattern for US addresses', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      const postalCodeInput = el.querySelector(
        '#donation-contact-form-postal-code',
      ) as HTMLInputElement;

      // Test for US
      el.selectedCountry = 'US';
      await elementUpdated(el);
      postalCodeInput.value = '1234'; // Invalid US zip
      await elementUpdated(el);
      expect(postalCodeInput.checkValidity()).to.be.false;

      // Test for CA
      el.selectedCountry = 'CA';
      await elementUpdated(el);
      postalCodeInput.value = '1234'; // Should be valid since pattern is not applied
      await elementUpdated(el);
      expect(postalCodeInput.checkValidity()).to.be.true;
    });
  });

  describe('postal code validation pattern', () => {
    it('validates US postal codes correctly', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      el.selectedCountry = 'US';
      await elementUpdated(el);
      const postalCodeInput = el.querySelector(
        '#donation-contact-form-postal-code',
      ) as HTMLInputElement;

      const validPostalCodes = ['12345', '12345-6789', '123456789'];
      const invalidPostalCodes = ['1234', '123456', '1234A', 'ABCDE', '12345-678'];

      for (const code of validPostalCodes) {
        postalCodeInput.value = code;
        await elementUpdated(el);
        expect(postalCodeInput.checkValidity(), `Expected ${code} to be valid`).to.be.true;
      }

      for (const code of invalidPostalCodes) {
        postalCodeInput.value = code;
        await elementUpdated(el);
        expect(postalCodeInput.checkValidity(), `Expected ${code} to be invalid`).to.be.false;
      }
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

  describe('accessible labels', () => {
    it('renders a real, visible label associated with every text field', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;

      const fieldsAndLabels: [string, string][] = [
        ['donation-contact-form-email', 'Email *'],
        ['donation-contact-form-first-name', 'First name *'],
        ['donation-contact-form-last-name', 'Last name *'],
        ['donation-contact-form-street-address', 'Address *'],
        ['donation-contact-form-locality', 'City *'],
        ['donation-contact-form-region', 'State / Province *'],
        ['donation-contact-form-postal-code', 'Zip / Postal Code *'],
      ];

      fieldsAndLabels.forEach(([id, text]) => {
        const label = el.querySelector(`label[for="${id}"]`) as HTMLLabelElement;
        expect(label, `expected a label for #${id}`).to.exist;
        expect(label.textContent?.replace(/\s+/g, ' ').trim()).to.equal(text);

        // the label must actually be visible, not sr-only clipped off-screen
        const style = getComputedStyle(label);
        expect(style.position, `label for #${id} should not be visually hidden`).to.not.equal(
          'absolute',
        );
      });
    });

    it('has a real, visible label for the country selector', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      const label = el.querySelector(
        'label[for="donation-contact-form-countryCodeAlpha2"]',
      ) as HTMLLabelElement;
      expect(label).to.exist;
      expect(label.textContent?.replace(/\s+/g, ' ').trim()).to.equal('Country *');
    });

    it('does not use placeholder text on any field', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      const inputs = el.querySelectorAll('input.donation-contact-form-input');
      expect(inputs.length).to.be.greaterThan(0);
      inputs.forEach(input => {
        expect((input as HTMLInputElement).placeholder).to.equal('');
      });
    });
  });

  describe('field layout', () => {
    it('renders First name and Last name side by side in the same row', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      const firstNameField = el.querySelector('.donation-contact-form-first-name') as HTMLElement;
      const lastNameField = el.querySelector('.donation-contact-form-last-name') as HTMLElement;

      expect(firstNameField.closest('.row')).to.equal(lastNameField.closest('.row'));
    });

    it('renders the Country row above the Region/Zip row', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      const countryRow = (
        el.querySelector('#donation-contact-form-countryCodeAlpha2') as HTMLElement
      ).closest('.row') as HTMLElement;
      const regionRow = (el.querySelector('#donation-contact-form-region') as HTMLElement).closest(
        '.row',
      ) as HTMLElement;

      expect(
        countryRow.compareDocumentPosition(regionRow) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).to.be.greaterThan(0);
    });

    it('no longer has an Address Line 2 field', async () => {
      const el = (await fixture(html`<contact-form></contact-form>`)) as ContactForm;
      expect(el.querySelector('#donation-contact-form-extended-address')).to.be.null;
      expect(el.billingInfo.extendedAddress).to.be.undefined;
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
