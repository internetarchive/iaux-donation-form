export class MockApplePayPayment implements ApplePayJS.ApplePayPayment {
  token: ApplePayJS.ApplePayPaymentToken = {
    paymentData: { some: 'data' },
    paymentMethod: {
      displayName: 'displayName-foo',
      network: 'network-bar',
      type: 'credit',
      paymentPass: {
        primaryAccountIdentifier: 'foo',
        primaryAccountNumberSuffix: 'bar',
        activationState: 'activated',
      },
    },
    transactionIdentifier: 'foo-transaction-id',
  };

  billingContact?: ApplePayJS.ApplePayPaymentContact | undefined = {
    emailAddress: 'foo@bar.com',
    familyName: 'McBarrison',
    givenName: 'Fooey',
    phoneNumber: '123-456-7890',
    addressLines: ['123 Fake St', 'Apt 123'],
    locality: 'San Francisco',
    administrativeArea: 'CA',
    postalCode: '12345',
    country: 'United States',
    countryCode: 'US',
  };

  shippingContact?: ApplePayJS.ApplePayPaymentContact | undefined = {
    emailAddress: 'foo@bar.com',
    familyName: 'McBarrison',
    givenName: 'Fooey',
    phoneNumber: '123-456-7890',
    addressLines: ['123 Fake St', 'Apt 123'],
    locality: 'San Francisco',
    administrativeArea: 'CA',
    postalCode: '12345',
    country: 'United States',
    countryCode: 'US',
  };
}
