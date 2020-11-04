/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SuccessResponse,
  PaymentProvider,
  DonationPaymentInfo,
  BillingInfo,
  CustomerInfo,
  DonationResponse,
} from '@internetarchive/donation-form-data-models';
import { UpsellModalCTAMode } from '../../src/modals/upsell-modal-content';
import { DonationFlowModalManagerInterface } from '../../src/payment-flow-handlers/donation-flow-modal-manager';

export class MockDonationFlowModalManager implements DonationFlowModalManagerInterface {
  closeModalCalled = false;
  showProcessingModalCalled = false;
  showThankYouModalOptions?: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse | undefined;
  };
  showErrorModalOptions?: {
    message: string;
    userClosedModalCallback?: (() => void) | undefined;
  };
  showUpsellModalOptions?: {
    oneTimeAmount: number;
    ctaMode?: UpsellModalCTAMode | undefined;
    yesSelected?: ((amount: number) => void) | undefined;
    noSelected?: (() => void) | undefined;
    amountChanged?: ((amount: number) => void) | undefined;
    userClosedModalCallback?: (() => void) | undefined;
  };
  startDonationSubmissionFlowOptions?: {
    nonce: string;
    paymentProvider: PaymentProvider;
    donationInfo: DonationPaymentInfo;
    billingInfo: BillingInfo;
    customerInfo: CustomerInfo;
    upsellOnetimeTransactionId?: string | undefined;
    customerId?: string | undefined;
    recaptchaToken?: string | undefined;
    bin?: string | undefined;
    binName?: string | undefined;
  };
  handleSuccessfulDonationResponseDonationInfo?: DonationPaymentInfo;
  handleSuccessfulDonationResponseResponse?: SuccessResponse;

  closeModal(): void {
    this.closeModalCalled = true;
  }
  showProcessingModal(): void {
    this.showProcessingModalCalled = true;
  }
  showThankYouModal(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse | undefined;
  }): void {
    this.showThankYouModalOptions = options;
  }
  showErrorModal(options: {
    message: string;
    userClosedModalCallback?: (() => void) | undefined;
  }): void {
    this.showErrorModalOptions = options;
  }
  async showUpsellModal(options: {
    oneTimeAmount: number;
    ctaMode?: UpsellModalCTAMode | undefined;
    yesSelected?: ((amount: number) => void) | undefined;
    noSelected?: (() => void) | undefined;
    amountChanged?: ((amount: number) => void) | undefined;
    userClosedModalCallback?: (() => void) | undefined;
  }): Promise<void> {
    this.showUpsellModalOptions = options;
  }
  async startDonationSubmissionFlow(options: {
    nonce: string;
    paymentProvider: PaymentProvider;
    donationInfo: DonationPaymentInfo;
    billingInfo: BillingInfo;
    customerInfo: CustomerInfo;
    upsellOnetimeTransactionId?: string | undefined;
    customerId?: string | undefined;
    recaptchaToken?: string | undefined;
    bin?: string | undefined;
    binName?: string | undefined;
  }): Promise<DonationResponse | undefined> {
    this.startDonationSubmissionFlowOptions = options;
    return undefined;
  }
  handleSuccessfulDonationResponse(
    donationInfo: DonationPaymentInfo,
    response: SuccessResponse,
  ): void {
    this.handleSuccessfulDonationResponseDonationInfo = donationInfo;
    this.handleSuccessfulDonationResponseResponse = response;
  }
}
