export class BillingInfo {
  firstName?: string;
  lastName?: string;
  streetAddress?: string;
  extendedAddress?: string;
  locality?: string;
  region?: string;
  postalCode?: string;
  countryCodeAlpha2?: string;

  constructor(params?: {
    firstName?: string;
    lastName?: string;
    streetAddress?: string;
    extendedAddress?: string;
    locality?: string;
    region?: string;
    postalCode?: string;
    countryCodeAlpha2?: string;
  }) {
    this.firstName = params?.firstName;
    this.lastName = params?.lastName;
    this.streetAddress = params?.streetAddress;
    this.extendedAddress = params?.extendedAddress;
    this.locality = params?.locality;
    this.region = params?.region;
    this.postalCode = params?.postalCode;
    this.countryCodeAlpha2 = params?.countryCodeAlpha2;
  }
}
