import { ModalConfig, ModalManagerInterface } from "@internetarchive/modal-manager";
import { html } from "lit-html";
import { UpsellModalCTAMode } from "../modals/upsell-modal-content";

export interface DonationFlowModalManagerInterface {
  closeModal(): void;
  showProcessingModal(): void;
  showThankYouModal(): void;
  showErrorModal(): void;
  showUpsellModal(params: {
    ctaMode?: UpsellModalCTAMode;
    yesSelected?: (amount: number) => void;
    noSelected?: () => void;
    amountChanged?: (amount: number) => void;
  }): Promise<void>;
}

export class DonationFlowModalManager implements DonationFlowModalManagerInterface {
  private modalManager: ModalManagerInterface;

  constructor(options: {
    modalManager: ModalManagerInterface;
  }) {
    this.modalManager = options.modalManager;
  }

  closeModal(): void {
    this.modalManager.closeModal();
  }

  showProcessingModal(): void {
    const modalConfig = new ModalConfig();
    modalConfig.showProcessingIndicator = true;
    modalConfig.title = html`Processing...`;
    this.modalManager.showModal(modalConfig, undefined);
  }

  showThankYouModal(): void {
    const modalConfig = new ModalConfig();
    modalConfig.showProcessingIndicator = true;
    modalConfig.processingImageMode = 'complete';
    modalConfig.title = html`Thank You!`;
    this.modalManager.showModal(modalConfig, undefined);
  }

  showErrorModal(): void {
    const modalConfig = ModalConfig.errorConfig;
    this.modalManager.showModal(modalConfig, undefined);
  }

  showUpsellModal(params: {
    yesSelected?: (amount: number) => void;
    noSelected?: () => void;
    amountChanged?: (amount: number) => void;
    ctaMode?: UpsellModalCTAMode;
  }): Promise<void> {
    const modalConfig = new ModalConfig();
    const modalContent = html`
      <upsell-modal-content
        .yesButtonMode=${params.ctaMode ?? UpsellModalCTAMode.YesButton}
        @yesSelected=${(e: CustomEvent): void => params.yesSelected ? params.yesSelected(e.detail.amount) : undefined}
        @noThanksSelected=${params.noSelected}
        @amountChanged=${(e: CustomEvent): void => params.amountChanged ? params.amountChanged(e.detail.amount) : undefined}>
        <slot name="paypal-upsell-button"></slot>
      </upsell-modal-content>
    `;
    return this.modalManager.showModal(modalConfig, modalContent);
  }
}
