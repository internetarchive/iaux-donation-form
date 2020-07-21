import { html } from 'lit-html';
import { ModalConfig, ModalManagerInterface } from '@internetarchive/modal-manager';
import { UpsellModalCTAMode } from '../modals/upsell-modal-content';

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
  showThankYouModal(): void;

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
}

export class DonationFlowModalManager implements DonationFlowModalManagerInterface {
  private modalManager: ModalManagerInterface;

  constructor(options: { modalManager: ModalManagerInterface }) {
    this.modalManager = options.modalManager;
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
    modalConfig.title = html`
      Processing...
    `;
    this.modalManager.showModal({ config: modalConfig });
  }

  /** @inheritdoc */
  showThankYouModal(): void {
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
  }

  /** @inheritdoc */
  showErrorModal(options: { message: string; userClosedModalCallback?: () => void }): void {
    const modalConfig = new ModalConfig();
    modalConfig.headerColor = '#691916';
    modalConfig.headline = html`An Error Occurred`
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

    const upsellAmount = this.getDefaultUpsellAmount(options.oneTimeAmount);

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

  private getDefaultUpsellAmount(oneTimeAmount: number): number {
    let amount = 5;

    if (oneTimeAmount <= 10)
      amount = 5;
    else if (oneTimeAmount > 10 && oneTimeAmount <= 25)
      amount = 10;
    else if (oneTimeAmount > 25 && oneTimeAmount <= 100)
      amount = 25;
    else if (oneTimeAmount > 100)
      amount = 50;

    return amount;
  }
}
