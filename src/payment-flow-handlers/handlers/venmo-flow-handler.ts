import { BraintreeManagerInterface } from '../../braintree-manager/braintree-interfaces';
import { DonorContactInfo } from '../../models/common/donor-contact-info';
import { DonationPaymentInfo } from '../../models/donation-info/donation-payment-info';
import { PaymentProvider } from '../../models/common/payment-provider-name';
import {
  VenmoRestorationStateHandlerInterface,
  VenmoRestorationStateHandler,
} from './venmo-restoration-state-handler';
import { DonationFlowModalManagerInterface } from '../donation-flow-modal-manager';

export interface VenmoFlowHandlerInterface {
  startup(): Promise<void>;
  paymentInitiated(contactInfo: DonorContactInfo, donationInfo: DonationPaymentInfo): Promise<void>;
}

export class VenmoFlowHandler implements VenmoFlowHandlerInterface {
  private donationFlowModalManager: DonationFlowModalManagerInterface;

  private braintreeManager: BraintreeManagerInterface;

  private restorationStateHandler: VenmoRestorationStateHandlerInterface;

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    donationFlowModalManager: DonationFlowModalManagerInterface;
    restorationStateHandler?: VenmoRestorationStateHandlerInterface;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.donationFlowModalManager = options.donationFlowModalManager;
    this.restorationStateHandler =
      options.restorationStateHandler ?? new VenmoRestorationStateHandler();
  }

  /**
   * Check if we have any results from Venmo on startup.
   *
   * This happens if the app redirects to us in a new tab so we can resume the session.
   *
   * @returns {Promise<void>}
   * @memberof VenmoFlowHandler
   */
  async startup(): Promise<void> {
    console.debug('Venmo startup');
    const handler = await this.braintreeManager.paymentProviders.venmoHandler.get();
    const instance = await handler?.instance.get();
    if (instance?.hasTokenizationResult()) {
      console.debug('Venmo startup, has tokenization results');

      // if we get redirected back from venmo in a different tab, we need to restore the data
      // that was persisted when the payment was initiated
      const restoredInfo = await this.restorationStateHandler.getRestorationState();
      if (restoredInfo) {
        this.paymentInitiated(restoredInfo.contactInfo, restoredInfo.donationInfo);
      } else {
        console.error('no restoration info');
        this.donationFlowModalManager.showErrorModal({
          message: 'Error restoring donation session',
        });
      }
    }
  }

  // VenmoFlowHandlerInterface conformance
  async paymentInitiated(
    contactInfo: DonorContactInfo,
    donationInfo: DonationPaymentInfo,
  ): Promise<void> {
    // if we get redirected back from venmo in a different tab, we need to restore the data
    // that was persisted when the payment was initiated so persist it here
    this.restorationStateHandler.persistState(contactInfo, donationInfo);

    try {
      const handler = await this.braintreeManager.paymentProviders.venmoHandler.get();
      const result = await handler?.startPayment();
      if (!result) {
        this.restorationStateHandler.clearState();
        this.donationFlowModalManager.showErrorModal({
          message: 'Error setting up the donation',
        });
        return;
      }
      console.debug('paymentInitiated', result);
      this.handleTokenizationResult(result, contactInfo, donationInfo);
    } catch (tokenizeError) {
      this.restorationStateHandler.clearState();
      this.handleTokenizationError(tokenizeError);
      this.donationFlowModalManager.showErrorModal({
        message: `Error loading donation information: ${tokenizeError}`,
      });
    }
  }

  private async handleTokenizationResult(
    payload: braintree.VenmoTokenizePayload,
    contactInfo: DonorContactInfo,
    donationInfo: DonationPaymentInfo,
  ): Promise<void> {
    this.restorationStateHandler.clearState();

    this.donationFlowModalManager.startDonationSubmissionFlow({
      nonce: payload.nonce,
      paymentProvider: PaymentProvider.Venmo,
      donationInfo: donationInfo,
      customerInfo: contactInfo.customer,
      billingInfo: contactInfo.billing,
    });
  }

  private handleTokenizationError(tokenizeError: braintree.BraintreeError): void {
    console.debug('tokenizeError', tokenizeError);
    // Handle flow errors or premature flow closure
    switch (tokenizeError.code) {
      case 'VENMO_APP_CANCELED':
        console.log('User canceled Venmo flow.');
        break;
      case 'VENMO_CANCELED':
        console.log('User canceled Venmo, or Venmo app is not available.');
        break;
      default:
        console.error('Error!', tokenizeError);
    }
    // alert(`Tokenization Error: ${tokenizeError.code}`);
  }
}
