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

import emailImg from '../../assets/img/contact-form-icons/email';
import localePinImg from '../../assets/img/contact-form-icons/locale-pin';
import personImg from '../../assets/img/contact-form-icons/person';

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
  @query('#countryCodeAlpha2') countryCodeAlpha2Field!: HTMLInputElement;
  @query('form') form!: HTMLFormElement;

  get requriedFields(): HTMLInputElement[] {
    return [
      this.emailField,
      this.firstNameField,
      this.lastNameField,
      this.streetAddressField,
      this.localityField,
      this.regionField,
      this.postalCodeField,
      this.countryCodeAlpha2Field,
    ];
  }

  validate(): boolean {
    const valid = this.form.reportValidity();
    return valid;
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
              icon: personImg,
            })}
          </div>

          <div class="row">
            ${this.generateInput({ id: 'lastName', placeholder: 'Last name', required: true })}
          </div>
        </fieldset>

        <fieldset>
          <div class="row">
            ${this.generateInput({
              id: 'streetAddress',
              placeholder: 'Address Line 1',
              required: true,
              icon: localePinImg,
            })}
          </div>
          <div class="row">
            ${this.generateInput({
              id: 'extendedAddress',
              placeholder: 'Address Line 2',
              required: false,
            })}
          </div>
          <div class="row">
            ${this.generateInput({ id: 'locality', placeholder: 'City', required: true })}
          </div>
          <div class="row">
            ${this.generateInput({ id: 'region', placeholder: 'State / Province', required: true })}
            ${this.generateInput({ id: 'postalCode', placeholder: 'Zip / Postal', required: true })}
          </div>
          <div class="row">
            ${this.countrySelector}
            <!-- ${this.generateInput({
              id: 'countryCodeAlpha2',
              placeholder: 'Country',
              required: true,
            })} -->
          </div>
        </fieldset>
      </form>
    `;
  }

  private formValid = false;

  private inputChanged(): void {
    console.debug('inputChanged');
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
    icon?: TemplateResult;
  }): TemplateResult {
    const required = options.required ?? true;
    const fieldType = options.fieldType ?? 'text';

    return html`
      <div class="input-wrapper ${options.id}">
        <div class="icon-container">${options.icon}</div>
        <input
          type=${fieldType}
          id=${options.id}
          placeholder=${options.placeholder}
          @input=${this.inputChanged}
          ?required=${required}
        />
      </div>
    `;
  }

  private get countrySelector(): TemplateResult {
    const selectedCountry = 'US';

    return html`
      <div class="input-wrapper countryCodeAlpha2">
        <div class="icon-container"></div>
        <select>
          ${Object.keys(countries).map(key => {
            const name = countries[key];
            return html`
              <option value=${key} ?selected=${key === selectedCountry}>${name}</option>
            `;
          })}
        </select>
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
      extendedAddress: this.extendedAddressField.value,
      locality: this.localityField.value,
      region: this.regionField.value,
      postalCode: this.postalCodeField.value,
      countryCodeAlpha2: 'US',
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
    const borderCss = css`var(--contactFormBorderCss, 1px solid #d9d9d9)`;
    const fieldHeight = css`var(--fieldHeight, 30px)`;
    const fieldSetSpacing = css`var(--fieldSetSpacing, 10px)`;
    const iconSpacerLeftMargin = css`var(--contactFieldIconLeftMargin, 10px)`;
    const iconSpacerWidth = css`var(--contactFieldIconSpacerWidth, 40px)`;
    const fieldFontFamily = css`var(--fontFamily, "Helvetica Neue", Helvetica, Arial, sans-serif)`;
    const fieldFontSize = css`var(--contactFieldFontSize, 16px)`;

    const fieldWidth = css`calc(100% - ${iconSpacerWidth})`;

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

      .row .input-wrapper {
        margin-left: 1px;
      }

      .row .input-wrapper:first-child {
        margin-left: 0;
      }

      input {
        width: ${fieldWidth};
        border: 0;
        outline: 0;
        background: transparent;
        font-weight: bold;
        color: #333;
        font-size: ${fieldFontSize};
        padding: 0;
        font-family: ${fieldFontFamily};
      }

      .input-wrapper {
        width: 100%;
        outline: ${borderCss};
        height: ${fieldHeight};
        display: flex;
      }

      .input-wrapper .icon-container {
        width: ${iconSpacerWidth};
        margin-left: ${iconSpacerLeftMargin};
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }

      .input-wrapper .icon-container svg {
        height: 16px;
      }

      .input-wrapper.countryCodeAlpha2 {
        padding-top: 0;
        padding-bottom: 0;
        padding-right: 0;
      }

      .input-wrapper.countryCodeAlpha2 select {
        width: ${fieldWidth};
        height: ${fieldHeight};
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

      .input-wrapper.region {
        width: 60%;
      }

      .input-wrapper.postalCode {
        padding-left: 0.5em;
        border-left: 0;
        width: 40%;
      }

      .input-wrapper.postalCode .icon-container {
        width: 0;
        margin: 0;
      }
    `;
  }
}
