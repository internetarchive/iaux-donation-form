import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  query,
} from 'lit-element';

import { BillingInfo } from '../models/common/billing-info';
import { CustomerInfo } from '../models/common/customer-info';
import { DonorContactInfo } from '../models/common/donor-contact-info';

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

  submitForm(e: Event): void {
    console.debug('submitForm');
    e.preventDefault();
  }

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <form @submit=${this.submitForm}>
        <fieldset>
          <div class="row has-icon email-icon">
            ${this.generateInput({
              id: 'email',
              placeholder: 'Email',
              required: true,
              fieldType: 'email',
            })}
          </div>
        </fieldset>

        <fieldset>
          <div class="row has-icon person">
            ${this.generateInput({ id: 'firstName', placeholder: 'First name', required: true })}
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
            ${this.generateInput({ id: 'locality', placeholder: 'City', required: false })}
          </div>
          <div class="row">
            ${this.generateInput({ id: 'region', placeholder: 'State / Province', required: true })}
            ${this.generateInput({ id: 'postalCode', placeholder: 'Zip / Postal', required: true })}
          </div>
          <div class="row">
            ${this.generateInput({
              id: 'countryCodeAlpha2',
              placeholder: 'Country',
              required: true,
            })}
          </div>
        </fieldset>
      </form>
    `;
  }

  private inputChanged(): void {
    console.debug('inputChanged');
  }

  private generateInput(options: {
    id: string;
    placeholder: string;
    required?: boolean;
    fieldType?: 'text' | 'email';
  }): TemplateResult {
    const required = options.required ?? true;
    const fieldType = options.fieldType ?? 'text';

    return html`
      <div class="input-wrapper ${options.id}">
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

    return css`
      fieldset {
        border: 0;
        padding: 0;
        margin: 0 0 0.5em 0;
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

      .email-icon {
        background-position: 0.75rem 50%;
        background-repeat: no-repeat;
      }

      input {
        width: 100%;
        border: 0;
        outline: 0;
        background: transparent;
        font-weight: bold;
        font-size: 0.9em;
        color: #333;
      }

      .input-wrapper {
        width: 100%;
        outline: ${borderCss};
        padding: 2px 5px;
        padding-left: 2rem;
      }

      .input-wrapper.region {
        width: 60%;
      }

      .input-wrapper.postalCode {
        padding-left: 0.5em;
        border-left: 0;
        width: 40%;
      }
    `;
  }
}
