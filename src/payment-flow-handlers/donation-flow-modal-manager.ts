import { html } from 'lit-html';
import { ModalConfig, ModalManagerInterface } from '@internetarchive/modal-manager';
import { UpsellModalCTAMode } from '../modals/upsell-modal-content';
import { SuccessResponse } from '../models/response-models/success-models/success-response';
import { ErrorResponse } from '../models/response-models/error-models/error-response';
import { BraintreeManagerInterface } from '../braintree-manager/braintree-interfaces';
import { DonationPaymentInfo } from '../models/donation-info/donation-payment-info';
import { DonationType } from '../models/donation-info/donation-type';
import { PaymentProvider } from '../models/common/payment-provider-name';
import { BillingInfo } from '../models/common/billing-info';
import { CustomerInfo } from '../models/common/customer-info';
import { DonationResponse } from '../models/response-models/donation-response';
import '../modals/error-modal-content';

enum ModalHeaderColor {
  Blue = '#497fbf',
  Green = '#55A183',
  Red = '#691916',
}

/**
 * The DonationFlowModalManager is responsible for most of the high-level modal flows.
 *
 * Each of the payment providers has slightly different interactions, ie the PayPal button,
 * ApplePay popup, Venmo launching the app, etc. The modal flow is the same for all of them
 * so this class gets called by the individual payment flow handlers to take the user
 * through the modal flow.
 *
 * @export
 * @interface DonationFlowModalManagerInterface
 */
export interface DonationFlowModalManagerInterface {
  /**
   * Close the modal
   *
   * @memberof DonationFlowModalManagerInterface
   */
  closeModal(): void;

  /**
   * Show the processing modal
   *
   * @memberof DonationFlowModalManagerInterface
   */
  showProcessingModal(): void;

  /**
   * Show the Thank You modal
   *
   * @memberof DonationFlowModalManagerInterface
   */
  showThankYouModal(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse;
  }): void;

  /**
   * Show the Error modal
   *
   * @param {{
   *     userClosedModalCallback?: () => void;
   *   }} [options]
   * @memberof DonationFlowModalManagerInterface
   */
  showErrorModal(options: { message: string; userClosedModalCallback?: () => void }): void;

  /**
   * Show the upsell modal
   *
   * @param {{
   *     ctaMode?: UpsellModalCTAMode;
   *     yesSelected?: (amount: number) => void;
   *     noSelected?: () => void;
   *     amountChanged?: (amount: number) => void;
   *     userClosedModalCallback?: () => void;
   *   }} [options]
   * @returns {Promise<void>}
   * @memberof DonationFlowModalManagerInterface
   */
  showUpsellModal(options: {
    oneTimeAmount: number;
    ctaMode?: UpsellModalCTAMode;
    yesSelected?: (amount: number) => void;
    noSelected?: () => void;
    amountChanged?: (amount: number) => void;
    userClosedModalCallback?: () => void;
  }): Promise<void>;

  startDonationSubmissionFlow(options: {
    nonce: string;
    paymentProvider: PaymentProvider;
    donationInfo: DonationPaymentInfo;
    billingInfo: BillingInfo;
    customerInfo: CustomerInfo;
    upsellOnetimeTransactionId?: string;
    customerId?: string;
    recaptchaToken?: string;
    bin?: string; // first 6 digits of CC
    binName?: string; // credit card bank name
  }): Promise<DonationResponse | undefined>;

  handleSuccessfulDonationResponse(
    donationInfo: DonationPaymentInfo,
    response: SuccessResponse,
  ): void;
}

export class DonationFlowModalManager implements DonationFlowModalManagerInterface {
  private braintreeManager: BraintreeManagerInterface;

