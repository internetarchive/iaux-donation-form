import { createNanoEvents, Emitter, Unsubscribe } from 'nanoevents';

import { BraintreeManagerInterface } from '../../braintree-manager/braintree-interfaces';
import { RecaptchaManagerInterface } from '../../recaptcha-manager/recaptcha-manager';

import { DonorContactInfo } from '../../models/common/donor-contact-info';
import { DonationPaymentInfo } from '../../models/donation-info/donation-payment-info';
import { PaymentProvider } from '../../models/common/payment-provider-name';
import { DonationFlowModalManagerInterface } from '../donation-flow-modal-manager';
import { HostedFieldName } from '../../braintree-manager/payment-providers/credit-card/hosted-field-container';
import { BadgedInput } from '../../form-elements/badged-input';
import { SuccessResponse } from '../../models/response-models/success-models/success-response';

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
    if (this.started) {
      return;
    }
    this.started = true;

    const handler = await this.braintreeManager?.paymentProviders.creditCardHandler.get();
    const instance = await handler?.instance.get();

    // NOTE: The `focus` and `blur` callback logic must work in conjunction with
    // the `HostedFieldContainer` class. We use the `HostedFieldContainer` for
    // managing the hosted field error state in other parts of the form, but
    // since we can only get event callbacks from the hosted fields like this,
    // this has to operate independently and modify the CSS styles by itself
    instance?.on('focus', (event: braintree.HostedFieldsStateObject): void => {
      const { emittedBy, fields } = event;
      const fieldInFocus = fields[emittedBy];
      const { container } = fieldInFocus;
      (container.parentElement as BadgedInput).error = false;
      handler.hideErrorMessage();
    });

    instance?.on('blur', (event: braintree.HostedFieldsStateObject): void => {
      const { emittedBy, fields } = event;
      const fieldInFocus = fields[emittedBy];
      const { container, isEmpty, isValid } = fieldInFocus;
      if (isEmpty || !isValid) {
        (container.parentElement as BadgedInput).error = true;
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

    const handler = await this.braintreeManager.paymentProviders.creditCardHandler.get();

    try {
      hostedFieldsResponse = await handler?.tokenizeHostedFields();
    } catch (error) {
      this.handleHostedFieldTokenizationError(error);
      return;
    }

    if (!hostedFieldsResponse) {
      this.donationFlowModalManager.showErrorModal({
        message: 'Error getting credit card response',
      });
      return;
    }

    let recaptchaToken: string | undefined;

    try {
      recaptchaToken = await this.recaptchaManager.execute();
    } catch (error) {
      this.donationFlowModalManager.showErrorModal({
        message: `Recaptcha failure: ${error}`,
      });
      return;
    }

    try {
      this.donationFlowModalManager.showProcessingModal();

      const response = await this.braintreeManager.submitDonation({
        nonce: hostedFieldsResponse.nonce,
        paymentProvider: PaymentProvider.CreditCard,
        recaptchaToken: recaptchaToken,
        bin: hostedFieldsResponse.details.bin,
        donationInfo: donationInfo,
        customerInfo: donorContactInfo.customer,
        billingInfo: donorContactInfo.billing,
      });

      if (response.success) {
        this.donationFlowModalManager.handleSuccessfulDonationResponse(
          donationInfo,
          response.value as SuccessResponse,
        );
      } else {
        this.donationFlowModalManager.closeModal();
        handler.showErrorMessage();
      }
    } catch (error) {
      this.donationFlowModalManager.showErrorModal({
        message: `Error setting up donation: ${error}`,
      });
    }
  }

  private async handleHostedFieldTokenizationError(error: braintree.BraintreeError): Promise<void> {
    const handler = await this.braintreeManager.paymentProviders.creditCardHandler.get();

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
}
