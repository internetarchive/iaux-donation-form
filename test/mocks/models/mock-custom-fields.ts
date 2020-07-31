/* eslint-disable @typescript-eslint/camelcase */
import { DonationRequestCustomFields } from '../../../src/models/request-models/donation-request';

export const mockCustomFields = new DonationRequestCustomFields({
  logged_in_user: 'some-username',
  referrer: 'some-referrer',
  fee_amount_covered: 0.42
});
