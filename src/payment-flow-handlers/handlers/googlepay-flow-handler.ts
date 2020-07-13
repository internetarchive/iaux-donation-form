import { BraintreeManagerInterface } from '../../braintree-manager/braintree-interfaces';
import { DonationPaymentInfo } from '../../models/donation-info/donation-payment-info';
import { SuccessResponse } from '../../models/response-models/success-models/success-response';
import { DonationRequest } from '../../models/request-models/donation-request';
import { PaymentProvider } from '../../models/common/payment-provider-name';
import { DonationType } from '../../models/donation-info/donation-type';
import { DonationFlowModalManagerInterface } from '../donation-flow-modal-manager';
import { CustomerInfo } from '../../models/common/customer-info';
import { BillingInfo } from '../../models/common/billing-info';
import { ErrorResponse } from '../../models/response-models/error-models/error-response';

export interface GooglePayFlowHandlerInterface {
  paymentInitiated(donationInfo: DonationPaymentInfo): Promise<void>;
}

export class GooglePayFlowHandler implements GooglePayFlowHandlerInterface {
  private donationFlowModalManager: DonationFlowModalManagerInterface;

  private braintreeManager: BraintreeManagerInterface;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    donationFlowModalManager: DonationFlowModalManagerInterface;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.donationFlowModalManager = options.donationFlowModalManager;
  }

  // GooglePayFlowHandlerInterface conformance
  async paymentInitiated(donationInfo: DonationPaymentInfo): Promise<void> {
    this.donationFlowModalManager.showProcessingModal();
    const handler = await this.braintreeManager?.paymentProviders.googlePayHandler.get();
    const instance = await handler.instance.get();

    const paymentDataRequest = await instance.createPaymentDataRequest({
      emailRequired: true,
      transactionInfo: {
        currencyCode: 'USD',
        totalPriceStatus: 'FINAL',
        totalPrice: `${donationInfo.total}`,
      },
    });

    const cardPaymentMethod = paymentDataRequest.allowedPaymentMethods[0];
    cardPaymentMethod.parameters.billingAddressRequired = true;
    cardPaymentMethod.parameters.billingAddressParameters = {
      format: 'FULL',
      phoneNumberRequired: false,
    };

    console.debug('paymentDataRequest', cardPaymentMethod, paymentDataRequest);

    try {
      const paymentData = await handler.paymentsClient.loadPaymentData(paymentDataRequest);
      const result: braintree.GooglePaymentTokenizePayload = await instance.parseResponse(
        paymentData,
      );

      const billingInfo = paymentData.paymentMethodData.info?.billingAddress;
      const name = billingInfo?.name;
      let firstName: string | undefined = name;
      let lastName: string | undefined = '';
      // TODO: use the name parsing library
      const lastSpace = name?.lastIndexOf(' ');
      if (lastSpace && lastSpace !== -1) {
        firstName = name?.substr(0, lastSpace);
        lastName = name?.substr(lastSpace);
      }

      const customer = new CustomerInfo({
        email: paymentData.email,
        firstName,
        lastName,
      });

      const billing = new BillingInfo({
        streetAddress: billingInfo?.address1,
        extendedAddress: billingInfo?.address2,
        locality: billingInfo?.locality,
        region: billingInfo?.administrativeArea,
        postalCode: billingInfo?.postalCode,
        countryCodeAlpha2: billingInfo?.countryCode,
      });

      const donationRequest = new DonationRequest({
        paymentProvider: PaymentProvider.GooglePay,
        paymentMethodNonce: result.nonce,

        bin: result.details.bin, // first 6 digits of CC
        binName: result.binData.issuingBank, // credit card bank name

        amount: donationInfo.total,
        donationType: donationInfo.donationType,

        customer,
        billing,
        customFields: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          fee_amount_covered: donationInfo.feeAmountCovered,
        },
      });

      const response = await this.braintreeManager.submitDataToEndpoint(donationRequest);

      if (response.success) {
        this.handleSuccessfulResponse(donationInfo, response.value as SuccessResponse);
      } else {
        const error = response.value as ErrorResponse;
        this.donationFlowModalManager.showErrorModal({
          message: `Error setting up donation: ${error.message}, ${error.errors}`,
        });
      }

      console.debug('result', paymentData, result);
    } catch {
      this.donationFlowModalManager.closeModal();
    }
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
      default:
        break;
    }
  }

  private showThankYouModal(options: {
    successResponse: SuccessResponse;
    upsellSuccessResponse?: SuccessResponse;
  }): void {
    this.donationFlowModalManager.showThankYouModal();
    this.braintreeManager.donationSuccessful(options);
  }

  private async modalYesSelected(
    oneTimeDonationResponse: SuccessResponse,
    amount: number,
  ): Promise<void> {
    console.debug('yesSelected, oneTimeDonationResponse', oneTimeDonationResponse, 'e', amount);

    const donationRequest = new DonationRequest({
      paymentMethodNonce: oneTimeDonationResponse.paymentMethodNonce,
      paymentProvider: PaymentProvider.CreditCard,
      recaptchaToken: undefined,
      customerId: oneTimeDonationResponse.customer_id,
      deviceData: this.braintreeManager.deviceData,
      amount,
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
