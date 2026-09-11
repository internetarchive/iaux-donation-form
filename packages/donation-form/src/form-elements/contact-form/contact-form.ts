import { LitElement, html, css, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import {
  BillingInfo,
  CustomerInfo,
  DonorContactInfo,
} from '@internetarchive/donation-form-data-models';
import { AutoCompleteFieldOptions } from './autocomplete-field-options';
import { SpacerOption } from '../badged-input';
import { BadgedInput } from '../badged-input';
import '../badged-input';

import { countries } from './countries';
import { msg } from '@lit/localize';

@customElement('contact-form')
export class ContactForm extends LitElement {
  @query('badged-input.donation-contact-form-email') emailBadgedInput!: BadgedInput;
  @query('#donation-contact-form-email') emailField!: HTMLInputElement;

  @query('badged-input.donation-contact-form-first-name') firstNameBadgedInput!: BadgedInput;
  @query('#donation-contact-form-first-name') firstNameField!: HTMLInputElement;

  @query('badged-input.donation-contact-form-last-name') lastNameBadgedInput!: BadgedInput;
  @query('#donation-contact-form-last-name') lastNameField!: HTMLInputElement;

  @query('badged-input.donation-contact-form-postal-code') postalBadgedInput!: BadgedInput;
  @query('#donation-contact-form-postal-code') postalCodeField!: HTMLInputElement;

  @query('badged-input.donation-contact-form-street-address')
  streetAddressBadgedInput!: BadgedInput;
  @query('#donation-contact-form-street-address') streetAddressField!: HTMLInputElement;

  @query('badged-input.donation-contact-form-locality') localityBadgedInput!: BadgedInput;
  @query('#donation-contact-form-locality') localityField!: HTMLInputElement;

  @query('badged-input.donation-contact-form-region') regionBadgedInput!: BadgedInput;
  @query('#donation-contact-form-region') regionField!: HTMLInputElement;

  @query('#donation-contact-form-countryCodeAlpha2') countryCodeAlpha2Field!: HTMLSelectElement;

  @query('#donation-contact-form-error-message') errorMessage!: HTMLDivElement;
  @query('form') form!: HTMLFormElement;

  /** @keyof countries */
  @property({ type: String }) selectedCountry = 'US';

  @property({ type: String }) donorEmail = '';

  updated(changed: PropertyValues): void {
    if (changed.has('donorEmail')) {
      this.emailField.value = this.donorEmail ?? '';
    }
  }

  reportValidity(): boolean {
    this.validateFormFields();
    return this.validateForm();
  }

  // validate each field and set the error state on the badged-inputs
  private validateFormFields(): void {
    const fields: {
      badgedInput: BadgedInput;
      inputField: HTMLInputElement;
    }[] = [
      { badgedInput: this.emailBadgedInput, inputField: this.emailField },
      { badgedInput: this.firstNameBadgedInput, inputField: this.firstNameField },
      { badgedInput: this.lastNameBadgedInput, inputField: this.lastNameField },
      { badgedInput: this.streetAddressBadgedInput, inputField: this.streetAddressField },
      { badgedInput: this.localityBadgedInput, inputField: this.localityField },
      { badgedInput: this.regionBadgedInput, inputField: this.regionField },
      { badgedInput: this.postalBadgedInput, inputField: this.postalCodeField },
    ];
    fields.forEach(({ badgedInput, inputField }) => {
      badgedInput.error = !inputField.checkValidity();
    });
  }

  // validate the overall form and show error messages
  private validateForm(): boolean {
    const isValid = this.form.reportValidity();

    if (!isValid) {
      this.errorMessage.innerText = msg(
        'Please enter any missing or invalid contact information below',
      );
    } else {
      this.errorMessage.innerText = '';
    }

    return isValid;
  }

  focus(): void {
    this.emailField.focus();
  }

  // minimum two non-whitespace characters
  private minTwoCharPattern = '.*\\S{2,}.*';
  private minTwoCharValidationMessage = msg('Enter at least two characters');

  // at least two non-whitespace characters with at least two characters in between them
  private streetAddressPattern = '.*?\\S.{2,}\\S.*?';
  private streetAddressValidationMessage = msg('Enter at least four characters');

  // matches 12345 or 12345-6789 or 123456789
  private usZipCodePattern = '^\\d{5}(-?\\d{4})?$';
  private usZipCodeValidationMessage = msg('Enter a valid 5 or 9 digit zip/postal code');

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div id="donation-contact-form-error-message"></div>
      <form>
        <fieldset>
          <div class="row">
            ${this.generateInput({
              id: 'donation-contact-form-email',
              label: 'Email',
              required: true,
              fieldType: 'email',
              name: 'email',
              autocomplete: 'email',
              minlength: 5,
              maxlength: 255,
            })}
          </div>
        </fieldset>

        <fieldset>
          <div class="row">
            ${this.generateInput({
              id: 'donation-contact-form-first-name',
              label: 'First name',
              name: 'fname',
              required: true,
              validationPattern: this.minTwoCharPattern,
              validationMessage: this.minTwoCharValidationMessage,
              maxlength: 255,
              autocomplete: 'given-name',
            })}
            ${this.generateInput({
              id: 'donation-contact-form-last-name',
              label: 'Last name',
              name: 'lname',
              autocomplete: 'family-name',
              required: true,
              validationPattern: this.minTwoCharPattern,
              validationMessage: this.minTwoCharValidationMessage,
              maxlength: 255,
            })}
          </div>
        </fieldset>
        <fieldset>
          <div class="row">
            ${this.generateInput({
              id: 'donation-contact-form-street-address',
              label: 'Address',
              required: true,
              autocomplete: 'address-line1',
              name: 'street-address',
              validationPattern: this.streetAddressPattern,
              validationMessage: this.streetAddressValidationMessage,
            })}
          </div>
          <div class="row">
            ${this.generateInput({
              id: 'donation-contact-form-locality',
              label: 'City',
              autocomplete: 'address-level2',
              required: true,
              name: 'locality',
              validationPattern: this.minTwoCharPattern,
              validationMessage: this.minTwoCharValidationMessage,
            })}
          </div>
          <div class="row">${this.countrySelectorTemplate}</div>
          <div class="row region-postal-row">
            ${this.generateInput({
              id: 'donation-contact-form-region',
              label: 'State / Province',
              autocomplete: 'address-level1',
              required: this.regionAndPostalCodeRequired,
              name: 'region',
              validationPattern: this.regionAndPostalCodeRequired
                ? this.minTwoCharPattern
                : undefined,
              validationMessage: this.regionAndPostalCodeRequired
                ? this.minTwoCharValidationMessage
                : undefined,
            })}
            ${this.generateInput({
              id: 'donation-contact-form-postal-code',
              label: 'Zip / Postal Code',
              autocomplete: 'postal-code',
              required: this.regionAndPostalCodeRequired,
              name: 'postal',
              validationPattern: this.regionAndPostalCodeRequired
                ? this.usZipCodePattern
                : undefined,
              validationMessage: this.regionAndPostalCodeRequired
                ? this.usZipCodeValidationMessage
                : undefined,
            })}
          </div>
        </fieldset>
      </form>
      ${this.getStyles}
    `;
  }

  private get regionAndPostalCodeRequired(): boolean {
    return this.selectedCountry === 'US';
  }

  private get countrySelectorTemplate(): TemplateResult {
    return html`
      <div class="field">
        <label for="donation-contact-form-countryCodeAlpha2" class="field-label">
          Country<span class="required-asterisk"> *</span>
        </label>
        <badged-input .iconSpaceOption=${SpacerOption.CompressSpace}>
          <select
            id="donation-contact-form-countryCodeAlpha2"
            @change=${(e: Event) => {
              const newValue = (e.target as HTMLSelectElement).value;
              if (countries[newValue]) this.selectedCountry = newValue;
            }}
          >
            ${Object.keys(countries).map(key => {
              const name = countries[key];
              return html`
                <option value=${key} ?selected=${key === this.selectedCountry}>${name}</option>
              `;
            })}
          </select>
        </badged-input>
      </div>
    `;
  }

  /** @inheritdoc */
  createRenderRoot(): this {
    // Render template without shadow DOM. Note that shadow DOM features like
    // encapsulated CSS and slots are unavailable.
    // Form autofill does not work properly in the shadow DOM
    // so we need our form fields in the light DOM
    return this;
  }

  // reset the error state when the user focuses the input
  private inputFocused(e: KeyboardEvent): void {
    this.errorMessage.innerText = '';
    const input = e.target as HTMLInputElement;
    const inputIdentifier = input.id;
    const badgedInput = this.querySelector(`badged-input.${inputIdentifier}`) as BadgedInput;
    badgedInput.error = false;
  }

  private generateInput(options: {
    id: string;
    label: string;
    required?: boolean;
    fieldType?: 'text' | 'email';
    autocomplete?: AutoCompleteFieldOptions;
    minlength?: number;
    maxlength?: number;
    name: string;
    validationPattern?: string;
    validationMessage?: string;
  }): TemplateResult {
    const required = options.required ?? true;
    const fieldType = options.fieldType ?? 'text';

    return html`
      <div class="field ${options.id}">
        <label for=${options.id} class="field-label">
          ${options.label}${required ? html`<span class="required-asterisk"> *</span>` : nothing}
        </label>
        <badged-input
          class=${options.id}
          .iconSpaceOption=${SpacerOption.CompressSpace}
          .requiredIndicatorSpaceOption=${SpacerOption.CompressSpace}
        >
          <input
            type=${fieldType}
            id=${options.id}
            class="donation-contact-form-input"
            name=${options.name}
            maxlength=${ifDefined(options.maxlength)}
            minlength=${ifDefined(options.minlength)}
            autocomplete=${options.autocomplete ?? 'on'}
            pattern=${ifDefined(options.validationPattern)}
            title=${ifDefined(options.validationMessage)}
            @focus=${this.inputFocused}
            ?required=${required}
          />
        </badged-input>
      </div>
    `;
  }

  get donorContactInfo(): DonorContactInfo {
    return new DonorContactInfo({
      billing: this.billingInfo,
      customer: this.contactInfo,
    });
  }

  get billingInfo(): BillingInfo {
    const billingInfo = new BillingInfo({
      streetAddress: this.streetAddressField.value,
      locality: this.localityField.value,
      region: this.regionField.value,
      postalCode: this.postalCodeField.value,
      countryCodeAlpha2: this.countryCodeAlpha2Field.value,
    });
    return billingInfo;
  }

  get contactInfo(): CustomerInfo {
    return new CustomerInfo({
      email: this.emailField.value,
      firstName: this.firstNameField.value,
      lastName: this.lastNameField.value,
    });
  }

  /**
   * This is not the normal LitElement styles block.
   *
   * This element uses the clear DOM instead of the shadow DOM so it can't use
   * the shadowRoot's isolated styling. This is a bit of a workaround to keep all of
   * the styling local by writing out our own <style> tag and just be careful about
   * the selectors since they will leak outside of this component.
   *
   * @readonly
   * @private
   * @type {TemplateResult}
   * @memberof ContactForm
   */
  private get getStyles(): TemplateResult {
    const noIconSpacerWidth = css`var(--badgedInputNoIconSpacerWidth, 3rem)`;

    const fieldSetSpacing = css`var(--fieldSetSpacing, 1rem)`;
    const fieldRowGap = css`var(--fieldRowGap, 5px)`;
    const fieldFontFamily = css`var(--fontFamily, "Helvetica Neue", Helvetica, Arial, sans-serif)`;
    const fieldFontSize = css`var(--contactFieldFontSize, 14px)`;
    const fieldFontColor = css`var(--inputFieldFontColor, #2c2c2c)`;

    const fieldLabelFontFamily = css`var(--fieldLabelFontFamily, "Helvetica Neue", Helvetica, Arial, sans-serif)`;
    const fieldLabelFontSize = css`var(--fieldLabelFontSize, 14px)`;
    const fieldLabelColor = css`var(--fieldLabelColor, #2c2c2c)`;
    const fieldLabelMarginBottom = css`var(--fieldLabelMarginBottom, 5px)`;
    const requiredAsteriskColor = css`var(--badgedInputRequiredIndicatorColor, red)`;

    const noIconFieldWidth = css`calc(100% - ${noIconSpacerWidth})`;

    return html`
      <style>
        /*
          **NOTE**
          This element is in the lightDOM so be sure to prefix all styles
          with "contact-form" so styles don't leak.
         */
        contact-form fieldset {
          border: 0;
          padding: 0;
          margin: 0;
          margin-bottom: ${fieldSetSpacing};
          background-color: white;
        }

        /* These 1px and 0 margins in the next few selectors are to account for the
        double outlines caused by the fields being right next to each other */
        /*
          Grid (not flex) so that a label wrapping to two lines in one column
          doesn't push that column's input out of alignment with its siblings -
          all labels share row-line 1 and all inputs share row-line 2, each
          sized to the tallest content in that line.
        */
        contact-form .row {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 1fr;
          grid-template-rows: auto auto;
          column-gap: ${fieldRowGap};
          margin: -1px 0 0 0;
        }

        contact-form .row.region-postal-row {
          grid-template-columns: 60% 40%;
        }

        contact-form fieldset .row:first-child {
          margin-top: 0;
        }

        contact-form .field {
          display: contents;
        }

        contact-form .field-label {
          display: block;
          font-family: ${fieldLabelFontFamily};
          font-size: ${fieldLabelFontSize};
          font-weight: bold;
          color: ${fieldLabelColor};
          margin-bottom: ${fieldLabelMarginBottom};
        }

        contact-form .required-asterisk {
          color: ${requiredAsteriskColor};
        }

        contact-form badged-input.donation-contact-form-region,
        contact-form badged-input.donation-contact-form-postal-code {
          width: 100%;
        }

        contact-form #donation-contact-form-error-message {
          color: red;
          font-size: 1.4rem;
          margin-bottom: 0.6rem;
        }

        contact-form .donation-contact-form-input {
          width: ${noIconFieldWidth};
          border: 0;
          outline: 0;
          background: transparent;
          font-weight: bold;
          color: ${fieldFontColor};
          font-size: ${fieldFontSize};
          padding: 0;
          font-family: ${fieldFontFamily};
        }

        contact-form #donation-contact-form-countryCodeAlpha2 {
          width: ${noIconFieldWidth};
          height: 100%;
          box-sizing: border-box;
          font-weight: bold;
          font-size: ${fieldFontSize};
          color: ${fieldFontColor};
          font-family: ${fieldFontFamily};
          border: 0;
          background: #fff;
        }
      </style>
    `;
  }
}
