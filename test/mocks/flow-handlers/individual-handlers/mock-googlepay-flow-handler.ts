import { GooglePayFlowHandlerInterface } from '../../../../src/payment-flow-handlers/handlers/googlepay-flow-handler';
import { DonationPaymentInfo } from '../../../../src/models/donation-info/donation-payment-info';

export class MockGooglePayFlowHandler implements GooglePayFlowHandlerInterface {
  paymentInitiatedDonationInfo?: DonationPaymentInfo;

  async paymentInitiated(donationInfo: DonationPaymentInfo): Promise<void> {
    this.paymentInitiatedDonationInfo = donationInfo;
  }
}
