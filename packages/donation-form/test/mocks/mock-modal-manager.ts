/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModalManager, ModalConfig, ModalManagerMode } from '@internetarchive/modal-manager';
import { TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('mock-modal-manager')
export class MockModalManager extends ModalManager {
  closeCalled = false;
  showModalOptions?: {
    config: ModalConfig;
    customModalContent?: TemplateResult;
    userClosedModalCallback?: () => void;
  };

  closeModal(): void {
    this.closeCalled = true;
  }

  getMode(): ModalManagerMode {
    return ModalManagerMode.Closed;
  }

  async showModal(options: {
    config: ModalConfig;
    customModalContent?: TemplateResult;
    userClosedModalCallback?: () => void;
  }): Promise<void> {
    this.showModalOptions = options;
    return;
  }
}
