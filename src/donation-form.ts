import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
  query,
  PropertyValues,
} from 'lit-element';

// we have to import the registered component independently from the definition below
// because inside each of these files, we're registering the custom element inside
// these files and by simply importing the class name, you lose that behavior
// See https://github.com/microsoft/TypeScript/issues/9191 for more discussion
import './form-elements/form-section';
import './form-elements/contact-form/contact-form';
import './form-elements/payment-selector';
import './form-elements/header/donation-form-header';

import { DonationFormHeader } from './form-elements/header/donation-form-header';
import { ContactForm } from './form-elements/contact-form/contact-form';
import { PaymentSelector } from './form-elements/payment-selector';

import { BraintreeManagerInterface } from './braintree-manager/braintree-interfaces';

import { DonationRequest } from './models/request-models/donation-request';
import { DonationPaymentInfo } from './models/donation-info/donation-payment-info';
import { DonationType } from './models/donation-info/donation-type';

import { PaymentFlowHandlersInterface } from './payment-flow-handlers/payment-flow-handlers';
import { PaymentProvider } from './models/common/payment-provider-name';

import lockImg from './assets/img/icons/lock';
import { FormSection } from './form-elements/form-section';

@customElement('donation-form')
export class DonationForm extends LitElement {
  @property({ type: Object }) braintreeManager: BraintreeManagerInterface | undefined;

  @property({ type: Object }) paymentFlowHandlers: PaymentFlowHandlersInterface | undefined;

  @property({ type: Object }) donationRequest: DonationRequest | undefined;

  @property({ type: Object }) donationInfo: DonationPaymentInfo = DonationPaymentInfo.default;

  @property({ type: Boolean }) private creditCardVisible = false;

  @property({ type: Boolean }) private contactFormVisible = false;

  @property({ type: Boolean }) private donationInfoValid = true;

  @property({ type: Boolean }) private contactInfoValid = false;

  @property({ type: Boolean }) private hostedFieldsValid = false;

  @property({ type: String }) private selectedPaymentProvider?: PaymentProvider;

  @query('contact-form') contactForm?: ContactForm;

  @query('form-section[number="4"]') contactFormSection?: FormSection;

  @query('donation-form-header') donationFormHeader!: DonationFormHeader;

  @query('payment-selector') paymentSelector!: PaymentSelector;

  private paypalButtonNeedsRender = true;

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <donation-form-header
        @donationInfoChanged=${this.donationInfoChanged}
        @editDonationError=${this.editDonationError}
      >
      </donation-form-header>

      <form-section number="3" headline="Choose a payment method">
        <payment-selector
          .paymentProviders=${this.braintreeManager?.paymentProviders}
          @firstUpdated=${this.paymentSelectorFirstUpdated}
          @creditCardSelected=${this.creditCardSelected}
          @venmoSelected=${this.venmoSelected}
          @applePaySelected=${this.applePaySelected}
          @googlePaySelected=${this.googlePaySelected}
          @paypalBlockerSelected=${this.paypalBlockerSelected}
        >
          <slot name="paypal-button" slot="paypal-button"></slot>
        </payment-selector>
      </form-section>

      <div class="contact-form-section" class="${this.contactFormVisible ? '' : 'hidden'}">
        ${this.contactFormSectionTemplate}
      </div>
      <slot name="recaptcha"></slot>
    `;
  }

  get contactFormSectionTemplate(): TemplateResult {
    return html`
      <form-section number="4" headline="Enter payment information">
        <contact-form @form-validity-changed=${this.contactFormValidityChanged}></contact-form>
        <div class="credit-card-fields" class="${this.creditCardVisible ? '' : 'hidden'}">
          <slot name="braintree-hosted-fields"></slot>
        </div>
      </form-section>

      <form-section number="5">
        <slot name="recaptcha"></slot>
        <button
          id="donate-button"
          @click=${this.donateClicked}
          ?disabled=${this.donateButtonDisabled}
        >
          Donate
        </button>

