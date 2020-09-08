/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class MockGooglePaymentClient implements braintree.GooglePayment {
  async create(options: {
    client?: braintree.Client | undefined;
    authorization?: string | undefined;
    useDeferredClient?: boolean | undefined;
    googlePayVersion?: number | undefined;
    googleMerchantId?: string | undefined;
  }): Promise<braintree.GooglePayment> {
    return this;
  }

  async createPaymentDataRequest(
    overrides?:
      | {
          emailRequired?: boolean | undefined;
          merchantInfo?: { merchantId: string } | undefined;
          transactionInfo: { currencyCode: string; totalPriceStatus: string; totalPrice: string };
        }
      | undefined,
  ): Promise<google.payments.api.PaymentDataRequest> {
    throw new Error('Method not implemented.');
  }

  async parseResponse(response: any): Promise<braintree.GooglePaymentTokenizePayload> {
    return {
      nonce: 'foo-nonce',
      details: {
        cardType: 'foo-cardType',
        lastFour: '1234',
        lastTow: '34',
        isNetworkTokenized: false,
        bin: '1323',
      },
      description: 'foo-description',
      type: 'foo-type',
      binData: {
        commercial: 'Unknown',
        countryOfIssuance: 'Somehwere',
        debit: 'Unknown',
        durbinRegulated: 'Unknown',
        healthcare: 'Unknown',
        issuingBank: 'Unknown',
        payroll: 'Unknown',
        prepaid: 'Unknown',
        productId: 'foo',
      },
    };
  }
}
