export const mockHostedFieldTokenizePayload = {
  nonce: 'foo-nonce',
  details: {
    bin: '1234',
    cardType: 'UNO',
    expirationMonth: '12',
    expirationYear: '12',
    lastTwo: '32',
    lastFour: '4342',
  },
  type: 'foo-type',
  description: 'bar-description',
} as braintree.HostedFieldsTokenizePayload;
