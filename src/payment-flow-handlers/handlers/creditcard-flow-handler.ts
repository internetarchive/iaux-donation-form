import { createNanoEvents, Emitter, Unsubscribe } from 'nanoevents';

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
  startup(): Promise<void>;
  paymentInitiated(
    donationInfo: DonationPaymentInfo,
    donorContactInfo: DonorContactInfo,
  ): Promise<void>;
  on<E extends keyof Events>(event: E, callback: Events[E]): Unsubscribe;
}

interface Events {
  validityChanged: (isValid: boolean) => void;
}

export class CreditCardFlowHandler implements CreditCardFlowHandlerInterface {
  private donationFlowModalManager: DonationFlowModalManagerInterface;

  private braintreeManager: BraintreeManagerInterface;

  private recaptchaManager: RecaptchaManagerInterface;

  private emitter: Emitter<Events>;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    donationFlowModalManager: DonationFlowModalManagerInterface;
    recaptchaManager: RecaptchaManagerInterface;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.donationFlowModalManager = options.donationFlowModalManager;
    this.recaptchaManager = options.recaptchaManager;
    this.emitter = createNanoEvents<Events>();
  }

  on<E extends keyof Events>(event: E, callback: Events[E]): Unsubscribe {
    return this.emitter.on(event, callback);
  }

  private started = false;

  async startup(): Promise<void> {
    console.debug('startup');

    if (this.started) {
      return;
    }
    this.started = true;

    const handler = await this.braintreeManager?.paymentProviders.getCreditCardHandler();
    const instance = await handler?.getInstance();

    // NOTE: The `focus` and `blur` callback logic must work in conjunction with
    // the `HostedFieldContainer` class. We use the `HostedFieldContainer` for
    // managing the hosted field error state in other parts of the form, but
    // since we can only get event callbacks from the hosted fields like this,
    // this has to operate independently and modify the CSS styles by itself
    instance?.on('focus', (event: braintree.HostedFieldsStateObject): void => {
      const { emittedBy, fields } = event;
      const fieldInFocus = fields[emittedBy];
      const { container } = fieldInFocus;
      container.parentElement?.classList.remove('error');
    });

    instance?.on('blur', (event: braintree.HostedFieldsStateObject): void => {
      const { emittedBy, fields } = event;
      const fieldInFocus = fields[emittedBy];
      const { container, isEmpty, isValid } = fieldInFocus;
      if (isEmpty || !isValid) {
        container.parentElement?.classList.add('error');
      }
    });

    instance?.on('validityChange', (event: braintree.HostedFieldsStateObject): void => {
      const { fields } = event;
      const isValid = fields.cvv.isValid && fields.expirationDate.isValid && fields.number.isValid;
      this.emitter.emit('validityChanged', isValid);
    });
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
      this.handleHostedFieldTokenizationError(error);
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

  private async handleHostedFieldTokenizationError(error: braintree.BraintreeError): Promise<void> {
    console.error('handleHostedFieldTokenizationError start', error);

    const handler = await this.braintreeManager.paymentProviders.getCreditCardHandler();

    console.error('handleHostedFieldTokenizationError handler', handler, error);

    switch (error.code) {
      case 'HOSTED_FIELDS_FIELDS_EMPTY':
        // occurs when none of the fields are filled in
        handler.markFieldErrors([
          HostedFieldName.Number,
          HostedFieldName.CVV,
          HostedFieldName.ExpirationDate,
        ]);
        break;
      case 'HOSTED_FIELDS_FIELDS_INVALID':
        // occurs when certain fields do not pass client side validation
        Object.keys(error.details.invalidFields).forEach(key => {
          handler.markFieldErrors([key as HostedFieldName]);
        });
        break;
      case 'HOSTED_FIELDS_TOKENIZATION_FAIL_ON_DUPLICATE':
        // occurs when:
        //   * the client token used for client authorization was generated
        //     with a customer ID and the fail on duplicate payment method
        //     option is set to true
        //   * the card being tokenized has previously been vaulted (with any customer)
        break;
      case 'HOSTED_FIELDS_TOKENIZATION_CVV_VERIFICATION_FAILED':
        // occurs when:
        //   * the client token used for client authorization was generated
        //     with a customer ID and the verify card option is set to true
        //     and you have credit card verification turned on in the Braintree
        //     control panel
        //   * the cvv does not pass verfication
        handler.markFieldErrors([HostedFieldName.CVV]);
        break;
      case 'HOSTED_FIELDS_FAILED_TOKENIZATION':
        // occurs for any other tokenization error on the server
        break;
      case 'HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR':
        // occurs when the Braintree gateway cannot be contacted
        break;
      default:
        // something else happened
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
