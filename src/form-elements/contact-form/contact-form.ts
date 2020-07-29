import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  query,
} from 'lit-element';

import { BillingInfo } from '../../models/common/billing-info';
import { CustomerInfo } from '../../models/common/customer-info';
import { DonorContactInfo } from '../../models/common/donor-contact-info';
import { AutoCompleteFieldOptions } from './autocomplete-field-options';
import { IconSpaceOption } from '../badged-input';
import '../badged-input';

import emailImg from '../../assets/img/icons/email';
import localePinImg from '../../assets/img/icons/locale-pin';
import personImg from '../../assets/img/icons/person';

import countries from './countries';

@customElement('contact-form')
export class ContactForm extends LitElement {
  @query('#email') emailField!: HTMLInputElement;
  @query('#firstName') firstNameField!: HTMLInputElement;
  @query('#lastName') lastNameField!: HTMLInputElement;
  @query('#streetAddress') streetAddressField!: HTMLInputElement;
  @query('#extendedAddress') extendedAddressField!: HTMLInputElement;
  @query('#locality') localityField!: HTMLInputElement;
  @query('#region') regionField!: HTMLInputElement;
  @query('#postalCode') postalCodeField!: HTMLInputElement;
  @query('#countryCodeAlpha2') countryCodeAlpha2Field!: HTMLSelectElement;
  @query('form') form!: HTMLFormElement;

  validate(): boolean {
    const valid = this.form.reportValidity();
    return valid;
  }

  focus(): void {
    this.emailField.focus();
  }

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <form>
        <fieldset>
          <div class="row has-icon">
            ${this.generateInput({
              id: 'email',
              placeholder: 'Email',
              required: true,
              fieldType: 'email',
              autocomplete: 'email',
              icon: emailImg,
            })}
          </div>
        </fieldset>

        <fieldset>
          <div class="row has-icon">
            ${this.generateInput({
              id: 'firstName',
              placeholder: 'First name',
              required: true,
              autocomplete: 'given-name',
              icon: personImg,
            })}
          </div>

          <div class="row">
            ${this.generateInput({
              id: 'lastName',
              placeholder: 'Last name',
              autocomplete: 'family-name',
              required: true,
            })}
          </div>
        </fieldset>

        <fieldset>
          <div class="row">
            ${this.generateInput({
              id: 'streetAddress',
              placeholder: 'Address Line 1',
              required: true,
              autocomplete: 'address-line1',
              icon: localePinImg,
            })}
          </div>
          <div class="row">
            ${this.generateInput({
              id: 'extendedAddress',
              placeholder: 'Address Line 2 (optional)',
              autocomplete: 'address-line2',
              required: false,
            })}
          </div>
          <div class="row">
            ${this.generateInput({
              id: 'locality',
              placeholder: 'City',
              autocomplete: 'address-level2',
              required: true,
            })}
          </div>
          <div class="row">
            ${this.generateInput({
              id: 'region',
              placeholder: 'State / Province',
              autocomplete: 'address-level1',
              required: true,
            })}
            ${this.generateInput({
              id: 'postalCode',
              placeholder: 'Zip / Postal',
              autocomplete: 'postal-code',
              required: true,
              iconSpaceOption: IconSpaceOption.NoIconSpace,
            })}
          </div>
          <div class="row">
            ${this.countrySelector}
          </div>
        </fieldset>
      </form>
    `;
  }

  private formValid = false;

  private inputChanged(): void {
    const isValid = this.form.checkValidity();
    // only dispatch if there is a change
    if (isValid === this.formValid) {
      return;
    }
    this.formValid = isValid;
    const event = new CustomEvent('form-validity-changed', { detail: { isValid } });
    this.dispatchEvent(event);
  }

  private generateInput(options: {
    id: string;
    placeholder: string;
    required?: boolean;
    fieldType?: 'text' | 'email';
    autocomplete?: AutoCompleteFieldOptions;
    icon?: TemplateResult;
    iconSpaceOption?: IconSpaceOption;
  }): TemplateResult {
    const required = options.required ?? true;
    const fieldType = options.fieldType ?? 'text';
    const iconOption = options.iconSpaceOption ?? IconSpaceOption.IconSpace;

    return html`
      <badged-input class=${options.id} .icon=${options.icon} .iconSpaceOption=${iconOption}>
        <input
          type=${fieldType}
          id=${options.id}
          placeholder=${options.placeholder}
          autocomplete=${options.autocomplete ?? 'on'}
          @input=${this.inputChanged}
          ?required=${required}
        />
      </badged-input>
    `;
  }

  private get countrySelector(): TemplateResult {
    const selectedCountry = 'US';

    return html`
      <badged-input>
        <select id="countryCodeAlpha2">
          ${Object.keys(countries).map(key => {
            const name = countries[key];
            return html`
              <option value=${key} ?selected=${key === selectedCountry}>${name}</option>
            `;
          })}
        </select>
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

  /** @inheritdoc */
  static get styles(): CSSResult {
    const noIconSpacerWidth = css`var(--badgedInputNoIconSpacerWidth, 1rem)`;
    const iconSpacerWidth = css`var(--badgedInputIconSpacerWidth, 3rem)`;

    const fieldSetSpacing = css`var(--fieldSetSpacing, 1rem)`;
    const fieldFontFamily = css`var(--fontFamily, "Helvetica Neue", Helvetica, Arial, sans-serif)`;
    const fieldFontSize = css`var(--contactFieldFontSize, 1.6rem)`;
    const fieldFontColor = css`var(--inputFieldFontColor, #333)`;

    const iconFieldWidth = css`calc(100% - ${iconSpacerWidth})`;
    const noIconFieldWidth = css`calc(100% - ${noIconSpacerWidth})`;

    return css`
      fieldset {
        border: 0;
        padding: 0;
        margin: 0;
        margin-bottom: ${fieldSetSpacing};
      }

      /* These 1px and 0 margins in the next few selectors are to account for the
      double outlines caused by the fields being right next to each other */
      .row {
        display: flex;
        margin-top: 1px;
      }

      fieldset .row:first-child {
        margin-top: 0;
      }

      badged-input {
        width: 100%;
      }

      badged-input.region {
        width: 60%;
      }

      badged-input.postalCode {
        margin-left: 1px;
        width: 40%;
      }

      #region {
        width: ${iconFieldWidth};
      }

      #postalCode {
        width: ${noIconFieldWidth};
      }

      input {
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

      select {
        width: ${iconFieldWidth};
        height: 100%;
        box-sizing: border-box;
        font-weight: bold;
        font-size: ${fieldFontSize};
        font-family: ${fieldFontFamily};
        border: 0;
        background: #fff;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
      }
    `;
  }
}
