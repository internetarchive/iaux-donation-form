import { LitElement, html, css, TemplateResult, PropertyValues } from 'lit';
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

import emailImg from '@internetarchive/icon-email/index.js';
import localePinImg from '@internetarchive/icon-locale-pin/index.js';
import userIcon from '@internetarchive/icon-user/index.js';

import { countries } from './countries';

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

  @query('badged-input.donation-contact-form-extended-address')
  extendedAddressBadgedInput!: BadgedInput;
  @query('#donation-contact-form-extended-address') extendedAddressField!: HTMLInputElement;

  @query('badged-input.donation-contact-form-locality') localityBadgedInput!: BadgedInput;
  @query('#donation-contact-form-locality') localityField!: HTMLInputElement;

  @query('badged-input.donation-contact-form-region') regionBadgedInput!: BadgedInput;
  @query('#donation-contact-form-region') regionField!: HTMLInputElement;

  @query('#donation-contact-form-countryCodeAlpha2') countryCodeAlpha2Field!: HTMLSelectElement;

  @query('#donation-contact-form-error-message') errorMessage!: HTMLDivElement;
  @query('form') form!: HTMLFormElement;

  @property({ type: String }) selectedCountry = 'US';

  @property({ type: String }) donorEmail = '';

  updated(changed: PropertyValues): void {
    if (changed.has('donorEmail')) {
      this.emailField.value = this.donorEmail ?? '';
    }
  }

  reportValidity(): boolean {
    const fieldBadgedInputs: Array<[HTMLInputElement, BadgedInput]> = [
      [this.emailField, this.emailBadgedInput],
      [this.firstNameField, this.firstNameBadgedInput],
      [this.lastNameField, this.lastNameBadgedInput],
      [this.regionField, this.regionBadgedInput],
      [this.localityField, this.localityBadgedInput],
      [this.streetAddressField, this.streetAddressBadgedInput],
      [this.postalCodeField, this.postalBadgedInput],
    ];

    let isValid = true;
    fieldBadgedInputs.forEach(([inputElement, badgedInput]) => {
      const fieldValid = inputElement.checkValidity();
      isValid = isValid && fieldValid;
      if (!fieldValid) {
        badgedInput.error = true;
      }
    });

    if (!isValid) {
      this.errorMessage.innerText = 'Please enter any missing contact information below';
    } else {
      this.errorMessage.innerText = '';
    }

    return isValid;
  }

  focus(): void {
    this.emailField.focus();
  }

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div id="donation-contact-form-error-message"></div>
      <form>
        <fieldset>
          <div class="row">
            ${this.generateInput({
              id: 'donation-contact-form-email',
              placeholder: 'Email',
              required: true,
              fieldType: 'email',
              name: 'email',
              autocomplete: 'email',
              minlength: 5,
              maxlength: 255,
              icon: emailImg,
            })}
          </div>
        </fieldset>

        <fieldset>
          <div class="row">
            ${this.generateInput({
              id: 'donation-contact-form-first-name',
              placeholder: 'First name',
              name: 'fname',
              required: true,
              validationPattern: '.*\\S{2,}.*',
              maxlength: 255,
              autocomplete: 'given-name',
              icon: userIcon,
            })}
          </div>
          <div class="row">
            ${this.generateInput({
              id: 'donation-contact-form-last-name',
              placeholder: 'Last name',
              name: 'lname',
              autocomplete: 'family-name',
              required: true,
              validationPattern: '.*\\S{2,}.*',
              maxlength: 255,
            })}
          </div>
        </fieldset>
        <fieldset>
          <div class="row">
            ${this.generateInput({
              id: 'donation-contact-form-street-address',
              placeholder: 'Address Line 1',
              required: true,
              autocomplete: 'address-line1',
              icon: localePinImg,
              name: 'street-address',
              validationPattern: '.*?\\S.{2,}\\S.*?',
            })}
          </div>
          <div class="row">
            ${this.generateInput({
              id: 'donation-contact-form-extended-address',
              placeholder: 'Address Line 2 (optional)',
              autocomplete: 'address-line2',
              required: false,
              name: 'extended-address',
            })}
          </div>
          <div class="row">
            ${this.generateInput({
              id: 'donation-contact-form-locality',
              placeholder: 'City',
              autocomplete: 'address-level2',
              required: true,
              name: 'locality',
              validationPattern: '.*\\S{2,}.*',
            })}
          </div>
          <div class="row">
            ${this.generateInput({
              id: 'donation-contact-form-region',
              placeholder: 'State / Province',
              autocomplete: 'address-level1',
              required: this.regionAndPostalCodeRequired,
              name: 'region',
              validationPattern: '.*\\S{2,}.*',
            })}
            ${this.generateInput({
              id: 'donation-contact-form-postal-code',
              placeholder: 'Zip / Postal',
              autocomplete: 'postal-code',
              required: this.regionAndPostalCodeRequired,
              name: 'postal',
              minlength: 5,
              maxlength: 9,
              // must start with a character, then may contain spaces
              validationPattern: '[a-zA-Z\\-\\d]+[a-zA-Z\\-\\d\\s]*',
              iconSpaceOption: SpacerOption.CompressSpace,
            })}
          </div>
          <div class="row">${this.countrySelectorTemplate}</div>
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
      <badged-input>
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
    placeholder: string;
    required?: boolean;
    fieldType?: 'text' | 'email';
    autocomplete?: AutoCompleteFieldOptions;
    minlength?: number;
    maxlength?: number;
    name: string;
    icon?: TemplateResult;
    iconSpaceOption?: SpacerOption;
    validationPattern?: string;
  }): TemplateResult {
    const required = options.required ?? true;
    const fieldType = options.fieldType ?? 'text';
    const iconOption = options.iconSpaceOption ?? SpacerOption.LeaveSpace;

    return html`
      <badged-input
        class=${options.id}
        .icon=${options.icon}
        .iconSpaceOption=${iconOption}
        ?required=${options.required}
      >
        <label for=${options.id}>${options.placeholder}</label>
        <input
          type=${fieldType}
          id=${options.id}
          class="donation-contact-form-input"
          name=${options.name}
          aria-label=${options.placeholder}
          placeholder=${options.placeholder}
          maxlength=${ifDefined(options.maxlength)}
          minlength=${ifDefined(options.minlength)}
          autocomplete=${options.autocomplete ?? 'on'}
          pattern=${ifDefined(options.validationPattern)}
          @focus=${this.inputFocused}
          ?required=${required}
        />
      </badged-input>
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
      extendedAddress: this.extendedAddressField.value,
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
    const iconSpacerWidth = css`var(--badgedInputIconSpacerWidth, 5rem)`;

    const fieldSetSpacing = css`var(--fieldSetSpacing, 1rem)`;
    const fieldFontFamily = css`var(--fontFamily, "Helvetica Neue", Helvetica, Arial, sans-serif)`;
    const fieldFontSize = css`var(--contactFieldFontSize, 1.6rem)`;
    const fieldFontColor = css`var(--inputFieldFontColor, #333)`;

    const iconFieldWidth = css`calc(100% - ${iconSpacerWidth})`;
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
        contact-form .row {
          display: flex;
          margin: -1px 0 0 0;
        }

        contact-form fieldset .row:first-child {
          margin-top: 0;
        }

        contact-form badged-input.donation-contact-form-region {
          width: 60%;
        }

        contact-form badged-input.donation-contact-form-postal-code {
          width: 40%;
        }

        contact-form #donation-contact-form-region {
          width: ${iconFieldWidth};
        }

        contact-form #donation-contact-form-postal-code {
          width: ${noIconFieldWidth};
        }

        contact-form #donation-contact-form-error-message {
          color: red;
          font-size: 1.4rem;
          margin-bottom: 0.6rem;
        }

        contact-form #donation-contact-form-last-name {
          width: ${noIconFieldWidth};
        }

        /* only show for screen readers */
        contact-form label {
          position: absolute;
          left: -10000px;
          top: auto;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }

        contact-form .donation-contact-form-input {
          width: ${iconFieldWidth};
          border: 0;
          outline: 0;
          background: transparent;
          font-weight: bold;
          color: ${fieldFontColor};
          font-size: ${fieldFontSize};
          padding: 0;
          font-family: ${fieldFontFamily};
        }

        contact-form .donation-contact-form-input::placeholder {
          color: revert;
        }

        contact-form #donation-contact-form-countryCodeAlpha2 {
          width: calc(100%);
          height: 100%;
          box-sizing: border-box;
          font-weight: bold;
          font-size: ${fieldFontSize};
          font-family: ${fieldFontFamily};
          border: 0;
          background: #fff;
        }
      </style>
    `;
  }
}
