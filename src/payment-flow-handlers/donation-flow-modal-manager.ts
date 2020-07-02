import { ModalConfig, ModalManagerInterface } from "@internetarchive/modal-manager";
import { html } from "lit-html";
import { UpsellModalCTAMode } from "../modals/upsell-modal-content";

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
  showErrorModal(options?: {
    userClosedModalCallback?: () => void;
  }): void;

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
  showUpsellModal(options?: {
    ctaMode?: UpsellModalCTAMode;
    yesSelected?: (amount: number) => void;
    noSelected?: () => void;
    amountChanged?: (amount: number) => void;
    userClosedModalCallback?: () => void;
  }): Promise<void>;
}

export class DonationFlowModalManager implements DonationFlowModalManagerInterface {
  private modalManager: ModalManagerInterface;

  constructor(options: {
    modalManager: ModalManagerInterface;
  }) {
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
    modalConfig.showProcessingIndicator = true;
    modalConfig.allowUserToClose = false;
    modalConfig.title = html`Processing...`;
    this.modalManager.showModal({ config: modalConfig });
  }

  /** @inheritdoc */
  showThankYouModal(): void {
    const modalConfig = new ModalConfig();
    modalConfig.showProcessingIndicator = true;
    modalConfig.processingImageMode = 'complete';
    modalConfig.title = html`Thank You!`;
    this.modalManager.showModal({
      config: modalConfig
    });
  }

  /** @inheritdoc */
  showErrorModal(options?: {
    userClosedModalCallback?: () => void;
  }): void {
    const modalConfig = ModalConfig.errorConfig;
    this.modalManager.showModal({
      config: modalConfig,
      userClosedModalCallback: options?.userClosedModalCallback
    });
  }

  /** @inheritdoc */
  showUpsellModal(options?: {
    yesSelected?: (amount: number) => void;
    noSelected?: () => void;
    amountChanged?: (amount: number) => void;
    userClosedModalCallback?: () => void;
    ctaMode?: UpsellModalCTAMode;
  }): Promise<void> {
    const modalConfig = new ModalConfig();
    const modalContent = html`
      <upsell-modal-content
        .yesButtonMode=${options?.ctaMode ?? UpsellModalCTAMode.YesButton}
        @yesSelected=${(e: CustomEvent): void => options?.yesSelected ? options.yesSelected(e.detail.amount) : undefined}
        @noThanksSelected=${options?.noSelected}
        @amountChanged=${(e: CustomEvent): void => options?.amountChanged ? options.amountChanged(e.detail.amount) : undefined}>
        <slot name="paypal-upsell-button"></slot>
      </upsell-modal-content>
    `;
    return this.modalManager.showModal({
      config: modalConfig,
      customModalContent: modalContent,
      userClosedModalCallback: options?.userClosedModalCallback
    });
  }
}
