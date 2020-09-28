// in order to add additional custom fields, you must add them to the braintree control panel
export class DonationRequestCustomFields {
  logged_in_user?: string;
  referrer?: string;
  fee_amount_covered?: number;

  /**
   * The origin is made up of campaign / ABTest information that the user originated from.
   *
   * The field is a string so can be expanded on,
   * but generally has the format `{Source}-{Test Name}-{Variant Name}`, ie
   * - `DonateBanner-Campaign Start 2020-IADefault`
   * - `Email-MidJuly2020-VariantA`
   *
   * For additional specificity, you could add additional info, ie.
   * `Email-MidJuly2020-VariantA-Button1`
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
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.logged_in_user = options?.logged_in_user;
    this.referrer = options?.referrer;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.fee_amount_covered = options?.fee_amount_covered;
    this.origin = options?.origin;
  }
}
