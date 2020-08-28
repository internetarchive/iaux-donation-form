import { DonationType, DonationPaymentInfo } from '@internetarchive/donation-form-data-models';

export class MockDonationInfo extends DonationPaymentInfo {
  constructor() {
    super({
      donationType: DonationType.OneTime,
      amount: 5,
      coverFees: false,
    });
  }
}
