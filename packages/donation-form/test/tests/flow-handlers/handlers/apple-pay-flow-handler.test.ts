/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';
import { MockDonationFlowModalManager } from '../../../mocks/mock-donation-flow-modal-manager';
import { ApplePayFlowHandler } from '../../../../src/payment-flow-handlers/handlers/applepay-flow-handler';
import { MockBraintreeManager } from '../../../mocks/mock-braintree-manager';

describe('ApplePay Flow Handler', () => {
  it('shows the error modal if the payment fails', async () => {
    const braintreeManager = new MockBraintreeManager();
    const modalFlowManager = new MockDonationFlowModalManager();
    const applePayFlowHandler = new ApplePayFlowHandler({
      braintreeManager: braintreeManager,
      donationFlowModalManager: modalFlowManager,
    });
    applePayFlowHandler.paymentFailed();
    expect(modalFlowManager.showErrorModalOptions).to.not.be.undefined;
  });

  it('closes the modal if the payment is cancelled', async () => {
    const braintreeManager = new MockBraintreeManager();
    const modalFlowManager = new MockDonationFlowModalManager();
    const applePayFlowHandler = new ApplePayFlowHandler({
      braintreeManager: braintreeManager,
      donationFlowModalManager: modalFlowManager,
    });
    applePayFlowHandler.paymentCancelled();
    expect(modalFlowManager.closeModalCalled).to.be.true;
  });
});