  private modalManager: ModalManagerInterface;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    modalManager: ModalManagerInterface;
  }) {
    this.modalManager = options.modalManager;
    this.braintreeManager = options.braintreeManager;
  }

  /** @inheritdoc */
  closeModal(): void {
    this.modalManager.closeModal();
  }

  /** @inheritdoc */
  showProcessingModal(): void {
    const modalConfig = new ModalConfig({
      headerColor: ModalHeaderColor.Blue,
      showProcessingIndicator: true,
      closeOnBackdropClick: false,
      showCloseButton: false,
      processingImageMode: 'processing',
      title: html`
        Processing...
      `,
    });
    this.modalManager.showModal({ config: modalConfig });
  }

  /** @inheritdoc */
  showThankYouModal(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse;
  }): void {
    const modalConfig = new ModalConfig({
      showProcessingIndicator: true,
      processingImageMode: 'complete',
      headerColor: ModalHeaderColor.Green,
      title: html`
        Thank You!
      `,
    });
    this.modalManager.showModal({
      config: modalConfig,
    });
    this.braintreeManager.donationSuccessful(options);
  }

  /** @inheritdoc */
  showErrorModal(options: { message: string; userClosedModalCallback?: () => void }): void {
    const modalConfig = new ModalConfig({
      headerColor: ModalHeaderColor.Red,
      title: html`Processing error`,
      headline: html`
        There's been a problem completing your donation.
      `,
      message: html`
        ${options?.message}
      `
    });

    this.modalManager.showModal({
      config: modalConfig,
      userClosedModalCallback: options?.userClosedModalCallback,
      customModalContent: html`
        <donation-form-error-modal-content></donation-form-error-modal-content>
      `
    });
  }

  /** @inheritdoc */
  showUpsellModal(options: {
    oneTimeAmount: number;
    yesSelected?: (amount: number) => void;
    noSelected?: () => void;
    amountChanged?: (amount: number) => void;
    userClosedModalCallback?: () => void;
    ctaMode?: UpsellModalCTAMode;
  }): Promise<void> {
    const modalConfig = new ModalConfig({
      headerColor: ModalHeaderColor.Green,
      title: html`
        Donation received
      `,
      headline: html`
        Thanks for donating. Would you consider becoming a monthly donor starting next month?
      `,
      message: html`
        Monthly support helps ensure that anyone curious enough to seek knowledge will be able to
        find it here. For free. Together we are building the public libraries of the future.
      `,
      processingImageMode: 'complete',
      showProcessingIndicator: true,
    });

    const upsellAmount = DonationFlowModalManager.getDefaultUpsellAmount(options.oneTimeAmount);
    if (options.amountChanged) {
      options.amountChanged(upsellAmount);
    }

    const modalContent = html`
      <upsell-modal-content
        .amount=${upsellAmount}
        .yesButtonMode=${options?.ctaMode ?? UpsellModalCTAMode.YesButton}
        @yesSelected=${(e: CustomEvent): void =>
          options?.yesSelected ? options.yesSelected(e.detail.amount) : undefined}
        @noThanksSelected=${options?.noSelected}
        @amountChanged=${(e: CustomEvent): void =>
          options?.amountChanged ? options.amountChanged(e.detail.amount) : undefined}
      >
        <slot name="paypal-upsell-button"></slot>
      </upsell-modal-content>
    `;
    return this.modalManager.showModal({
      config: modalConfig,
      customModalContent: modalContent,
      userClosedModalCallback: options?.userClosedModalCallback,
    });
  }

  async startDonationSubmissionFlow(options: {
    nonce: string;
    paymentProvider: PaymentProvider;
    donationInfo: DonationPaymentInfo;
    billingInfo: BillingInfo;
    customerInfo: CustomerInfo;
    upsellOnetimeTransactionId?: string;
    customerId?: string;
    recaptchaToken?: string;
    bin?: string; // first 6 digits of CC
    binName?: string; // credit card bank name
  }): Promise<DonationResponse | undefined> {
    this.showProcessingModal();

    try {
      const response = await this.braintreeManager.submitDonation(options);

      if (response.success) {
        this.handleSuccessfulDonationResponse(
          options.donationInfo,
          response.value as SuccessResponse,
        );
        return response;
      } else {
        const error = response.value as ErrorResponse;
        this.showErrorModal({
          message: error.message,
        });
        return response;
      }
    } catch (error) {
      this.showErrorModal({
        message: error,
      });
      console.error('error getting a response', error);
      return undefined;
    }
  }

  private async upsellModalYesSelected(
    oneTimeDonationResponse: SuccessResponse,
    amount: number,
  ): Promise<DonationResponse | undefined> {
    this.showProcessingModal();

    try {
      const response = await this.braintreeManager.submitUpsellDonation({
        oneTimeDonationResponse: oneTimeDonationResponse,
        amount: amount,
      });

      if (response.success) {
        this.completeUpsell({
          successResponse: oneTimeDonationResponse,
          upsellSuccessResponse: response.value as SuccessResponse,
        });
      } else {
        const error = response.value as ErrorResponse;
        this.showErrorModal({
          message: error.message,
        });
      }

      return response;
    } catch (error) {
      this.showErrorModal({
        message: error,
      });
      console.error('error getting a response', error);
      return undefined;
    }
  }

  private completeUpsell(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse;
  }): void {
    this.showThankYouModal(options);
    this.braintreeManager.donationSuccessful(options);
  }

  static getDefaultUpsellAmount(oneTimeAmount: number): number {
    let amount = 5;

    if (oneTimeAmount <= 10) amount = 5;
    else if (oneTimeAmount > 10 && oneTimeAmount <= 25) amount = 10;
    else if (oneTimeAmount > 25 && oneTimeAmount <= 100) amount = 25;
    else if (oneTimeAmount > 100) amount = 50;

    return amount;
  }

  handleSuccessfulDonationResponse(
    donationInfo: DonationPaymentInfo,
    response: SuccessResponse,
  ): void {
    switch (donationInfo.donationType) {
      case DonationType.OneTime:
        this.showUpsellModal({
          oneTimeAmount: response.amount,
          yesSelected: (amount: number) => {
            this.upsellModalYesSelected(response, amount);
          },
          noSelected: () => {
            this.showThankYouModal({ successResponse: response });
          },
          userClosedModalCallback: () => {
            this.showThankYouModal({ successResponse: response });
          },
        });
        break;
      case DonationType.Monthly:
        this.showThankYouModal({ successResponse: response });
        break;
      // This case will never be reached, it is only here for completeness.
      // The upsell case gets handled in `modalYesSelected()` below
      case DonationType.Upsell:
        break;
      default:
        break;
    }
  }
}
