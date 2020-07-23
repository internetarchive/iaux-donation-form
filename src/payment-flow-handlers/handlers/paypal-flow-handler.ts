import {
  PayPalButtonDataSourceInterface,
  PayPalButtonDataSourceDelegate,
} from '../../braintree-manager/payment-providers/paypal/paypal-button-datasource';
import { DonationResponse } from '../../models/response-models/donation-response';
import { BraintreeManagerInterface } from '../../braintree-manager/braintree-interfaces';
import { DonationType } from '../../models/donation-info/donation-type';
import { DonationPaymentInfo } from '../../models/donation-info/donation-payment-info';

import { UpsellModalCTAMode } from '../../modals/upsell-modal-content';
import { DonationRequest } from '../../models/request-models/donation-request';
import { SuccessResponse } from '../../models/response-models/success-models/success-response';
import { CustomerInfo } from '../../models/common/customer-info';
import { BillingInfo } from '../../models/common/billing-info';
import { PaymentProvider } from '../../models/common/payment-provider-name';
import {
  DonationFlowModalManagerInterface,
  DonationFlowModalManager,
} from '../donation-flow-modal-manager';

export interface PayPalFlowHandlerInterface {
  updateDonationInfo(donationInfo: DonationPaymentInfo): void;
  updateUpsellDonationInfo(donationInfo: DonationPaymentInfo): void;
  renderPayPalButton(donationInfo: DonationPaymentInfo): Promise<void>;
}

/**
 * This is a class to combine the data from the one-time purchase to the upsell
 *
 * @class UpsellDataSourceContainer
 */
class UpsellDataSourceContainer {
  upsellButtonDataSource: PayPalButtonDataSourceInterface;
  oneTimePayload: paypal.TokenizePayload;
  oneTimeSuccessResponse: SuccessResponse;

  constructor(options: {
    upsellButtonDataSource: PayPalButtonDataSourceInterface;
    oneTimePayload: paypal.TokenizePayload;
    oneTimeSuccessResponse: SuccessResponse;
  }) {
    this.upsellButtonDataSource = options.upsellButtonDataSource;
    this.oneTimePayload = options.oneTimePayload;
    this.oneTimeSuccessResponse = options.oneTimeSuccessResponse;
  }
}

/**
 * This class manages the user-flow for PayPal.
 *
 * @export
 * @class PayPalFlowHandler
 * @implements {PayPalFlowHandlerInterface}
 * @implements {PayPalButtonDataSourceDelegate}
 */
