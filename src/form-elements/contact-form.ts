import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  query
} from 'lit-element';
import { unsafeSVG } from 'lit-html/directives/unsafe-svg';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

import { BillingInfo } from '../models/common/billing-info';
import { CustomerInfo } from '../models/common/customer-info';
import { DonorContactInfo } from '../models/common/donor-contact-info';

import emailImg from '../assets/img/contact-form-icons/email';

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

  /** @inheritdoc */
  render(): TemplateResult {
    // console.debug('render', emailImg);

    // style="background-image: url('data:image/svg+xml;utf8,${emailImg.getHTML()}')">


    // console.debug('BACKGROUND', background)

    return html`
      <fieldset>
        <div class="row has-icon email-icon">
          <div class="input-wrapper email">
            <input type="text" id="email" placeholder="Email" />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <div class="row has-icon person">
          <div class="input-wrapper firstName">
            <input type="text" id="firstName" placeholder="First name" />
          </div>
        </div>

        <div class="row">
          <div class="input-wrapper">
            <input type="text" id="lastName" placeholder="Last name" />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <div class="row">
          <div class="input-wrapper streetAddress">
            <input type="text" id="streetAddress" placeholder="Address Line 1" />
          </div>
        </div>
        <div class="row">
          <div class="input-wrapper extendedAddress">
            <input type="text" id="extendedAddress" placeholder="Address Line 2" />
          </div>
        </div>
        <div class="row">
          <div class="input-wrapper locality">
            <input type="text" id="locality" placeholder="City" />
          </div>
        </div>
        <div class="row">
          <div class="input-wrapper region">
            <input type="text" id="region" placeholder="State / Province" />
          </div>
          <div class="input-wrapper postalCode">
            <input type="text" id="postalCode" placeholder="Zip / Postal" />
          </div>
        </div>
        <div class="row">
          <div class="input-wrapper countryCodeAlpha2">
            <input type="text" id="countryCodeAlpha2" placeholder="Country" />
          </div>
        </div>
      </fieldset>
    `;
  }

  get donorContactInfo(): DonorContactInfo {
    return new DonorContactInfo({
      billing: this.billingInfo,
      customer: this.contactInfo
    });
  }

  get billingInfo(): BillingInfo {
    const billingInfo = new BillingInfo({
      streetAddress: this.streetAddressField.value,
      extendedAddress: this.extendedAddressField.value,
      locality: this.localityField.value,
      region: this.regionField.value,
      postalCode: this.postalCodeField.value,
      countryCodeAlpha2: 'US'
    });
    return billingInfo;
  }

  get contactInfo(): CustomerInfo {
    return new CustomerInfo({
      email: this.emailField.value,
      firstName: this.firstNameField.value,
      lastName: this.lastNameField.value,
    })
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

      .row {
        display: flex;
      }

      fieldset .row:first-child {
        border-top: ${borderCss};
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
        border: ${borderCss};
        border-top: 0;
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

      /* #region {
        width: 60%;
      }

      #postalCode {
        width: 40%;
      }

      #postalCode {
        padding-left: 10px;
      } */
    `;
  }
}
