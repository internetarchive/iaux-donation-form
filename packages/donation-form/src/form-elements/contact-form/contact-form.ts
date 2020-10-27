import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  query,
} from 'lit-element';

import { ifDefined } from 'lit-html/directives/if-defined';

import {
  BillingInfo,
  CustomerInfo,
  DonorContactInfo,
} from '@internetarchive/donation-form-data-models';
import { AutoCompleteFieldOptions } from './autocomplete-field-options';
import { IconSpaceOption } from '../badged-input';
import { BadgedInput } from '../badged-input';
import '../badged-input';

import emailImg from '@internetarchive/icon-email';
import localePinImg from '@internetarchive/icon-locale-pin';
import userIcon from '@internetarchive/icon-user';

@customElement('contact-form')
export class ContactForm extends LitElement {
  @query('badged-input.email') emailBadgedInput!: BadgedInput;
  @query('#email') emailField!: HTMLInputElement;
  @query('badged-input.first-name') firstNameBadgedInput!: BadgedInput;
  @query('#first-name') firstNameField!: HTMLInputElement;
  @query('badged-input.last-name') lastNameBadgedInput!: BadgedInput;
  @query('#last-name') lastNameField!: HTMLInputElement;
  @query('badged-input.postal-code') postalBadgedInput!: BadgedInput;
  @query('#postal-code') postalCodeField!: HTMLInputElement;

  @query('#error-message') errorMessage!: HTMLDivElement;
  @query('form') form!: HTMLFormElement;

  reportValidity(): boolean {
    const emailValid = this.emailField.checkValidity();
    if (!emailValid) {
      this.emailBadgedInput.error = true;
    }

    const firstNameValid = this.firstNameField.checkValidity();
    if (!firstNameValid) {
      this.firstNameBadgedInput.error = true;
    }

    const lastNameValid = this.lastNameField.checkValidity();
    if (!lastNameValid) {
      this.lastNameBadgedInput.error = true;
    }

    const postalValid = this.postalCodeField.checkValidity();
    if (!postalValid) {
      this.postalBadgedInput.error = true;
    }

    const valid = emailValid && firstNameValid && lastNameValid && postalValid;
    if (!valid) {
      this.errorMessage.innerText = 'Please enter any missing contact information below';
    } else {
      this.errorMessage.innerText = '';
    }

    return valid;
  }

  checkValidity(): boolean {
    const emailValid = this.emailField.checkValidity();
    const firstNameValid = this.firstNameField.checkValidity();
    const lastNameValid = this.lastNameField.checkValidity();
    const postalValid = this.postalCodeField.checkValidity();
    return emailValid && firstNameValid && lastNameValid && postalValid;
  }

  focus(): void {
    this.emailField.focus();
  }

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div id="error-message"></div>
      <form>
        <fieldset>
          <div class="row has-icon">
            ${this.generateInput({
              id: 'email',
              placeholder: 'Email',
              required: true,
              fieldType: 'email',
              name: 'email',
              autocomplete: 'email',
              maxlength: 255,
              icon: emailImg,
            })}
          </div>
          <div class="row has-icon">
            ${this.generateInput({
              id: 'first-name',
              placeholder: 'First name',
              name: 'fname',
              required: true,
              maxlength: 255,
              autocomplete: 'given-name',
              icon: userIcon,
            })}
            ${this.generateInput({
              id: 'last-name',
              placeholder: 'Last name',
              name: 'lname',
              autocomplete: 'family-name',
              required: true,
              maxlength: 255,
              iconSpaceOption: IconSpaceOption.NoIconSpace,
            })}
          </div>
          <div class="row has-icon">
            ${this.generateInput({
              id: 'postal-code',
              placeholder: 'Zip / Postal',
              autocomplete: 'postal-code',
              required: true,
              name: 'postal',
              icon: localePinImg,
              maxlength: 9,
              // must start with a character, then may contain spaces
              validationPattern: '[a-zA-Z\\-\\d]+[a-zA-Z\\-\\d\\s]*',
            })}
          </div>
        </fieldset>
      </form>
    `;
  }

  // reset the error state when the user focuses the input
  private inputFocused(e: KeyboardEvent): void {
    this.errorMessage.innerText = '';
    const input = e.target as HTMLInputElement;
    const inputIdentifier = input.id;
    const badgedInput = this.shadowRoot?.querySelector(
      `badged-input.${inputIdentifier}`,
    ) as BadgedInput;
    badgedInput.error = false;
  }

  private generateInput(options: {
    id: string;
    placeholder: string;
    required?: boolean;
    fieldType?: 'text' | 'email';
    autocomplete?: AutoCompleteFieldOptions;
    maxlength?: number;
    name: string;
    icon?: TemplateResult;
    iconSpaceOption?: IconSpaceOption;
    validationPattern?: string;
  }): TemplateResult {
    const required = options.required ?? true;
    const fieldType = options.fieldType ?? 'text';
    const iconOption = options.iconSpaceOption ?? IconSpaceOption.IconSpace;

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
          name=${options.name}
          aria-label=${options.placeholder}
          placeholder=${options.placeholder}
          maxlength=${ifDefined(options.maxlength)}
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
      postalCode: this.postalCodeField.value,
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
    const noIconSpacerWidth = css`var(--badgedInputNoIconSpacerWidth, 3rem)`;
    const iconSpacerWidth = css`var(--badgedInputIconSpacerWidth, 5rem)`;

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
        margin-top: -1px;
      }

      fieldset .row:first-child {
        margin-top: 0;
      }

      badged-input {
        width: 100%;
      }

      badged-input.last-name {
        margin-left: -1px;
      }

      #error-message {
        color: red;
        font-size: 1.4rem;
        margin-bottom: 0.6rem;
      }

      #last-name {
        width: ${noIconFieldWidth};
      }

      label {
        display: none;
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
    `;
  }
}
