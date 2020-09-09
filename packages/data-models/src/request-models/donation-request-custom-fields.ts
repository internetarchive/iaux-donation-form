// in order to add additional custom fields, you must add them to the braintree control panel
export class DonationRequestCustomFields {
  logged_in_user?: string;
  referrer?: string;
  fee_amount_covered?: number;

  constructor(options?: {
    logged_in_user?: string;
    referrer?: string;
    fee_amount_covered?: number;
  }) {
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.logged_in_user = options?.logged_in_user;
    this.referrer = options?.referrer;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.fee_amount_covered = options?.fee_amount_covered;
  }
}
