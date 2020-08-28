import { VenmoFlowHandlerInterface } from '../../../../src/payment-flow-handlers/handlers/venmo-flow-handler';
import { DonorContactInfo, DonationPaymentInfo } from '@internetarchive/donation-form-data-models';

export class MockVenmoFlowHandler implements VenmoFlowHandlerInterface {
  startupCalled = false;

  paymentInitiatedDonationInfo?: DonationPaymentInfo;
  paymentInitiatedDonorInfo?: DonorContactInfo;

  async startup(): Promise<void> {
    this.startupCalled = true;
  }

  async paymentInitiated(
    contactInfo: DonorContactInfo,
    donationInfo: DonationPaymentInfo,
  ): Promise<void> {
    this.paymentInitiatedDonationInfo = donationInfo;
    this.paymentInitiatedDonorInfo = contactInfo;
  }
}
