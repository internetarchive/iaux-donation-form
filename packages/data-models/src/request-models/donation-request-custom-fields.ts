/* eslint-disable @typescript-eslint/camelcase */
// in order to add additional custom fields, you must add them to the braintree control panel
export class DonationRequestCustomFields {
  logged_in_user?: string;
  referrer?: string;
  fee_amount_covered?: number;

  /**
   * The origin is made up of campaign / ABTest information that the user originated from.
   *
   * The field is a freeform string so it can be anything, but make sure it's something
   * identifiable so it can be queried in CiviCRM.
   *
   * For instance, we use this format for the Donation Banner:
   * - `{Source}-{Test Name}-{Variant Name}`, eg:
   * - `DonateBanner-Campaign Start 2020-IADefault`
   * - `DonateBanner-Mid Campaign-IAThermometer`
   *
   * For additional specificity, you could add additional info, ie.
   * - `DonateBanner-MidJuly2020 Campaign-VariantA-Button1`
   *
   * @type {string}
   * @memberof DonationRequestCustomFields
   */
  origin?: string;

  constructor(options?: {
    logged_in_user?: string;
    referrer?: string;
    fee_amount_covered?: number;
    origin?: string;
  }) {
    this.logged_in_user = options?.logged_in_user;
    this.referrer = options?.referrer;
    this.fee_amount_covered = options?.fee_amount_covered;
    this.origin = options?.origin;
  }
}
