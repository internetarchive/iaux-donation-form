import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  query,
} from 'lit-element';

import {
  BillingInfo,
  CustomerInfo,
  DonorContactInfo,
} from '@internetarchive/donation-form-data-models';
import { AutoCompleteFieldOptions } from './autocomplete-field-options';
import { IconSpaceOption } from '../badged-input';
import '../badged-input';

import emailImg from '@internetarchive/icon-email';
import localePinImg from '@internetarchive/icon-locale-pin';
import userIcon from '@internetarchive/icon-user';

@customElement('contact-form')
export class ContactForm extends LitElement {
  @query('#email') emailField!: HTMLInputElement;
  @query('#firstName') firstNameField!: HTMLInputElement;
  @query('#lastName') lastNameField!: HTMLInputElement;
  @query('#postalCode') postalCodeField!: HTMLInputElement;
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
          <div class="row has-icon">
            ${this.generateInput({
              id: 'firstName',
              placeholder: 'First name',
              required: true,
              autocomplete: 'given-name',
              icon: userIcon,
            })}
            ${this.generateInput({
              id: 'lastName',
              placeholder: 'Last name',
              autocomplete: 'family-name',
              required: true,
              iconSpaceOption: IconSpaceOption.NoIconSpace,
            })}
          </div>
          <div class="row has-icon">
            ${this.generateInput({
              id: 'postalCode',
              placeholder: 'Zip / Postal',
              autocomplete: 'postal-code',
              required: true,
              icon: localePinImg,
            })}
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
          aria-label=${options.placeholder}
          placeholder=${options.placeholder}
          autocomplete=${options.autocomplete ?? 'on'}
          @input=${this.inputChanged}
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

      badged-input.lastName {
        margin-left: -1px;
      }

      #lastName {
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
