import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import lockImg from '@internetarchive/icon-lock/index.js';

// we have to import the registered component independently from the definition below
// because inside each of these files, we're registering the custom element inside
// these files and by simply importing the class name, you lose that behavior
// See https://github.com/microsoft/TypeScript/issues/9191 for more discussion
import './form-elements/payment-selector';
import './form-elements/header/donation-form-header';

import { DonationFormHeader } from './form-elements/header/donation-form-header';
import { PaymentSelector } from './form-elements/payment-selector';

import { BraintreeManagerInterface } from './braintree-manager/braintree-interfaces';

import {
  DonationRequest,
  DonationPaymentInfo,
  PaymentProvider,
  DonorContactInfo,
  DonationType,
  defaultDonationAmounts,
} from '@internetarchive/donation-form-data-models';

import { PaymentFlowHandlersInterface } from './payment-flow-handlers/payment-flow-handlers';

import {
  EditDonationAmountSelectionLayout,
  EditDonationFrequencySelectionMode,
} from '@internetarchive/donation-form-edit-donation';

import '@internetarchive/donation-form-section';
import {
  DonationFormSection,
  DonationFormSectionBadgeMode,
} from '@internetarchive/donation-form-section';
import { UpsellModalCTAMode } from './modals/upsell-modal-content';
import { ContactForm } from './form-elements/contact-form/contact-form';
import './form-elements/total-amount';

@customElement('donation-form')
export class DonationForm extends LitElement {
  @property({ type: Object }) braintreeManager: BraintreeManagerInterface | undefined;

  @property({ type: Object }) paymentFlowHandlers: PaymentFlowHandlersInterface | undefined;

  @property({ type: Object }) donationRequest: DonationRequest | undefined;

  @property({ type: Object }) donationInfo?: DonationPaymentInfo;

  @property({ type: Object }) contactForm?: ContactForm;

  @property({ type: Array }) amountOptions: number[] = defaultDonationAmounts;

  @property({ type: String }) amountSelectionLayout: EditDonationAmountSelectionLayout =
    EditDonationAmountSelectionLayout.MultiLine;

  @property({ type: String }) frequencySelectionMode: EditDonationFrequencySelectionMode =
    EditDonationFrequencySelectionMode.Button;

  @property({ type: Boolean }) private creditCardVisible = false;

  @property({ type: Boolean }) private contactFormVisible = false;

  @property({ type: Boolean }) private donationInfoValid = true;

  @property({ type: String }) private selectedPaymentProvider?: PaymentProvider;

  @query('#contactFormSection') contactFormSection?: DonationFormSection;

  @query('donation-form-header') donationFormHeader!: DonationFormHeader;

  @query('payment-selector') paymentSelector!: PaymentSelector;

  private paypalButtonNeedsRender = true;

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <donation-form-header
        .amountOptions=${this.amountOptions}
        .amountSelectionLayout=${this.amountSelectionLayout}
        .frequencySelectionMode=${this.frequencySelectionMode}
        @donationInfoChanged=${this.donationInfoChanged}
        @editDonationError=${this.editDonationError}
      >
      </donation-form-header>

      <donation-form-section
        .badgeMode=${DonationFormSectionBadgeMode.HideBadgeLeaveSpacing}
        id="total-amount-section"
      >
        <donation-form-total-amount .donationInfo=${this.donationInfo}>
        </donation-form-total-amount>
      </donation-form-section>

      <donation-form-section
        .sectionBadge=${this.paymentSelectorNumberingStart}
        headline="Choose a payment method"
      >
        <payment-selector
          .paymentProviders=${this.braintreeManager?.paymentProviders}
          @firstUpdated=${this.paymentSelectorFirstUpdated}
          @creditCardSelected=${this.creditCardSelected}
          @venmoSelected=${this.venmoSelected}
          @applePaySelected=${this.applePaySelected}
          @googlePaySelected=${this.googlePaySelected}
          @paypalBlockerSelected=${this.paypalBlockerSelected}
          @resetPaymentMethod=${async () => {
            this.selectedPaymentProvider = undefined;
            this.contactFormVisible = false;
            this.requestUpdate();
          }}
          tabindex="0"
        >
          <slot name="paypal-button" slot="paypal-button"></slot>
        </payment-selector>
      </donation-form-section>

