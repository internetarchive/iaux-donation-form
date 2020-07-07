import { BraintreeManagerInterface } from '../../braintree-manager/braintree-interfaces';
import { RecaptchaManagerInterface } from '../../recaptcha-manager/recaptcha-manager';

import { DonorContactInfo } from '../../models/common/donor-contact-info';
import { DonationRequest } from '../../models/request-models/donation-request';
import { DonationType } from '../../models/donation-info/donation-type';
import { DonationResponse } from '../../models/response-models/donation-response';
import { SuccessResponse } from '../../models/response-models/success-models/success-response';
import { DonationPaymentInfo } from '../../models/donation-info/donation-payment-info';
import { PaymentProvider } from '../../models/common/payment-provider-name';
import { DonationFlowModalManagerInterface } from '../donation-flow-modal-manager';
import { ErrorResponse } from '../../models/response-models/error-models/error-response';
import { HostedFieldName } from '../../braintree-manager/payment-providers/credit-card/hosted-field-container';

export interface CreditCardFlowHandlerInterface {
  paymentInitiated(
    donationInfo: DonationPaymentInfo,
    donorContactInfo: DonorContactInfo,
  ): Promise<void>;
}

export class CreditCardFlowHandler implements CreditCardFlowHandlerInterface {
  private donationFlowModalManager: DonationFlowModalManagerInterface;

  private braintreeManager: BraintreeManagerInterface;

  private recaptchaManager: RecaptchaManagerInterface;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    donationFlowModalManager: DonationFlowModalManagerInterface;
    recaptchaManager: RecaptchaManagerInterface;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.donationFlowModalManager = options.donationFlowModalManager;
    this.recaptchaManager = options.recaptchaManager;
  }

  // PaymentFlowHandlerInterface conformance
  async paymentInitiated(
    donationInfo: DonationPaymentInfo,
    donorContactInfo: DonorContactInfo,
  ): Promise<void> {
    let hostedFieldsResponse: braintree.HostedFieldsTokenizePayload | undefined;

    const start = performance.now();
    console.debug('paymentInitiated donorContactInfo', donorContactInfo);

    const handler = await this.braintreeManager.paymentProviders.getCreditCardHandler();

    try {
      hostedFieldsResponse = await handler?.tokenizeHostedFields();
    } catch (error) {
      console.debug(error);
      // this.braintreeManager.paymentProviders.getCreditCardHandler
      handler.markFieldErrors([HostedFieldName.Number]);
      // this.donationFlowModalManager.showErrorModal({
      //   message: `Credit card info missing: ${error}`,
      // });
      return;
    }

    console.debug(
      'paymentInitiated, hostedFieldsResponse',
      hostedFieldsResponse,
      'time from start',
      performance.now() - start,
    );

    if (!hostedFieldsResponse) {
      this.donationFlowModalManager.showErrorModal({
        message: 'Error getting credit card response',
      });
      console.error('no hostedFieldsResponse');
      return;
    }

    let recaptchaToken: string | undefined;

    try {
      recaptchaToken = await this.recaptchaManager.execute();
    } catch (error) {
      this.donationFlowModalManager.showErrorModal({
        message: `Recaptcha failure: ${error}`,
      });
      console.error('recaptcha failure', error);
      return;
    }
    console.debug(
      'paymentInitiated recaptchaToken',
      recaptchaToken,
      'time from start',
      performance.now() - start,
    );

    this.donationFlowModalManager.showProcessingModal();

    const donationRequest = new DonationRequest({
      paymentMethodNonce: hostedFieldsResponse.nonce,
      paymentProvider: PaymentProvider.CreditCard,
      recaptchaToken: recaptchaToken,
      deviceData: this.braintreeManager.deviceData,
      bin: hostedFieldsResponse.details.bin,
      amount: donationInfo.total,
      donationType: donationInfo.donationType,
      customer: donorContactInfo.customer,
      billing: donorContactInfo.billing,
      customFields: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        fee_amount_covered: donationInfo.feeAmountCovered,
      },
    });

    let response: DonationResponse;
    try {
      response = await this.braintreeManager.submitDataToEndpoint(donationRequest);

      console.debug('RESPONSE', response);

      if (response.success) {
        this.handleSuccessfulResponse(donationInfo, response.value as SuccessResponse);
      } else {
        const error = response.value as ErrorResponse;
        this.donationFlowModalManager.showErrorModal({
          message: `Error setting up donation: ${error.message}, ${error.errors}`,
        });
      }
    } catch (error) {
      this.donationFlowModalManager.showErrorModal({
        message: `Error getting a response from the server: ${error}`,
      });
      console.error('error getting a response', error);
      return;
    }
  }

  private showThankYouModal(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse;
  }): void {
    this.donationFlowModalManager.showThankYouModal();
    this.braintreeManager.donationSuccessful(options);
  }

  private handleSuccessfulResponse(
    donationInfo: DonationPaymentInfo,
    response: SuccessResponse,
  ): void {
    console.debug('handleSuccessfulResponse', this);
    switch (donationInfo.donationType) {
      case DonationType.OneTime:
        this.donationFlowModalManager.showUpsellModal({
          yesSelected: (amount: number) => {
            console.debug('yesSelected', this);
            this.modalYesSelected(response, amount);
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
    }
  }

  private async modalYesSelected(
    oneTimeDonationResponse: SuccessResponse,
    amount: number,
  ): Promise<void> {
    console.debug('yesSelected, oneTimeDonationResponse', oneTimeDonationResponse, amount, this);

    const donationRequest = new DonationRequest({
      paymentMethodNonce: oneTimeDonationResponse.paymentMethodNonce,
      paymentProvider: PaymentProvider.CreditCard,
      recaptchaToken: undefined,
      customerId: oneTimeDonationResponse.customer_id,
      deviceData: this.braintreeManager.deviceData,
      amount: amount,
      donationType: DonationType.Upsell,
      customer: oneTimeDonationResponse.customer,
      billing: oneTimeDonationResponse.billing,
      customFields: undefined,
      upsellOnetimeTransactionId: oneTimeDonationResponse.transaction_id,
    });

    this.donationFlowModalManager.showProcessingModal();

    console.debug('yesSelected, donationRequest', donationRequest);

    const response = await this.braintreeManager.submitDataToEndpoint(donationRequest);

    console.debug('yesSelected, UpsellResponse', response);

    if (response.success) {
      this.showThankYouModal({
        successResponse: oneTimeDonationResponse,
        upsellSuccessResponse: response.value as SuccessResponse,
      });
    } else {
      const error = response.value as ErrorResponse;
      this.donationFlowModalManager.showErrorModal({
        message: `Error setting up monthly donation: ${error.message}, ${error.errors}`,
      });
    }
  }
}
