import { BraintreeManagerInterface } from '../../braintree-manager/braintree-interfaces';
import { DonationResponse } from '../../models/response-models/donation-response';
import { DonationPaymentInfo } from '../../models/donation-info/donation-payment-info';
import { SuccessResponse } from '../../models/response-models/success-models/success-response';
import { DonationType } from '../../models/donation-info/donation-type';
import { DonationFlowModalManagerInterface } from '../donation-flow-modal-manager';
import { ErrorResponse } from '../../models/response-models/error-models/error-response';
import { ApplePaySessionDataSourceDelegate } from '../../braintree-manager/payment-providers/apple-pay/apple-pay-session-datasource-delegate';
import { ApplePaySessionDataSourceInterface } from '../../braintree-manager/payment-providers/apple-pay/apple-pay-session-datasource-interface';

export interface ApplePayFlowHandlerInterface {
  paymentInitiated(donationInfo: DonationPaymentInfo, e: Event): Promise<void>;
}

export class ApplePayFlowHandler
  implements ApplePayFlowHandlerInterface, ApplePaySessionDataSourceDelegate {
  private donationFlowModalManager: DonationFlowModalManagerInterface;

  private braintreeManager: BraintreeManagerInterface;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    donationFlowModalManager: DonationFlowModalManagerInterface;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.donationFlowModalManager = options.donationFlowModalManager;
  }

  private applePayDataSource?: ApplePaySessionDataSourceInterface;

  async paymentInitiated(donationInfo: DonationPaymentInfo, e: Event): Promise<void> {
    this.donationFlowModalManager.showProcessingModal();
    const handler = await this.braintreeManager?.paymentProviders.applePayHandler.get();
    this.applePayDataSource = await handler?.createPaymentRequest(e, donationInfo);

    if (this.applePayDataSource) {
      this.applePayDataSource.delegate = this;
    }
  }

  private async modalYesSelected(
    oneTimeDonationResponse: SuccessResponse,
    amount: number,
  ): Promise<void> {
    this.donationFlowModalManager.showProcessingModal();

    const response = await this.braintreeManager.submitUpsellDonation({
      oneTimeDonationResponse: oneTimeDonationResponse,
      amount: amount,
    });

    if (response.success) {
      this.donationFlowModalManager.showThankYouModal({
        successResponse: oneTimeDonationResponse,
        upsellSuccessResponse: response.value as SuccessResponse,
      });
    } else {
      const error = response.value as ErrorResponse;
      this.donationFlowModalManager.showErrorModal({
        message: `Error setting up monthly donation: ${error}`,
      });
    }
  }

  // MARK - ApplePaySessionDataSourceDelegate
  paymentComplete(response: DonationResponse): void {
    if (response.success) {
      const successResponse = response.value as SuccessResponse;
      if (this.applePayDataSource?.donationInfo.donationType == DonationType.OneTime) {
        this.donationFlowModalManager.showUpsellModal({
          oneTimeAmount: successResponse.amount,
          yesSelected: this.modalYesSelected.bind(this, successResponse),
          noSelected: this.donationFlowModalManager.showThankYouModal.bind(
            this.donationFlowModalManager,
            {
              successResponse,
            },
          ),
          userClosedModalCallback: this.donationFlowModalManager.showThankYouModal.bind(
            this.donationFlowModalManager,
            {
              successResponse,
            },
          ),
        });
      } else {
        this.donationFlowModalManager.showThankYouModal({ successResponse });
      }
    } else {
      const errorResponse = response.value as ErrorResponse;
      this.donationFlowModalManager.showErrorModal({
        message: `Error setting up donation: ${errorResponse.message}`,
      });
    }
  }

  paymentFailed(): void {
    this.donationFlowModalManager.showErrorModal({
      message: 'Payment failed',
    });
  }

  paymentCancelled(): void {
    this.donationFlowModalManager.closeModal();
  }
}