      <div class="contact-form-section ${this.contactFormVisible ? '' : 'hidden'}">
        ${this.contactFormSectionTemplate}
      </div>
      <slot name="recaptcha"></slot>
    `;
  }

  async showConfirmationModalDev(options: {
    donationType: DonationType;
    amount: number;
    currencyType: string;
    cancelDonationCB: Function;
    confirmDonationCB: Function;
  }): Promise<void> {
    this.paymentFlowHandlers?.showConfirmationStepModal(options);
  }

  /**
   * This is a developer convenience method that allows us to show the upsell modal without going
   * through the purchasing flow. If it's showing the PayPal button, it will trigger
   * the PayPal button render
   *
   * @param {{
   *     oneTimeAmount: number;
   *     ctaMode?: UpsellModalCTAMode;
   *     yesSelected?: (amount: number) => void;
   *     noSelected?: () => void;
   *     amountChanged?: (amount: number) => void;
   *     userClosedModalCallback?: () => void;
   *   }} options
   * @returns {Promise<void>}
   * @memberof DonationForm
   */
  async showUpsellModalDev(options: {
    oneTimeAmount: number;
    ctaMode?: UpsellModalCTAMode;
    yesSelected?: (amount: number) => void;
    noSelected?: () => void;
    amountChanged?: (amount: number) => void;
    userClosedModalCallback?: () => void;
  }): Promise<void> {
    this.paymentFlowHandlers?.showUpsellModal(options);

    if (options.ctaMode === UpsellModalCTAMode.PayPalUpsellSlot) {
      const handler = await this.braintreeManager?.paymentProviders.paypalHandler.get();
      const donationInfo = new DonationPaymentInfo({
        amount: options.oneTimeAmount,
        donationType: DonationType.OneTime,
        coverFees: false,
      });
      handler?.renderPayPalButton({
        selector: '#paypal-upsell-button',
        style: {
          color: 'blue' as paypal.ButtonColorOption,
          label: 'paypal' as paypal.ButtonLabelOption,
          shape: 'rect' as paypal.ButtonShapeOption,
          size: 'responsive' as paypal.ButtonSizeOption,
          tagline: false,
        },
        donationInfo: donationInfo,
      });
    }
  }

  get contactFormSectionTemplate(): TemplateResult {
    const headline =
      this.selectedPaymentProvider === PaymentProvider.Venmo
        ? 'Help us stay in touch'
        : 'Enter payment information';

    return html`
      <donation-form-section
        .sectionBadge=${this.paymentSelectorNumberingStart + 1}
        headline=${headline}
        id="contactFormSection"
      >
        <slot name="contact-form"></slot>
        <div class="credit-card-fields" class="${this.creditCardVisible ? '' : 'hidden'}">
          <slot name="braintree-hosted-fields"></slot>
        </div>
      </donation-form-section>

      <donation-form-section .sectionBadge=${this.paymentSelectorNumberingStart + 2}>
        <slot name="recaptcha"></slot>
        <button id="donate-button" @click=${this.donateClicked}>Donate</button>