export class PayPalFlowHandler
  implements PayPalFlowHandlerInterface, PayPalButtonDataSourceDelegate {
  private upsellButtonDataSourceContainer?: UpsellDataSourceContainer;

  private buttonDataSource?: PayPalButtonDataSourceInterface;

  private donationFlowModalManager: DonationFlowModalManagerInterface;

  private braintreeManager: BraintreeManagerInterface;

  updateDonationInfo(donationInfo: DonationPaymentInfo): void {
    console.debug('updateDonationInfo', donationInfo);
    if (this.buttonDataSource) {
      this.buttonDataSource.donationInfo = donationInfo;
    }
  }

  updateUpsellDonationInfo(donationInfo: DonationPaymentInfo): void {
    if (this.upsellButtonDataSourceContainer) {
      this.upsellButtonDataSourceContainer.upsellButtonDataSource.donationInfo = donationInfo;
    }
  }

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    donationFlowModalManager: DonationFlowModalManagerInterface;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.donationFlowModalManager = options.donationFlowModalManager;
  }

  async payPalPaymentStarted(
    dataSource: PayPalButtonDataSourceInterface,
    options: object,
  ): Promise<void> {
    console.debug(
      'PaymentSector:payPalPaymentStarted options:',
      dataSource,
      dataSource.donationInfo,
      options,
    );
  }

  async payPalPaymentAuthorized(
    dataSource: PayPalButtonDataSourceInterface,
    payload: paypal.TokenizePayload,
  ): Promise<void> {
    console.debug(
      'PaymentSector:payPalPaymentAuthorized payload,response',
      dataSource,
      dataSource.donationInfo,
      payload,
    );

    this.donationFlowModalManager.showProcessingModal();

    const donationType = dataSource.donationInfo.donationType;

    const details = payload?.details;

    const customerInfo = new CustomerInfo({
      email: details?.email,
      firstName: details?.firstName,
      lastName: details?.lastName,
    });

    const shippingAddress = details.shippingAddress;

    const billingInfo = new BillingInfo({
      streetAddress: shippingAddress?.line1,
      extendedAddress: shippingAddress?.line2,
      locality: shippingAddress?.city,
      region: shippingAddress?.state,
      postalCode: shippingAddress?.postalCode,
      countryCodeAlpha2: shippingAddress?.countryCode,
    });

    const oneTimeTransaction = this.upsellButtonDataSourceContainer
      ? this.upsellButtonDataSourceContainer.oneTimeSuccessResponse.transaction_id
      : undefined;

    const response: DonationResponse = await this.braintreeManager.submitDonation({
      nonce: payload.nonce,
      paymentProvider: PaymentProvider.PayPal,
      donationInfo: dataSource.donationInfo,
      customerInfo: customerInfo,
      billingInfo: billingInfo,
      upsellOnetimeTransactionId: oneTimeTransaction,
    });

    if (!response.success) {
      this.donationFlowModalManager.showErrorModal({
        message: 'Error setting up donation',
      });
      return;
    }

    const successResponse = response.value as SuccessResponse;

    switch (donationType) {
      case DonationType.OneTime:
        console.debug('ONE TIME, SHOW MODAL');
        this.showUpsellModal(payload, successResponse);
        break;
      case DonationType.Monthly:
        console.debug('MONTHLY, SHOW THANKS');
        // show thank you, redirect
        this.donationFlowModalManager.showThankYouModal({ successResponse });
        break;
      case DonationType.Upsell:
        console.debug('UPSELL, SHOW THANKS');
        if (this.upsellButtonDataSourceContainer) {
          this.donationFlowModalManager.showThankYouModal({
            successResponse: this.upsellButtonDataSourceContainer.oneTimeSuccessResponse,
            upsellSuccessResponse: successResponse,
          });
        } else {
          // we're in the upsell flow, but no upsell data source container.. this should not happen
          this.donationFlowModalManager.showErrorModal({
            message: 'Error setting up monthly donation',
          });
        }
        break;
    }
  }

  async payPalPaymentCancelled(
    dataSource: PayPalButtonDataSourceInterface,
    data: object,
  ): Promise<void> {
    console.debug(
      'PaymentSector:payPalPaymentCancelled data:',
      dataSource,
      dataSource.donationInfo,
      data,
    );
  }

  async payPalPaymentError(
    dataSource: PayPalButtonDataSourceInterface,
    error: string,
  ): Promise<void> {
    console.debug(
      'PaymentSector:payPalPaymentError error:',
      dataSource,
      dataSource.donationInfo,
      error,
    );
  }

  async renderPayPalButton(donationInfo: DonationPaymentInfo): Promise<void> {
    const handler = await this.braintreeManager?.paymentProviders.paypalHandler.get();

    this.buttonDataSource = await handler?.renderPayPalButton({
      selector: '#paypal-button',
      style: {
        color: 'blue' as paypal.ButtonColorOption, // I'm not sure why I can't access the enum directly here.. I get a UMD error
        label: 'paypal' as paypal.ButtonLabelOption,
        shape: 'rect' as paypal.ButtonShapeOption,
        size: 'medium' as paypal.ButtonSizeOption,
        tagline: false,
      },
      donationInfo: donationInfo,
    });

    if (this.buttonDataSource) {
      this.buttonDataSource.delegate = this;
    }
  }

  private async showUpsellModal(
    oneTimePayload: paypal.TokenizePayload,
    oneTimeSuccessResponse: SuccessResponse,
  ): Promise<void> {
    console.debug('showUpsellModal', oneTimePayload, oneTimeSuccessResponse);

    this.donationFlowModalManager.showUpsellModal({
      oneTimeAmount: oneTimeSuccessResponse.amount,
      amountChanged: this.upsellAmountChanged.bind(this),
      noSelected: () => {
        console.debug('noSelected');
        this.donationFlowModalManager.showThankYouModal({
          successResponse: oneTimeSuccessResponse,
        });
      },
      ctaMode: UpsellModalCTAMode.Slot,
      userClosedModalCallback: () => {
        console.debug('userClosedModalCallback');
        this.donationFlowModalManager.showThankYouModal({
          successResponse: oneTimeSuccessResponse,
        });
      },
    });

    const amount = DonationFlowModalManager.getDefaultUpsellAmount(oneTimeSuccessResponse.amount);

    const upsellDonationInfo = new DonationPaymentInfo({
      amount: amount,
      donationType: DonationType.Upsell,
      coverFees: false,
    });

    if (!this.upsellButtonDataSourceContainer) {
      this.renderUpsellPayPalButton({
        donationInfo: upsellDonationInfo,
        oneTimePayload,
        oneTimeSuccessResponse,
      });
    }
  }

  private upsellAmountChanged(amount: number): void {
    console.debug('upsellAmountChanged', amount);
    if (this.upsellButtonDataSourceContainer) {
      this.upsellButtonDataSourceContainer.upsellButtonDataSource.donationInfo.amount = amount;
    }
  }

  private async renderUpsellPayPalButton(options: {
    donationInfo: DonationPaymentInfo;
    oneTimePayload: paypal.TokenizePayload;
    oneTimeSuccessResponse: SuccessResponse;
  }): Promise<void> {
    const handler = await this.braintreeManager?.paymentProviders.paypalHandler.get();

    const upsellButtonDataSource = await handler?.renderPayPalButton({
      selector: '#paypal-upsell-button',
      style: {
        color: 'gold' as paypal.ButtonColorOption, // I'm not sure why I can't access the enum directly here.. I get a UMD error
        label: 'paypal' as paypal.ButtonLabelOption,
        shape: 'rect' as paypal.ButtonShapeOption,
        size: 'medium' as paypal.ButtonSizeOption,
        tagline: false,
      },
      donationInfo: options.donationInfo,
    });

    if (upsellButtonDataSource) {
      upsellButtonDataSource.delegate = this;
      this.upsellButtonDataSourceContainer = new UpsellDataSourceContainer({
        upsellButtonDataSource: upsellButtonDataSource,
        oneTimePayload: options.oneTimePayload,
        oneTimeSuccessResponse: options.oneTimeSuccessResponse,
      });
    } else {
      // this.showErrorModal();
      // alert('ERROR RENDERING UPSELL PAYPAL BUTTON');
      console.error('error rendering paypal upsell button');
    }
  }

  private buildDonationRequest(params: {
    donationInfo: DonationPaymentInfo;
    payload: paypal.TokenizePayload;
  }): DonationRequest {
    const details = params.payload?.details;

    const customerInfo = new CustomerInfo({
      email: details?.email,
      firstName: details?.firstName,
      lastName: details?.lastName,
    });

    const shippingAddress = details.shippingAddress;

    const billingInfo = new BillingInfo({
      streetAddress: shippingAddress?.line1,
      extendedAddress: shippingAddress?.line2,
      locality: shippingAddress?.city,
      region: shippingAddress?.state,
      postalCode: shippingAddress?.postalCode,
      countryCodeAlpha2: shippingAddress?.countryCode,
    });

    const request = new DonationRequest({
      paymentProvider: PaymentProvider.PayPal,
      paymentMethodNonce: params.payload.nonce,
      amount: params.donationInfo.total,
      donationType: params.donationInfo.donationType,
      customer: customerInfo,
      billing: billingInfo,
      customFields: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        fee_amount_covered: params.donationInfo.feeAmountCovered,
      },
    });

    console.debug('buildDonationRequest, request', request);

    return request;
  }
}