        <div class="secure-process-note">
          ${lockImg} Your payment will be securely processed
        </div>
      </form-section>
    `;
  }

  private get donateButtonDisabled(): boolean {
    return (
      this.donationInfoValid === false ||
      this.contactInfoValid === false ||
      (this.selectedPaymentProvider === PaymentProvider.CreditCard &&
        this.hostedFieldsValid === false)
    );
  }

  private contactFormValidityChanged(e: CustomEvent): void {
    this.contactInfoValid = e.detail.isValid;
  }

  private editDonationError(): void {
    this.donationInfoValid = false;
  }

  private paymentSelectorFirstUpdated(): void {
    if (this.paymentFlowHandlers?.paypalHandler) {
      this.renderPayPalButtonIfNeeded();
    }
  }

  private applePaySelected(e: CustomEvent): void {
    this.selectedPaymentProvider = PaymentProvider.ApplePay;
    this.contactFormVisible = false;
    this.creditCardVisible = false;

    if (!this.donationInfoValid) {
      this.showInvalidDonationInfoAlert();
      return;
    }

    const originalEvent = e.detail.originalEvent;
    this.paymentFlowHandlers?.applePayHandler?.paymentInitiated(this.donationInfo, originalEvent);
  }

  private googlePaySelected(): void {
    this.selectedPaymentProvider = PaymentProvider.GooglePay;
    this.contactFormVisible = false;
    this.creditCardVisible = false;

    if (!this.donationInfoValid) {
      this.showInvalidDonationInfoAlert();
    } else {
      this.paymentFlowHandlers?.googlePayHandler?.paymentInitiated(this.donationInfo);
    }
  }

  private async creditCardSelected(): Promise<void> {
    if (!this.donationInfoValid) {
      this.showInvalidDonationInfoAlert();
      return;
    }
    this.selectedPaymentProvider = PaymentProvider.CreditCard;
    this.contactFormVisible = true;
    this.creditCardVisible = true;
    this.focusContactForm();
  }

  private async venmoSelected(): Promise<void> {
    if (!this.donationInfoValid) {
      this.showInvalidDonationInfoAlert();
      return;
    }
    this.selectedPaymentProvider = PaymentProvider.Venmo;
    this.contactFormVisible = true;
    this.creditCardVisible = false;
    this.focusContactForm();
  }

  private paypalBlockerSelected(): void {
    this.contactFormVisible = false;
    this.creditCardVisible = false;
    this.showInvalidDonationInfoAlert();
  }

  private async focusContactForm(): Promise<void> {
    await this.updateComplete;
    if (this.contactFormSection) {
      this.contactForm?.focus();
    }
  }

  private async donateClicked(): Promise<void> {
    if (!this.contactForm) {
      alert('Please enter contact info.');
      return;
    }
    if (!this.donationInfoValid) {
      this.showInvalidDonationInfoAlert();
      return;
    }

    const creditCardHandler = await this.braintreeManager?.paymentProviders.creditCardHandler.get();
    creditCardHandler?.hideErrorMessage();

    const valid = this.contactForm.validate();

    if (!valid) {
      return;
    }

    const contactInfo = this.contactForm.donorContactInfo;

    switch (this.selectedPaymentProvider) {
      case PaymentProvider.CreditCard:
        this.paymentFlowHandlers?.creditCardHandler?.paymentInitiated(
          this.donationInfo,
          contactInfo,
        );
        break;
      case PaymentProvider.Venmo:
        this.paymentFlowHandlers?.venmoHandler?.paymentInitiated(contactInfo, this.donationInfo);
        break;
    }
  }

  private showInvalidDonationInfoAlert(): void {
    alert('Please enter valid donation info.');
  }

  /** @inheritdoc */
  firstUpdated(): void {
    this.readQueryParams();
  }

  private readQueryParams(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const frequencyParam = urlParams.get('frequency');
    const amountParam = urlParams.get('amount');
    const coverFeesParam = urlParams.get('coverFees');

    let frequency = DonationType.OneTime;
    if (frequencyParam === 'monthly') {
      frequency = DonationType.Monthly;
    }

    let amount = 5;
    if (amountParam) {
      amount = parseFloat(amountParam);
    }

    const donationInfo = new DonationPaymentInfo({
      donationType: frequency,
      amount: amount,
      coverFees: coverFeesParam === 'true',
    });

    this.donationInfo = donationInfo;
  }

  private async renderPayPalButtonIfNeeded(): Promise<void> {
    if (!this.paypalButtonNeedsRender) { return; }
    this.paypalButtonNeedsRender = false;
    await this.paymentFlowHandlers?.paypalHandler?.renderPayPalButton(this.donationInfo);
    this.paymentSelector.showPaypalButton();
  }

  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('paymentFlowHandlers')) {
      this.setupFlowHandlers();
    }

    if (changedProperties.has('donationInfo')) {
      // The PayPal button has a standalone datasource since we don't initiate the payment
      // through code so it has to have the donation info ready when the user taps the button.
      this.paymentFlowHandlers?.paypalHandler?.updateDonationInfo(this.donationInfo);
      this.donationFormHeader.donationInfo = this.donationInfo;
    }

    if (changedProperties.has('donationInfoValid')) {
      this.paymentSelector.donationInfoValid = this.donationInfoValid;
    }
  }

  private setupFlowHandlers(): void {
    this.renderPayPalButtonIfNeeded();
    this.paymentFlowHandlers?.paypalHandler?.updateDonationInfo(this.donationInfo);
    this.paymentFlowHandlers?.creditCardHandler?.startup();
    this.paymentFlowHandlers?.creditCardHandler?.on('validityChanged', (isValid: boolean) => {
      this.hostedFieldsValid = isValid;
    });
  }

  private donationInfoChanged(e: CustomEvent): void {
    const donationInfo: DonationPaymentInfo = e.detail.donationInfo;
    this.donationInfo = new DonationPaymentInfo({
      amount: donationInfo.amount,
      donationType: donationInfo.donationType,
      coverFees: donationInfo.coverFees,
    });
    this.donationInfoValid = true;
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    const donateButtonFontSize = css`var(--donateButtonFontSize, 2.6rem)`;
    const donateButtonHeight = css`var(--donateButtonHeight, 4rem)`;
    const donateButtonColor = css`var(--donateButtonColor, rgba(49, 164, 129, 1))`;
    const donateButtonDisabledColor = css`var(--donateButtonDisabledColor, rgba(49, 164, 129, 0.5))`;

    return css`
      h1 {
        margin: 0;
        padding: 0;
      }

      .hidden {
        display: none;
      }

      .secure-process-note {
        margin-top: 0.5em;
        font-size: 0.75em;
        text-align: center;
      }

      .secure-process-note svg {
        width: 1.2rem;
        height: 1.5rem;
        vertical-align: bottom;
      }

      #donate-button {
        width: 100%;
        appearance: none;
        -webkit-appearance: none;
        font-size: ${donateButtonFontSize};
        font-weight: bold;
        text-align: center;
        color: #fff;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        background-color: ${donateButtonColor};
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        height: ${donateButtonHeight};
      }

      #donate-button:disabled {
        background-color: ${donateButtonDisabledColor};
        cursor: not-allowed;
      }
    `;
  }
}