        <div class="secure-process-note">${lockImg} Your payment will be securely processed</div>
      </donation-form-section>
    `;
  }

  /**
   * Where to start the numbering of the payment selector
   *
   * - If we show the frequency selector in button mode, it becomes section 1, which makes
   * the amount selection section 2, and the payment selector section 3.
   * - If we show the frequency selector in checkbox mode, it is no longer section 1. The amount
   * selector becomes section 1 and the payment selector becomes section 2.
   *
   * Visually:
   *
   * Button Mode:
   * 1. Frequency selector
   * 2. Amount selector
   * 3. Payment selector
   * 4. Contact info
   * 5. Donate button
   *
   * Checkbox Mode:
   * 1. Amount selector (including the monthly checkbox)
   * 2. Payment selector <-- changes from 3 to 2
   * 3. Contact info <-- changes from 4 to 3
   * 4. Donate button <-- changes from 5 to 4
   *
   * @readonly
   * @private
   * @type {number}
   * @memberof DonationForm
   */
  private get paymentSelectorNumberingStart(): number {
    return this.frequencySelectionMode === EditDonationFrequencySelectionMode.Button ? 3 : 2;
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
    if (this.donationInfo) {
      this.paymentFlowHandlers?.applePayHandler?.paymentInitiated(this.donationInfo, originalEvent);
    }
    this.emitPaymentFlowStartedEvent();
  }

  private googlePaySelected(): void {
    this.selectedPaymentProvider = PaymentProvider.GooglePay;
    this.contactFormVisible = false;
    this.creditCardVisible = false;

    if (!this.donationInfoValid) {
      this.showInvalidDonationInfoAlert();
    } else {
      if (this.donationInfo) {
        this.paymentFlowHandlers?.googlePayHandler?.paymentInitiated(this.donationInfo);
      }
      this.emitPaymentFlowStartedEvent();
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
    if (!this.donationInfoValid || !this.donationInfo) {
      this.showInvalidDonationInfoAlert();
      return;
    }

    const contactInfo = this.contactForm.donorContactInfo;

    switch (this.selectedPaymentProvider) {
      case PaymentProvider.CreditCard:
        this.handleCreditCardDonationFlow(contactInfo, this.donationInfo);
        break;
      case PaymentProvider.Venmo:
        this.handleVenmoDonationFlow(contactInfo, this.donationInfo);
        break;
    }
  }

  private async handleCreditCardDonationFlow(
    contactInfo: DonorContactInfo,
    donationInfo: DonationPaymentInfo,
  ): Promise<void> {
    const creditCardFlowHandler = this.paymentFlowHandlers?.creditCardHandler;
    const creditCardHandler = await this.braintreeManager?.paymentProviders.creditCardHandler.get();
    creditCardHandler?.hideErrorMessage();
    const valid = this.contactForm?.reportValidity();
    const hostedFieldsResponse = await creditCardFlowHandler?.tokenizeFields();

    if (!valid || hostedFieldsResponse === undefined) {
      return;
    }

    this.emitPaymentFlowStartedEvent();
    creditCardFlowHandler?.paymentInitiated(hostedFieldsResponse, donationInfo, contactInfo);
  }

  private async handleVenmoDonationFlow(
    contactInfo: DonorContactInfo,
    donationInfo: DonationPaymentInfo,
  ): Promise<void> {
    const valid = this.contactForm?.reportValidity();
    if (!valid) {
      return;
    }
    this.paymentFlowHandlers?.venmoHandler?.paymentInitiated(contactInfo, donationInfo);
  }

  private emitPaymentFlowStartedEvent(): void {
    if (!this.selectedPaymentProvider) {
      return;
    }
    const event = new CustomEvent('paymentFlowStarted', {
      detail: { paymentProvider: this.selectedPaymentProvider },
    });
    this.dispatchEvent(event);
  }

  private emitPaymentFlowConfirmedEvent(): void {
    if (!this.selectedPaymentProvider) {
      return;
    }
    const event = new CustomEvent('paymentFlowConfirmed', {
      detail: { paymentProvider: this.selectedPaymentProvider },
    });
    this.dispatchEvent(event);
  }

  private emitPaymentFlowCancelledEvent(): void {
    if (!this.selectedPaymentProvider) {
      return;
    }
    const event = new CustomEvent('paymentFlowCancelled', {
      detail: { paymentProvider: this.selectedPaymentProvider },
    });
    this.dispatchEvent(event);
  }

  private emitPaymentFlowErrorEvent(error?: string): void {
    if (!this.selectedPaymentProvider) {
      return;
    }
    const event = new CustomEvent('paymentFlowError', {
      detail: { paymentProvider: this.selectedPaymentProvider, error: error },
    });
    this.dispatchEvent(event);
  }

  private showInvalidDonationInfoAlert(): void {
    alert('Please enter a valid donation amount.');
  }

  private async renderPayPalButtonIfNeeded(): Promise<void> {
    if (!this.paypalButtonNeedsRender) {
      return;
    }
    this.paypalButtonNeedsRender = false;
    if (this.donationInfo) {
      await this.paymentFlowHandlers?.paypalHandler?.renderPayPalButton(this.donationInfo);
    }
    this.paymentSelector.showPaypalButton();
  }

  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('donationInfo') && this.donationInfo) {
      // The PayPal button has a standalone datasource since we don't initiate the payment
      // through code so it has to have the donation info ready when the user taps the button.
      this.paymentFlowHandlers?.paypalHandler?.updateDonationInfo(this.donationInfo);
      this.donationFormHeader.donationInfo = this.donationInfo;
    }

    if (
      (changedProperties.has('paymentFlowHandlers') || changedProperties.has('donationInfo')) &&
      this.donationInfo &&
      this.paymentFlowHandlers
    ) {
      this.setupFlowHandlers();
    }

    if (changedProperties.has('donationInfoValid')) {
      this.paymentSelector.donationInfoValid = this.donationInfoValid;
    }

    if (changedProperties.has('selectedPaymentProvider')) {
      const event = new CustomEvent('paymentProviderSelected', {
        detail: {
          paymentProvider: this.selectedPaymentProvider,
          previousPaymentProvider: changedProperties.get('selectedPaymentProvider'),
        },
      });
      this.dispatchEvent(event);
    }
  }

  private flowHandlersConfigured = false;

  private setupFlowHandlers(): void {
    if (this.flowHandlersConfigured) {
      return;
    }
    this.flowHandlersConfigured = true;
    this.bindFlowListenerEvents();
    this.renderPayPalButtonIfNeeded();
    if (this.donationInfo) {
      this.paymentFlowHandlers?.paypalHandler?.updateDonationInfo(this.donationInfo);
    }
  }

  private flowHandlerListenersBound = false;

  private bindFlowListenerEvents(): void {
    if (this.flowHandlerListenersBound) {
      return;
    }
    this.flowHandlerListenersBound = true;

    this.paymentFlowHandlers?.paypalHandler?.on('payPalPaymentStarted', () => {
      this.selectedPaymentProvider = PaymentProvider.PayPal;
      this.emitPaymentFlowStartedEvent();
    });
    this.paymentFlowHandlers?.paypalHandler?.on('payPalPaymentConfirmed', () => {
      this.selectedPaymentProvider = PaymentProvider.PayPal;
      this.emitPaymentFlowConfirmedEvent();
    });
    this.paymentFlowHandlers?.paypalHandler?.on('payPalPaymentCancelled', () => {
      this.selectedPaymentProvider = PaymentProvider.PayPal;
      this.emitPaymentFlowCancelledEvent();
    });
    this.paymentFlowHandlers?.paypalHandler?.on('payPalPaymentError', (datasource, error) => {
      this.selectedPaymentProvider = PaymentProvider.PayPal;
      this.emitPaymentFlowErrorEvent(error);
    });

    this.paymentFlowHandlers?.googlePayHandler?.on('paymentCancelled', () => {
      this.selectedPaymentProvider = PaymentProvider.GooglePay;
      this.emitPaymentFlowCancelledEvent();
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
    const event = new CustomEvent('donationInfoChanged', { detail: { donationInfo } });
    this.dispatchEvent(event);
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    const donateButtonFontSize = css`var(--donateButtonFontSize, 2.6rem)`;
    const donateButtonHeight = css`var(--donateButtonHeight, 4rem)`;
    const donateButtonColor = css`var(--donateButtonColor, rgba(49, 164, 129, 1))`;
    const donateButtonTextColor = css`var(--donateButtonTextColor, #fff)`;
    const donateButtonHoverColor = css`var(--donateButtonHoverColor, rgba(39, 131, 103, 1))`;
    const totalAmountTopMargin = css`var(--donateTotalAmountTopMargin, 1.5rem)`;
    const totalAmountBottomMargin = css`var(--donateTotalAmountBottomMargin, 1.2rem)`;

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
        color: ${donateButtonTextColor};
        cursor: pointer;
        border: none;
        border-radius: 5px;
        background-color: ${donateButtonColor};
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        height: ${donateButtonHeight};
      }

      #donate-button:hover {
        background-color: ${donateButtonHoverColor};
      }

      #total-amount-section {
        display: block;
        margin-top: ${totalAmountTopMargin};
        margin-bottom: ${totalAmountBottomMargin};
      }
    `;
  }
}
