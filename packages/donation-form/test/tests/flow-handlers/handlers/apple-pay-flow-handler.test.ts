/* eslint-disable @typescript-eslint/camelcase */
import { expect } from '@open-wc/testing';
import { MockDonationFlowModalManager } from '../../../mocks/mock-donation-flow-modal-manager';
import { ApplePayFlowHandler } from '../../../../src/payment-flow-handlers/handlers/applepay-flow-handler';
import { MockBraintreeManager } from '../../../mocks/mock-braintree-manager';
import {
  DonationPaymentInfo,
  DonationResponse,
  DonationType,
  ErrorResponse,
} from '@internetarchive/donation-form-data-models';
import { MockApplePayHandler } from '../../../mocks/payment-providers/individual-providers/mock-applepay-handler';
import { mockSuccessResponse } from '../../../mocks/models/mock-success-response';

describe('ApplePay Flow Handler', () => {
  it('handles the paymentInitiated event properly', async () => {
    const braintreeManager = new MockBraintreeManager();
    const modalFlowManager = new MockDonationFlowModalManager();
    const applePayFlowHandler = new ApplePayFlowHandler({
      braintreeManager: braintreeManager,
      donationFlowModalManager: modalFlowManager,
    });
    const donationInfo = new DonationPaymentInfo({
      donationType: DonationType.OneTime,
      amount: 3.5,
      coverFees: false,
    });
    const mockEvent = new Event('boop');
    await applePayFlowHandler.paymentInitiated(donationInfo, mockEvent);
    expect(modalFlowManager.showProcessingModalCalled).to.be.true;
    const handler = (await braintreeManager?.paymentProviders.applePayHandler.get()) as MockApplePayHandler;
    const dataSource = handler.dataSource;
    expect(dataSource?.delegate).to.not.be.undefined;
  });

  it('shows the upsell modal after a one-time donation completes successfully', async () => {
    const braintreeManager = new MockBraintreeManager();
    const modalFlowManager = new MockDonationFlowModalManager();
    const applePayFlowHandler = new ApplePayFlowHandler({
      braintreeManager: braintreeManager,
      donationFlowModalManager: modalFlowManager,
    });
    const response = new DonationResponse({ success: true, value: mockSuccessResponse });
    expect(modalFlowManager.showUpsellModalOptions).to.be.undefined;
    applePayFlowHandler.paymentComplete(response);
    expect(modalFlowManager.showUpsellModalOptions).to.not.be.undefined;
  });

  it('shows the thank you modal after a monthly donation completes successfully', async () => {
    const braintreeManager = new MockBraintreeManager();
    const modalFlowManager = new MockDonationFlowModalManager();
    const applePayFlowHandler = new ApplePayFlowHandler({
      braintreeManager: braintreeManager,
      donationFlowModalManager: modalFlowManager,
    });
    const mockMonthlySuccessResponse = mockSuccessResponse;
    mockMonthlySuccessResponse.donationType = DonationType.Monthly;
    const response = new DonationResponse({ success: true, value: mockMonthlySuccessResponse });
    expect(modalFlowManager.showThankYouModalOptions).to.be.undefined;
    applePayFlowHandler.paymentComplete(response);
    expect(modalFlowManager.showThankYouModalOptions).to.not.be.undefined;
  });

  it('shows the error modal if the response was unsuccessful', async () => {
    const braintreeManager = new MockBraintreeManager();
    const modalFlowManager = new MockDonationFlowModalManager();
    const applePayFlowHandler = new ApplePayFlowHandler({
      braintreeManager: braintreeManager,
      donationFlowModalManager: modalFlowManager,
    });
    const errorResponse = new ErrorResponse({ message: 'oh no' });
    const response = new DonationResponse({ success: false, value: errorResponse });
    expect(modalFlowManager.showErrorModalOptions).to.be.undefined;
    applePayFlowHandler.paymentComplete(response);
    expect(modalFlowManager.showErrorModalOptions).to.not.be.undefined;
  });

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
