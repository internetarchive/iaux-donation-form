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

enum ModalHeaderColor {
  Blue = '#497fbf',
  Green = '#55A183',
  Red = '#691916',
}

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

  upsellModalYesSelected(
    oneTimeDonationResponse: SuccessResponse,
    amount: number,
  ): Promise<DonationResponse | undefined>;

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
    this.modalManager.addEventListener('modeChanged', this.modalModeChanged as EventListener);
  }

  /** @inheritdoc */
  closeModal(): void {
    this.modalManager.closeModal();
  }

  private modalModeChanged(event: CustomEvent): void {
    console.debug('modalModeChanged', event.detail.mode);
  }

  /** @inheritdoc */
  showProcessingModal(): void {
    const modalConfig = new ModalConfig();
    modalConfig.headerColor = ModalHeaderColor.Blue;
    modalConfig.showProcessingIndicator = true;
    modalConfig.closeOnBackdropClick = false;
    modalConfig.showCloseButton = false;
    modalConfig.processingImageMode = 'processing';
    modalConfig.title = html`
      Processing...
    `;
    this.modalManager.showModal({ config: modalConfig });
  }

  /** @inheritdoc */
  showThankYouModal(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse;
  }): void {
    const modalConfig = new ModalConfig();
    modalConfig.showProcessingIndicator = true;
    modalConfig.processingImageMode = 'complete';
    modalConfig.headerColor = ModalHeaderColor.Green;
    modalConfig.title = html`
      Thank You!
    `;
    this.modalManager.showModal({
      config: modalConfig,
    });
    this.braintreeManager.donationSuccessful(options);
  }

  /** @inheritdoc */
  showErrorModal(options: { message: string; userClosedModalCallback?: () => void }): void {
    const modalConfig = new ModalConfig();
    modalConfig.headerColor = '#691916';
    modalConfig.headline = html`
      An Error Occurred
    `;
    modalConfig.message = html`
      ${options?.message}
    `;
    this.modalManager.showModal({
      config: modalConfig,
      userClosedModalCallback: options?.userClosedModalCallback,
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
    const modalConfig = new ModalConfig();
    modalConfig.headerColor = ModalHeaderColor.Green;
    modalConfig.title = html`
      Donation received
    `;
    modalConfig.headline = html`
      Thanks for donating. Would you consider becoming a monthly donor starting next month?
    `;
    modalConfig.message = html`
      Monthly support helps ensure that anyone curious enough to seek knowledge will be able to find
      it here. For free. Together we are building the public libraries of the future.
    `;
    modalConfig.processingImageMode = 'complete';
    modalConfig.showProcessingIndicator = true;

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

  async upsellModalYesSelected(
    oneTimeDonationResponse: SuccessResponse,
    amount: number,
  ): Promise<DonationResponse | undefined> {
    console.debug('yesSelected, oneTimeDonationResponse', oneTimeDonationResponse, amount, this);

    this.showProcessingModal();

    try {
      const response = await this.braintreeManager.submitUpsellDonation({
        oneTimeDonationResponse: oneTimeDonationResponse,
        amount: amount,
      });

      console.debug('yesSelected, UpsellResponse', response);

      if (response.success) {
        this.completeUpsell({
          successResponse: oneTimeDonationResponse,
          upsellSuccessResponse: response.value as SuccessResponse,
        });
      } else {
        const error = response.value as ErrorResponse;
        this.showErrorModal({
          message: `Error setting up monthly donation: ${error.message}, ${error.errors}`,
        });
      }

      return response;
    } catch (error) {
      this.showErrorModal({
        message: `Error setting up monthly donation: ${error}`,
      });
      console.error('error getting a response', error);
      return undefined;
    }
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
          message: `Error setting up donation: ${error.message}, ${error.errors}`,
        });
        return response;
      }
    } catch (error) {
      this.showErrorModal({
        message: `Error setting up donation: ${error}`,
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
    console.debug('handleSuccessfulResponse', this);
    switch (donationInfo.donationType) {
      case DonationType.OneTime:
        this.showUpsellModal({
          oneTimeAmount: response.amount,
          yesSelected: (amount: number) => {
            console.debug('yesSelected', this);
            this.upsellModalYesSelected(response, amount);
          },
          noSelected: () => {
            console.debug('noSelected');
            this.showThankYouModal({ successResponse: response });
          },
          userClosedModalCallback: () => {
            console.debug('modal closed');
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
