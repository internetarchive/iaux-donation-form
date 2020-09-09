export class BillingInfo {
  streetAddress?: string;
  extendedAddress?: string;
  locality?: string;
  region?: string;
  postalCode?: string;
  countryCodeAlpha2?: string;

  constructor(params?: {
    streetAddress?: string;
    extendedAddress?: string;
    locality?: string;
    region?: string;
    postalCode?: string;
    countryCodeAlpha2?: string;
  }) {
    this.streetAddress = params?.streetAddress;
    this.extendedAddress = params?.extendedAddress;
    this.locality = params?.locality;
    this.region = params?.region;
    this.postalCode = params?.postalCode;
    this.countryCodeAlpha2 = params?.countryCodeAlpha2;
  }
}
