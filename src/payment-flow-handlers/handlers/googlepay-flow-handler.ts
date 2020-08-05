import { BraintreeManagerInterface } from '../../braintree-manager/braintree-interfaces';
import { DonationPaymentInfo } from '../../models/donation-info/donation-payment-info';
import { PaymentProvider } from '../../models/common/payment-provider-name';
import { DonationFlowModalManagerInterface } from '../donation-flow-modal-manager';
import { CustomerInfo } from '../../models/common/customer-info';
import { BillingInfo } from '../../models/common/billing-info';
import { Emitter, createNanoEvents, Unsubscribe } from 'nanoevents';

export interface GooglePayFlowHandlerInterface {
  paymentInitiated(donationInfo: DonationPaymentInfo): Promise<void>;
  on<E extends keyof GooglePayFlowHandlerEvents>(event: E, callback: GooglePayFlowHandlerEvents[E]): Unsubscribe;
}

export interface GooglePayFlowHandlerEvents {
  paymentCancelled: () => void;
}

export class GooglePayFlowHandler implements GooglePayFlowHandlerInterface {
  private donationFlowModalManager: DonationFlowModalManagerInterface;

  private braintreeManager: BraintreeManagerInterface;

  private emitter: Emitter<GooglePayFlowHandlerEvents> = createNanoEvents<GooglePayFlowHandlerEvents>();

  constructor(options: {
    braintreeManager: BraintreeManagerInterface;
    donationFlowModalManager: DonationFlowModalManagerInterface;
  }) {
    this.braintreeManager = options.braintreeManager;
    this.donationFlowModalManager = options.donationFlowModalManager;
  }

  on<E extends keyof GooglePayFlowHandlerEvents>(event: E, callback: GooglePayFlowHandlerEvents[E]): Unsubscribe {
    return this.emitter.on(event, callback);
  }

  // GooglePayFlowHandlerInterface conformance
  async paymentInitiated(donationInfo: DonationPaymentInfo): Promise<void> {
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

    try {
      const paymentData = await handler.paymentsClient.loadPaymentData(paymentDataRequest);
      const result: braintree.GooglePaymentTokenizePayload = await instance.parseResponse(
        paymentData,
      );

      const billingInfo = paymentData.paymentMethodData.info?.billingAddress;
      const name = billingInfo?.name;
      let firstName: string | undefined = name;
      let lastName: string | undefined = '';
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

      this.donationFlowModalManager.startDonationSubmissionFlow({
        nonce: result.nonce,
        paymentProvider: PaymentProvider.GooglePay,
        bin: result.details.bin,
        binName: result.binData.issuingBank,
        donationInfo: donationInfo,
        customerInfo: customer,
        billingInfo: billing,
      });
    } catch {
      this.emitter.emit('paymentCancelled');
      this.donationFlowModalManager.closeModal();
    }
  }
}
