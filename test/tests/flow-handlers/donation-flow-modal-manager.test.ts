import { html, fixture, expect } from '@open-wc/testing';
import { DonationFlowModalManager } from '../../../src/payment-flow-handlers/donation-flow-modal-manager';
import { MockModalManager } from '../../mocks/mock-modal-manager';
import '../../mocks/mock-modal-manager';
import { MockBraintreeManager } from '../../mocks/mock-braintree-manager';
import { mockSuccessResponse } from '../../mocks/models/mock-success-response';

describe('Donation Flow Modal Manager', () => {
  it('can close the modal', async () => {
    const mockModalManager = (await fixture(html`
      <mock-modal-manager></mock-modal-manager>
    `)) as MockModalManager;
    const mockBraintreeManager = new MockBraintreeManager();
    const manager = new DonationFlowModalManager({
      braintreeManager: mockBraintreeManager,
      modalManager: mockModalManager,
    });
    manager.closeModal();
    expect(mockModalManager.closeCalled).to.be.true;
  });

  it('can show the processing modal', async () => {
    const mockModalManager = (await fixture(html`
      <mock-modal-manager></mock-modal-manager>
    `)) as MockModalManager;
    const mockBraintreeManager = new MockBraintreeManager();
    const manager = new DonationFlowModalManager({
      braintreeManager: mockBraintreeManager,
      modalManager: mockModalManager,
    });
    manager.showProcessingModal();
    const modalOptions = mockModalManager.showModalOptions;
    expect(modalOptions?.config.headerColor).to.equal('#497fbf');
    expect(modalOptions?.config.showProcessingIndicator).to.be.true;
    expect(modalOptions?.config.processingImageMode).to.equal('processing');
    expect(modalOptions?.config.closeOnBackdropClick).to.be.false;
    expect(modalOptions?.config.showCloseButton).to.be.false;
    expect(modalOptions?.config.title?.getHTML().trim()).to.equal('Processing...');
  });

  it('can show the error modal', async () => {
    const mockModalManager = (await fixture(html`
      <mock-modal-manager></mock-modal-manager>
    `)) as MockModalManager;
    const mockBraintreeManager = new MockBraintreeManager();
    const manager = new DonationFlowModalManager({
      braintreeManager: mockBraintreeManager,
      modalManager: mockModalManager,
    });
    manager.showErrorModal({ message: 'foo-error' });
    const modalOptions = mockModalManager.showModalOptions;
    expect(modalOptions?.config.headerColor).to.equal('#691916');
    expect(modalOptions?.config.showProcessingIndicator).to.be.false;
    expect(modalOptions?.config.closeOnBackdropClick).to.be.true;
    expect(modalOptions?.config.showCloseButton).to.be.true;
    expect(modalOptions?.config.headline?.getHTML().trim()).to.equal('An Error Occurred');
    expect(modalOptions?.config.message?.values[0]).to.equal('foo-error');
  });

  it('shows the thank you modal and calls `donationSuccessful` to take user to thank you page', async () => {
    const mockModalManager = (await fixture(html`
      <mock-modal-manager></mock-modal-manager>
    `)) as MockModalManager;
    const mockBraintreeManager = new MockBraintreeManager();
    const manager = new DonationFlowModalManager({
      braintreeManager: mockBraintreeManager,
      modalManager: mockModalManager,
    });
    manager.showThankYouModal({
      successResponse: mockSuccessResponse,
    });
    const modalOptions = mockModalManager.showModalOptions;
    expect(modalOptions?.config.headerColor).to.equal('#55A183');
    expect(modalOptions?.config.processingImageMode).to.equal('complete');
    expect(modalOptions?.config.showProcessingIndicator).to.be.true;
    expect(modalOptions?.config.closeOnBackdropClick).to.be.true;
    expect(modalOptions?.config.showCloseButton).to.be.true;
    expect(modalOptions?.config.title?.getHTML().trim()).to.equal('Thank You!');
    const response = mockBraintreeManager.donationSuccessfulOptions?.successResponse;
    expect(response).to.deep.equal(mockSuccessResponse);
  });

  it('can ');
});
