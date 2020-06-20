/// <reference types="braintree-web" />

declare namespace braintree {
  export type GooglePaymentTokenizeValues = 'Yes' | 'No' | 'Unknown';

  /**
   * @typedef {object} GooglePayment~tokenizePayload
   * @property {string} nonce The payment method nonce.
   * @property {object} details Additional account details.
   * @property {string} details.cardType Type of card, ex: Visa, MasterCard.
   * @property {string} details.lastFour Last four digits of card number.
   * @property {string} details.lastTwo Last two digits of card number.
   * @property {boolean} details.isNetworkTokenized True if the card is network tokenized.
   * @property {string} details.bin First six digits of card number.
   * @property {string} description A human-readable description.
   * @property {string} type The payment method type, `CreditCard` or `AndroidPayCard`.
   * @property {object} binData Information about the card based on the bin.
   * @property {string} binData.commercial Possible values: 'Yes', 'No', 'Unknown'.
   * @property {string} binData.countryOfIssuance The country of issuance.
   * @property {string} binData.debit Possible values: 'Yes', 'No', 'Unknown'.
   * @property {string} binData.durbinRegulated Possible values: 'Yes', 'No', 'Unknown'.
   * @property {string} binData.healthcare Possible values: 'Yes', 'No', 'Unknown'.
   * @property {string} binData.issuingBank The issuing bank.
   * @property {string} binData.payroll Possible values: 'Yes', 'No', 'Unknown'.
   * @property {string} binData.prepaid Possible values: 'Yes', 'No', 'Unknown'.
   * @property {string} binData.productId The product id.
   */
  export interface GooglePaymentTokenizePayload {
    nonce: string;
    details: {
      cardType: string;
      lastFour: string;
      lastTow: string;
      isNetworkTokenized: boolean;
      bin: string;
    };
    description: string;
    type: string;
    binData: {
      commercial: GooglePaymentTokenizeValues;
      countryOfIssuance: string;
      debit: GooglePaymentTokenizeValues;
      durbinRegulated: GooglePaymentTokenizeValues;
      healthcare: GooglePaymentTokenizeValues;
      issuingBank: GooglePaymentTokenizeValues;
      payroll: GooglePaymentTokenizeValues;
      prepaid: GooglePaymentTokenizeValues;
      productId: string;
    };
  }

  export interface GooglePayment {
    /**
     * @static
     * @function create
     * @param {object} options Creation options:
     * @param {Client} [options.client] A {@link Client} instance.
     * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
     * @param {boolean} [options.useDeferredClient] Used in conjunction with `authorization`, allows the Google Payment instance to be available right away by fetching the client configuration in the background. When this option is used, {@link GooglePayment#createPaymentDataRequest} will return a promise that resolves with the configuration instead of returning synchronously.
     * @param {number} [options.googlePayVersion] The version of the Google Pay API to use. Value of 2 is required to accept parameters documented [by Google](https://developers.google.com/pay/api/web/reference/object). Omit this parameter to use the deprecated Google Pay Version 1.
     * @param {string} [options.googleMerchantId] A Google merchant identifier issued after your website is approved by Google. Required when PaymentsClient is initialized with an environment property of PRODUCTION, but may be omitted in TEST environment.
     * @param {callback} [callback] The second argument, `data`, is the {@link GooglePayment} instance. If no callback is provided, `create` returns a promise that resolves with the {@link GooglePayment} instance.
     * @example <caption>Simple Example</caption>
     * // include https://pay.google.com/gp/p/js/pay.js in a script tag
     * // on your page to load the `google.payments.api.PaymentsClient` global object.
     *
     * var paymentButton = document.querySelector('#google-pay-button');
     * var paymentsClient = new google.payments.api.PaymentsClient({
     *   environment: 'TEST' // or 'PRODUCTION'
     * });
     *
     * braintree.client.create({
     *   authorization: 'tokenization-key-or-client-token'
     * }).then(function (clientInstance) {
     *   return braintree.googlePayment.create({
     *     client: clientInstance,
    *      googlePayVersion: 2,
    *      googleMerchantId: 'your-merchant-id-from-google'
    *   });
    * }).then(function (googlePaymentInstance) {
    *   paymentButton.addEventListener('click', function (event) {
    *     var paymentDataRequest;
    *
    *     event.preventDefault();
    *
    *     paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
    *       transactionInfo: {
    *         currencyCode: 'USD',
    *         totalPriceStatus: 'FINAL',
    *         totalPrice: '100.00'
    *       }
    *     });
    *
    *     paymentsClient.loadPaymentData(paymentDataRequest).then(function (paymentData) {
    *       return googlePaymentInstance.parseResponse(paymentData);
    *     }).then(function (result) {
    *       // send result.nonce to your server
    *     }).catch(function (err) {
    *       // handle err
    *     });
    *   });
    * });
    * @example <caption>Check Browser and Customer Compatibility</caption>
    * var paymentsClient = new google.payments.api.PaymentsClient({
    *   environment: 'TEST' // or 'PRODUCTION'
    * });
    *
    * function setupGooglePayButton(googlePaymentInstance) {
    *   var button = document.createElement('button');
    *
    *   button.id = 'google-pay';
    *   button.appendChild(document.createTextNode('Google Pay'));
    *   button.addEventListener('click', function (event) {
    *     var paymentRequestData;
    *
    *     event.preventDefault();
    *
    *     paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
    *       transactionInfo: {
    *         currencyCode: 'USD',
    *         totalPriceStatus: 'FINAL',
    *         totalPrice: '100.00' // your amount
    *       }
    *     });
    *
    *     paymentsClient.loadPaymentData(paymentDataRequest).then(function (paymentData) {
    *       return googlePaymentInstance.parseResponse(paymentData);
    *       }).then(function (result) {
    *       // send result.nonce to your server
    *     }).catch(function (err) {
    *       // handle errors
    *     });
    *   });
    *
    *   document.getElementById('container').appendChild(button);
    * }
    *
    * braintree.client.create({
    *   authorization: 'tokenization-key-or-client-token'
    * }).then(function (clientInstance) {
    *   return braintree.googlePayment.create({
    *     client: clientInstance,
    *     googlePayVersion: 2,
    *     googleMerchantId: 'your-merchant-id-from-google'
    *   });
    * }).then(function (googlePaymentInstance) {
    *
    *   return paymentsClient.isReadyToPay({
    *     // see https://developers.google.com/pay/api/web/reference/object#IsReadyToPayRequest for all options
    *     apiVersion: 2,
    *     apiVersionMinor: 0,
    *     allowedPaymentMethods: googlePaymentInstance.createPaymentDataRequest().allowedPaymentMethods,
    *     existingPaymentMethodRequired: true
    *   });
    * }).then(function (response) {
    *   if (response.result) {
    *     setupGooglePayButton(googlePaymentInstance);
    *   }
    * }).catch(function (err) {
    *   // handle setup errors
    * });
    *
    * @returns {(Promise|void)} Returns a promise if no callback is provided.
    */
    create(options: { client?: Client; authorization?: string; useDeferredClient?: boolean; googlePayVersion?: number; googleMerchantId?: string }): Promise<Venmo>;
    create(options: { client?: Client; authorization?: string; useDeferredClient?: boolean; googlePayVersion?: number; googleMerchantId?: string }, callback?: callback): void;

    /**
     * Create a configuration object for use in the `loadPaymentData` method.
     *
     * **Note**: Version 1 of the Google Pay Api is deprecated and will become unsupported in a future version. Until then, version 1 will continue to be used by default, and version 1 schema parameters and overrides will remain functional on existing integrations. However, new integrations and all following examples will be presented in the GooglePay version 2 schema. See [Google Pay's upgrade guide](https://developers.google.com/pay/api/web/guides/resources/update-to-latest-version) to see how to update your integration.
     *
     * If `options.googlePayVersion === 2` was set during the initial {@link module:braintree-web/google-payment.create|create} call, overrides must match the Google Pay v2 schema to be valid.
     *
     * @public
     * @param {object} overrides The supplied parameters for creating the PaymentDataRequest object. Required parameters are:
     *  @param {object} overrides.transactionInfo Object according to the [Google Pay Transaction Info](https://developers.google.com/pay/api/web/reference/object#TransactionInfo) spec.
     *  Optionally, any of the parameters in the [PaymentDataRequest](https://developers.google.com/pay/api/web/reference/object#PaymentDataRequest) parameters can be overridden, but note that it is recommended only to override top level parameters to avoid squashing deeply nested configuration objects. An example can be found below showing how to safely edit these deeply nested objects.
     * @example
     * var paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
     *   merchantInfo: {
     *     merchantId: 'my-merchant-id-from-google'
     *   },
     *   transactionInfo: {
     *     currencyCode: 'USD',
     *     totalPriceStatus: 'FINAL',
     *     totalPrice: '100.00'
     *   }
     * });
     *
     * // Update card payment methods to require billing address
     * var cardPaymentMethod = paymentDataRequest.allowedPaymentMethods;
     * cardPaymentMethod.parameters.billingAddressRequired = true;
     * cardPaymentMethod.parameters.billingAddressParameters = {
     *   format: 'FULL',
     *   phoneNumberRequired: true
     * };
     *
     * var paymentsClient = new google.payments.api.PaymentsClient({
     *   environment: 'TEST' // or 'PRODUCTION'
     * })
     *
     * paymentsClient.loadPaymentData(paymentDataRequest).then(function (response) {
     *   // handle response with googlePaymentInstance.parseResponse
     *   // (see below)
     * });
     * @example <caption>With deferred client</caption>
     * googlePaymentInstance.createPaymentDataRequest({
     *   merchantInfo: {
     *     merchantId: 'my-merchant-id-from-google'
     *   },
     *   transactionInfo: {
     *     currencyCode: 'USD',
     *     totalPriceStatus: 'FINAL',
     *     totalPrice: '100.00'
     *   }
     * }).then(function (paymentDataRequest) {
     *   // Update card payment methods to require billing address
     *   var cardPaymentMethod = paymentDataRequest.allowedPaymentMethods;
     *   cardPaymentMethod.parameters.billingAddressRequired = true;
     *   cardPaymentMethod.parameters.billingAddressParameters = {
     *     format: 'FULL',
     *     phoneNumberRequired: true
     *   };
     *
     *   var paymentsClient = new google.payments.api.PaymentsClient({
     *     environment: 'TEST' // or 'PRODUCTION'
     *   })
     *
     *   return paymentsClient.loadPaymentData(paymentDataRequest);
     * }).then(function (response) {
     *   // handle response with googlePaymentInstance.parseResponse
     *   // (see below)
     * });
     * @returns {object|Promise} Returns a configuration object for Google PaymentDataRequest. If instantiated with `useDeferredClient` and an `authorization` it will return a promise that resolves with the configuration.
     */
    createPaymentDataRequest(overrides?: {
      emailRequired?: boolean;
      merchantInfo?: {
        merchantId: string;
      };
      transactionInfo: {
        currencyCode: string;
        totalPriceStatus: string;
        totalPrice: string;
      };
    }): Promise<google.payments.api.PaymentDataRequest>;

    /**
     * Parse the response from the tokenization.
     * @public
     * @param {object} response The response back from the Google Pay tokenization.
     * @param {callback} [callback] The second argument, <code>data</code>, is a {@link GooglePay~tokenizePayload|tokenizePayload}. If no callback is provided, `parseResponse` returns a promise that resolves with a {@link GooglePayment~tokenizePayload|tokenizePayload}.
     * @example with callback
     * var paymentsClient = new google.payments.api.PaymentsClient({
     *   environment: 'TEST' // or 'PRODUCTION'
     * })
     *
     * paymentsClient.loadPaymentData(paymentDataRequestFromCreatePaymentDataRequest).then(function (response) {
     *   googlePaymentInstance.parseResponse(response, function (err, data) {
     *     if (err) {
     *       // handle errors
     *     }
     *     // send parsedResponse.nonce to your server
     *   });
     * });
     * @example with promise
     * var paymentsClient = new google.payments.api.PaymentsClient({
     *   environment: 'TEST' // or 'PRODUCTION'
     * })
     *
     * paymentsClient.loadPaymentData(paymentDataRequestFromCreatePaymentDataRequest).then(function (response) {
     *   return googlePaymentInstance.parseResponse(response);
     * }).then(function (parsedResponse) {
     *   // send parsedResponse.nonce to your server
     * }).catch(function (err) {
     *   // handle errors
     * });
     * @returns {(Promise|void)} Returns a promise that resolves the parsed response if no callback is provided.
     */
    parseResponse(response: any): Promise<GooglePaymentTokenizePayload>;
    parseResponse(response: any, callback?: callback): void;
  }
}

declare namespace braintree {
  interface VenmoTokenizePayload {
    nonce: string;
    type: string;
    details: { username: string };
  }

  export interface Venmo {
    /**
     * @static
     * @function create
     * @param {object} options Creation options:
     * @param {Client} [options.client] A {@link Client} instance.
     * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
     * @param {boolean} [options.allowNewBrowserTab=true] This should be set to false if your payment flow requires returning to the same tab, e.g. single page applications. Doing so causes {@link Venmo#isBrowserSupported|isBrowserSupported} to return true only for mobile web browsers that support returning from the Venmo app to the same tab.
     * @param {boolean} [options.ignoreHistoryChanges=false] When the Venmo app returns to the website, it will modify the hash of the url to include data about the tokenization. By default, the SDK will put the state of the hash back to where it was before the change was made. Pass `true` to handle the hash change instead of the SDK.
     * @param {string} [options.profileId] The Venmo profile ID to be used during payment authorization. Customers will see the business name and logo associated with this Venmo profile, and it will show up in the Venmo app as a "Connected Merchant". Venmo profile IDs can be found in the Braintree Control Panel. Omitting this value will use the default Venmo profile.
     * @param {string} [options.deepLinkReturnUrl] An override for the URL that the Venmo iOS app opens to return from an app switch.
     * @param {callback} [callback] The second argument, `data`, is the {@link Venmo} instance. If no callback is provided, `create` returns a promise that resolves with the {@link Venmo} instance.
     * @example
     * braintree.venmo.create({
     *   client: clientInstance
     * }).then(function (venmoInstance) {
     *   // venmoInstance is ready to be used.
     * }).catch(function (createErr) {
     *   console.error('Error creating Venmo instance', createErr);
     * });
     * @returns {(Promise|void)} Returns the Venmo instance.
     */
    create(options: { client?: Client; authorization?: string; allowNewBrowserTab?: boolean; ignoreHistoryChanges?: boolean; profileId?: string; deepLinkReturnUrl?: string }): Promise<Venmo>;
    create(options: { client?: Client; authorization?: string; allowNewBrowserTab?: boolean; ignoreHistoryChanges?: boolean; profileId?: string; deepLinkReturnUrl?: string }, callback?: callback): void;

    /**
     * @description The current version of the SDK, i.e. `3.0.2`.
     * @type {string}
     */
    VERSION: string;

    /**
     * Returns a boolean indicating whether the current browser supports Venmo as a payment method.
     *
     * If `options.allowNewBrowserTab` is false when calling {@link module:braintree-web/venmo.create|venmo.create}, this method will return true only for browsers known to support returning from the Venmo app to the same browser tab. Currently, this is limited to iOS Safari and Android Chrome.
     * @public
     * @returns {boolean} True if the current browser is supported, false if not.
     */
    isBrowserSupported(): boolean;

    /**
     * Returns a boolean indicating whether a Venmo tokenization result is ready to be processed immediately.
     *
     * This method should be called after initialization to see if the result of Venmo authorization is available. If it returns true, call {@link Venmo#tokenize|tokenize} immediately to process the results.
     *
     * @public
     * @returns {boolean} True if the results of Venmo payment authorization are available and ready to process.
     */
    hasTokenizationResult(): boolean;

    /**
     * Launches the Venmo flow and returns a nonce payload.
     *
     * If {@link Venmo#hasTokenizationResult|hasTokenizationResult} returns true, calling tokenize will immediately process and return the results without initiating the Venmo payment authorization flow.
     *
     * Only one Venmo flow can be active at a time. One way to achieve this is to disable your Venmo button while the flow is open.
     * @public
     * @param {object} [options] Options for tokenization.
     * @param {number} [options.processResultsDelay=500] The amount of time in milliseeconds to delay processing the results. In most cases, this value should be left as the default.
     * @param {callback} [callback] The second argument, <code>data</code>, is a {@link Venmo~tokenizePayload|tokenizePayload}. If no callback is provided, the method will return a Promise that resolves with a {@link Venmo~tokenizePayload|tokenizePayload}.
     * @returns {(Promise|void)} Returns a promise if no callback is provided.
     * @example
     * button.addEventListener('click', function () {
     *   // Disable the button so that we don't attempt to open multiple popups.
     *   button.setAttribute('disabled', 'disabled');
     *
     *   // Because tokenize opens a new window, this must be called
     *   // as a result of a user action, such as a button click.
     *   venmoInstance.tokenize().then(function (payload) {
     *     // Submit payload.nonce to your server
     *     // Use payload.username to get the Venmo username and display any UI
     *   }).catch(function (tokenizeError) {
     *     // Handle flow errors or premature flow closure
     *     switch (tokenizeErr.code) {
     *       case 'VENMO_APP_CANCELED':
     *         console.log('User canceled Venmo flow.');
     *         break;
     *       case 'VENMO_CANCELED':
     *         console.log('User canceled Venmo, or Venmo app is not available.');
     *         break;
     *       default:
     *         console.error('Error!', tokenizeErr);
     *     }
     *   }).then(function () {
     *     button.removeAttribute('disabled');
     *   });
     * });
     */
    tokenize(options?: { processResultsDelay?: number }): Promise<VenmoTokenizePayload>;
    tokenize(options?: { processResultsDelay?: number }, callback?: (error?: BraintreeError, payload?: VenmoTokenizePayload) => void): void;

    /**
     * Cleanly tear down anything set up by {@link module:braintree-web/venmo.create|create}.
     * @public
     * @param {callback} [callback] Called once teardown is complete. No data is returned if teardown completes successfully.
     * @example
     * venmoInstance.teardown();
     * @example <caption>With callback</caption>
     * venmoInstance.teardown(function () {
     *   // teardown is complete
     * });
     * @returns {(Promise|void)} Returns a promise if no callback is provided.
     */
    teardown(callback?: () => void): void;
    teardown(): Promise<void>;
  }
}

declare namespace braintree {
  enum PayPalCheckoutLineItemKind {
    Debit = 'debit',
    Credit = 'credit'
  }

  interface PayPalCheckoutLineItem {
    /**
     * Number of units of the item purchased. This value must be a whole number and can't be negative or zero.
     *
     * @type {string}
     * @memberof PayPalCheckoutLineItem
     */
    quantity: string;

    /**
     * Per-unit price of the item. Can include up to 2 decimal places. This value can't be negative or zero.
     *
     * @type {string}
     * @memberof PayPalCheckoutLineItem
     */
    unitAmount: string;

    /**
     * Item name. Maximum 127 characters.
     *
     * @type {string}
     * @memberof PayPalCheckoutLineItem
     */
    name: string;

    /**
     * Indicates whether the line item is a debit (sale) or credit (refund) to the customer. Accepted values: `debit` and `credit`.
     *
     * @type {PayPalCheckoutLineItemKind}
     * @memberof PayPalCheckoutLineItem
     */
    kind: PayPalCheckoutLineItemKind;

    /**
     * Per-unit tax price of the item. Can include up to 2 decimal places. This value can't be negative or zero.
     *
     * @type {(string | undefined)}
     * @memberof PayPalCheckoutLineItem
     */
    unitTaxAmount: string | undefined;

    /**
     * Item description. Maximum 127 characters.
     *
     * @type {(string | undefined)}
     * @memberof PayPalCheckoutLineItem
     */
    description: string | undefined;

    /**
     * Product or UPC code for the item. Maximum 127 characters.
     *
     * @type {(string | undefined)}
     * @memberof PayPalCheckoutLineItem
     */
    productCode: string | undefined;

    /**
     * The URL to product information.
     *
     * @type {(string | undefined)}
     * @memberof PayPalCheckoutLineItem
     */
    url: string | undefined;
  }

  enum PayPalCheckoutShippingOptionType {
    /**
     * The payer intends to receive the items at a specified address.
     */
    Shipping = 'SHIPPING',

    /**
     * The payer intends to pick up the items at a specified address. For example, a store address.
     */
    Pickup = 'PICKUP'
  }

  interface PayPalCheckoutCurrencyAmount {
    /**
     * The three-character ISO-4217 currency code. PayPal does not support all currencies.
     *
     * @type {string}
     * @memberof PayPalCheckoutShippingOptionAmount
     */
    currency: string;

    /**
     * The amount the shipping option will cost. Includes the specified number of digits after decimal separator for the ISO-4217 currency code.
     *
     * @type {string}
     * @memberof PayPalCheckoutShippingOptionAmount
     */
    value: string;
  }

  interface PayPalCheckoutShippingOption {
    /**
     * A unique ID that identifies a payer-selected shipping option.
     *
     * @type {string}
     * @memberof PayPalCheckoutShippingOption
     */
    id: string;

    /**
     * A description that the payer sees, which helps them choose an appropriate shipping option. For example, `Free Shipping`, `USPS Priority Shipping`, `Expédition prioritaire USPS`, or `USPS yōuxiān fā huò`. Localize this description to the payer's locale.
     *
     * @type {string}
     * @memberof PayPalCheckoutShippingOption
     */
    label: string;

    /**
     * If `selected = true` is specified as part of the API request it represents the shipping option that the payee/merchant expects to be pre-selected for the payer when they first view the shipping options within the PayPal checkout experience. As part of the response if a shipping option has `selected = true` it represents the shipping option that the payer selected during the course of checkout with PayPal. Only 1 `shippingOption` can be set to `selected = true`.
     *
     * @type {boolean}
     * @memberof PayPalCheckoutShippingOption
     */
    selected: boolean;

    /**
     * The method by which the payer wants to get their items.
     *
     * @type {PayPalCheckoutShippingOptionType}
     * @memberof PayPalCheckoutShippingOption
     */
    type: PayPalCheckoutShippingOptionType;

    /**
     * The shipping cost for the selected option.
     *
     * @type {PayPalCheckoutCurrencyAmount}
     * @memberof PayPalCheckoutShippingOption
     */
    amount: PayPalCheckoutCurrencyAmount;
  }

  interface PayPalCheckoutAddress {
    /**
     * Street number and name.
     *
     * @type {string}
     * @memberof PayPalCheckoutAddress
     */
    line1: string;

    /**
     * Extended address.
     *
     * @type {string}
     * @memberof PayPalCheckoutAddress
     */
    line2?: string;

    /**
     * City or locality.
     *
     * @type {string}
     * @memberof PayPalCheckoutAddress
     */
    city: string;

    /**
     * State or region.
     *
     * @type {string}
     * @memberof PayPalCheckoutAddress
     */
    state: string;

    /**
     * Postal code.
     *
     * @type {string}
     * @memberof PayPalCheckoutAddress
     */
    postalCode: string;

    /**
     * 2 character country code (e.g. US).
     *
     * @type {string}
     * @memberof PayPalCheckoutAddress
     */
    countryCode: string;

    /**
     * Phone number.
     *
     * @type {string}
     * @memberof PayPalCheckoutAddress
     */
    phone?: string;

    /**
     * Recipient of postage.
     *
     * @type {string}
     * @memberof PayPalCheckoutAddress
     */
    recipientName?: string;
  }

  interface PayPalCheckoutCreditFinancingOptions {
    /**
     * This is the estimated total payment amount including interest and fees the user will pay during the lifetime of the loan.
     *
     * @type {PayPalCheckoutCurrencyAmount}
     * @memberof PayPalCheckoutCreditFinancingOptions
     */
    totalCost: PayPalCheckoutCurrencyAmount;

    /**
     * Length of financing terms in months.
     *
     * @type {number}
     * @memberof PayPalCheckoutCreditFinancingOptions
     */
    term: number;

    /**
     * This is the estimated amount per month that the customer will need to pay including fees and interest.
     *
     * @type {PayPalCheckoutCurrencyAmount}
     * @memberof PayPalCheckoutCreditFinancingOptions
     */
    monthlyPayment: PayPalCheckoutCurrencyAmount;

    /**
     * Estimated interest or fees amount the payer will have to pay during the lifetime of the loan.
     *
     * @type {PayPalCheckoutCurrencyAmount}
     * @memberof PayPalCheckoutCreditFinancingOptions
     */
    totalInterest: PayPalCheckoutCurrencyAmount;

    /**
     * Status of whether the customer ultimately was approved for and chose to make the payment using the approved installment credit.
     *
     * @type {boolean}
     * @memberof PayPalCheckoutCreditFinancingOptions
     */
    payerAcceptance: boolean;

    /**
     * Indicates whether the cart amount is editable after payer's acceptance on PayPal side.
     *
     * @type {boolean}
     * @memberof PayPalCheckoutCreditFinancingOptions
     */
    cartAmountImmutable: boolean;
  }

  export interface PayPalCheckoutTokenizePayloadDetails {
    email: string;
    payerId: string;
    firstName: string;
    lastName: string;
    countryCode?: string;
    phone?: string;

    /**
     * User's shipping address details, only available if shipping address is enabled.
     *
     * @type {PayPalCheckoutAddress}
     * @memberof PayPalCheckoutTokenizePayload
     */
    shippingAddress?: PayPalCheckoutAddress;

    /**
     * User's billing address details.
     *
     * @type {PayPalCheckoutAddress}
     * @memberof PayPalCheckoutTokenizePayload
     */
    billingAddress?: PayPalCheckoutAddress;

    /**
     * This property will only be present when the customer pays with PayPal Credit.
     *
     * @type {PayPalCheckoutCreditFinancingOptions}
     * @memberof PayPalCheckoutTokenizePayload
     */
    creditFinancingOffered?: PayPalCheckoutCreditFinancingOptions;
  }

  export interface PayPalCheckoutTokenizePayload {
    /**
     * The payment method nonce.
     *
     * @type {string}
     * @memberof PayPalCheckoutTokenizePayload
     */
    nonce: string;

    /**
     * The payment method type, always `PayPalAccount`.
     *
     * @type {string}
     * @memberof PayPalCheckoutTokenizePayload
     */
    type: string;

    /**
     * Additional PayPal account details.
     *
     * @type {PayPalCheckoutTokenizePayloadDetails}
     * @memberof PayPalCheckoutTokenizePayload
     */
    details: PayPalCheckoutTokenizePayloadDetails;
  }

  export enum PayPalCheckoutFlowType {
    /**
     * Used to store the payment method for future use, ie subscriptions
     */
    Vault = 'vault',

    /**
     * Used for one-time checkout
     */
    Checkout = 'checkout'
  }

  export enum PayPalCheckoutIntent {
    /**
     * Submits the transaction for authorization but not settlement.
     */
    Authorize = 'authorize',

    /**
     * Validates the transaction without an authorization (i.e. without holding funds). Useful for authorizing and capturing funds up to 90 days after the order has been placed. Only available for Checkout flow.
     */
    Order = 'order',

    /**
     * Payment will be immediately submitted for settlement upon creating a transaction. `sale` can be used as an alias for this value.
     */
    Capture = 'capture'
  }

  export interface PayPalCheckout {
    /**
     * @static
     * @function create
     * @description There are two ways to integrate the PayPal Checkout component. See the [PayPal Checkout constructor documentation](PayPalCheckout.html#PayPalCheckout) for more information and examples.
     *
     * @param {object} options Creation options:
     * @param {Client} [options.client] A {@link Client} instance.
     * @param {string} [options.authorization] A tokenizationKey or clientToken. Can be used in place of `options.client`.
     * @param {string} [options.merchantAccountId] A non-default merchant account ID to use for tokenization.
     * @param {callback} [callback] The second argument, `data`, is the {@link PayPalCheckout} instance.
     * @example
     * braintree.client.create({
     *   authorization: 'authorization'
     * }).then(function (clientInstance) {
     *   return braintree.paypalCheckout.create({
     *     client: clientInstance
     *   });
     * }).then(function (paypalCheckoutInstance) {
     *   // set up checkout.js
     * }).catch(function (err) {
     *   console.error('Error!', err);
     * });
     * @returns {(Promise|void)} Returns a promise if no callback is provided.
     */
    create(options: { client?: Client; authorization?: string; merchantAccountId?: string }): Promise<PayPalCheckout>;
    create(options: { client?: Client; authorization?: string; merchantAccountId?: string }, callback?: callback): void;

    /**
     * @description The current version of the SDK, i.e. `3.0.2`.
     * @type {string}
     */
    VERSION: string;

    /**
     * Creates a PayPal payment ID or billing token using the given options. This is meant to be passed to PayPal's checkout.js library.
     * When a {@link callback} is defined, the function returns undefined and invokes the callback with the id to be used with the checkout.js library. Otherwise, it returns a Promise that resolves with the id.
     * @public
     * @param {object} options All options for the PayPalCheckout component.
     * @param {string} options.flow Set to 'checkout' for one-time payment flow, or 'vault' for Vault flow. If 'vault' is used with a client token generated with a customer ID, the PayPal account will be added to that customer as a saved payment method.
     * @param {string} [options.intent=authorize]
     * * `authorize` - Submits the transaction for authorization but not settlement.
     * * `order` - Validates the transaction without an authorization (i.e. without holding funds). Useful for authorizing and capturing funds up to 90 days after the order has been placed. Only available for Checkout flow.
     * * `capture` - Payment will be immediately submitted for settlement upon creating a transaction. `sale` can be used as an alias for this value.
     * @param {boolean} [options.offerCredit=false] Offers PayPal Credit as the default funding instrument for the transaction. If the customer isn't pre-approved for PayPal Credit, they will be prompted to apply for it.
     * @param {(string|number)} [options.amount] The amount of the transaction. Required when using the Checkout flow.
     * @param {string} [options.currency] The currency code of the amount, such as 'USD'. Required when using the Checkout flow.
     * @param {string} [options.displayName] The merchant name displayed inside of the PayPal lightbox; defaults to the company name on your Braintree account
     * @param {string} [options.locale=en_US] Use this option to change the language, links, and terminology used in the PayPal flow. This locale will be used unless the buyer has set a preferred locale for their account. If an unsupported locale is supplied, a fallback locale (determined by buyer preference or browser data) will be used and no error will be thrown.
     * @param {string} [options.vaultInitiatedCheckoutPaymentMethodToken] Use the payment method nonce representing a PayPal account with a Billing Agreement ID to create the payment and redirect the customer to select a new financial instrument. This option is only applicable to the `checkout` flow.
     *
     * Supported locales are:
     * `da_DK`,
     * `de_DE`,
     * `en_AU`,
     * `en_GB`,
     * `en_US`,
     * `es_ES`,
     * `fr_CA`,
     * `fr_FR`,
     * `id_ID`,
     * `it_IT`,
     * `ja_JP`,
     * `ko_KR`,
     * `nl_NL`,
     * `no_NO`,
     * `pl_PL`,
     * `pt_BR`,
     * `pt_PT`,
     * `ru_RU`,
     * `sv_SE`,
     * `th_TH`,
     * `zh_CN`,
     * `zh_HK`,
     * and `zh_TW`.
     *
     * @param {shippingOption[]} [options.shippingOptions] List of shipping options offered by the payee or merchant to the payer to ship or pick up their items.
     * @param {boolean} [options.enableShippingAddress=false] Returns a shipping address object in {@link PayPal#tokenize}.
     * @param {object} [options.shippingAddressOverride] Allows you to pass a shipping address you have already collected into the PayPal payment flow.
     * @param {string} options.shippingAddressOverride.line1 Street address.
     * @param {string} [options.shippingAddressOverride.line2] Street address (extended).
     * @param {string} options.shippingAddressOverride.city City.
     * @param {string} options.shippingAddressOverride.state State.
     * @param {string} options.shippingAddressOverride.postalCode Postal code.
     * @param {string} options.shippingAddressOverride.countryCode Country.
     * @param {string} [options.shippingAddressOverride.phone] Phone number.
     * @param {string} [options.shippingAddressOverride.recipientName] Recipient's name.
     * @param {boolean} [options.shippingAddressEditable=true] Set to false to disable user editing of the shipping address.
     * @param {string} [options.billingAgreementDescription] Use this option to set the description of the preapproved payment agreement visible to customers in their PayPal profile during Vault flows. Max 255 characters.
     * @param {string} [options.landingPageType] Use this option to specify the PayPal page to display when a user lands on the PayPal site to complete the payment.
     * * `login` - A PayPal account login page is used.
     * * `billing` - A non-PayPal account landing page is used.
    * @property {lineItem[]} [options.lineItems] The line items for this transaction. It can include up to 249 line items.
    * @param {callback} [callback] The second argument is a PayPal `paymentId` or `billingToken` string, depending on whether `options.flow` is `checkout` or `vault`. This is also what is resolved by the promise if no callback is provided.
    * @example
    * // this paypal object is created by checkout.js
    * // see https://github.com/paypal/paypal-checkout
    * paypal.Buttons({
    *   createOrder: function () {
    *     // when createPayment resolves, it is automatically passed to checkout.js
    *     return paypalCheckoutInstance.createPayment({
    *       flow: 'checkout',
    *       amount: '10.00',
    *       currency: 'USD',
    *       intent: 'capture' // this value must either be `capture` or match the intent passed into the PayPal SDK intent query parameter
    *     });
    *   },
    *   // Add other options, e.g. onApproved, onCancel, onError
    * }).render('#paypal-button');
    *
    * @example
    * // shippingOptions are passed to createPayment. You can review the result from onAuthorize to determine which shipping option id was selected.
    * ```javascript
    * braintree.client.create({
    *   authorization: 'authorization'
    * }).then(function (clientInstance) {
    *   return braintree.paypalCheckout.create({
    *     client: clientInstance
    *   });
    * }).then(function (paypalCheckoutInstance) {
    *   return paypal.Button.render({
    *     env: 'production'
    *
    *     payment: function () {
    *       return paypalCheckoutInstance.createPayment({
    *         flow: 'checkout',
    *         amount: '10.00',
    *         currency: 'USD',
    *         shippingOptions: [
    *           {
    *             id: 'UUID-9',
    *             type: 'PICKUP',
    *             label: 'Store Location Five',
    *             selected: true,
    *             amount: {
    *               value: '1.00',
    *               currency: 'USD'
    *             }
    *           },
    *           {
    *             id: 'shipping-speed-fast',
    *             type: 'SHIPPING',
    *             label: 'Fast Shipping',
    *             selected: false,
    *             amount: {
    *               value: '1.00',
    *               currency: 'USD'
    *             }
    *           },
    *           {
    *             id: 'shipping-speed-slow',
    *             type: 'SHIPPING',
    *             label: 'Slow Shipping',
    *             selected: false,
    *             amount: {
    *               value: '1.00',
    *               currency: 'USD'
    *             }
    *           }
    *         ]
    *       });
    *     },
    *
    *     onAuthorize: function (data, actions) {
    *       return paypalCheckoutInstance.tokenizePayment(data).then(function (payload) {
    *         // Submit payload.nonce to your server
    *       });
    *     }
    *   }, '#paypal-button');
    * }).catch(function (err) {
    *  console.error('Error!', err);
    * });
    * ```
    *
    * @returns {(Promise|void)} Returns a promise if no callback is provided.
    */
    createPayment(options: {
      flow: PayPalCheckoutFlowType;
      intent?: PayPalCheckoutIntent;
      offerCredit?: boolean;
      amount?: string | number;
      currency?: string;
      displayName?: string;
      locale?: string;
      vaultInitiatedCheckoutPaymentMethodToken?: string;
      shippingOptions?: PayPalCheckoutShippingOption[];
      enableShippingAddress?: boolean;
      shippingAddressOverride?: PayPalCheckoutAddress;
      shippingAddressEditable?: boolean;
      billingAgreementDescription?: string;
      landingPageType?: string;
      lineItems?: PayPalCheckoutLineItem[];
    }): Promise<void>;

    /**
     * Tokenizes the authorize data from PayPal's checkout.js library when completing a buyer approval flow.
     * When a {@link callback} is defined, invokes the callback with {@link PayPalCheckout~tokenizePayload|tokenizePayload} and returns undefined. Otherwise, returns a Promise that resolves with a {@link PayPalCheckout~tokenizePayload|tokenizePayload}.
     * @public
     * @param {object} tokenizeOptions Tokens and IDs required to tokenize the payment.
     * @param {string} tokenizeOptions.payerId Payer ID returned by PayPal `onApproved` callback.
     * @param {string} [tokenizeOptions.paymentId] Payment ID returned by PayPal `onApproved` callback.
     * @param {string} [tokenizeOptions.billingToken] Billing Token returned by PayPal `onApproved` callback.
     * @param {boolean} [tokenizeOptions.vault=true] Whether or not to vault the resulting PayPal account (if using a client token generated with a customer id and the vault flow).
     * @param {callback} [callback] The second argument, <code>payload</code>, is a {@link PayPalCheckout~tokenizePayload|tokenizePayload}. If no callback is provided, the promise resolves with a {@link PayPalCheckout~tokenizePayload|tokenizePayload}.
     * @example <caption>Opt out of auto-vaulting behavior</caption>
     * // create the paypalCheckoutInstance with a client token generated with a customer id
     * paypal.Buttons({
     *   createBillingAgreement: function () {
     *     return paypalCheckoutInstance.createPayment({
     *       flow: 'vault'
     *       // your other createPayment options here
     *     });
     *   },
     *   onApproved: function (data) {
     *     data.vault = false;
     *
     *     return paypalCheckoutInstance.tokenizePayment(data);
     *   },
     *   // Add other options, e.g. onCancel, onError
     * }).render('#paypal-button');
     *
     * @returns {(Promise|void)} Returns a promise if no callback is provided.
     */
    tokenizePayment(tokenizeOptions: {
      payerId: string;
      paymentId?: string;
      billingToken?: string;
      vault?: boolean;
    }): Promise<PayPalCheckoutTokenizePayload>;
    tokenizePayment(tokenizeOptions: {
      payerId: string;
      paymentId?: string;
      billingToken?: string;
      vault?: boolean;
    }, callback?: callback): void;

    /**
     * Resolves with the PayPal client id to be used when loading the PayPal SDK.
     * @public
     * @param {callback} [callback] The second argument, <code>payload</code>, is a {@link PayPalCheckout~tokenizePayload|tokenizePayload}. If no callback is provided, the promise resolves with a {@link PayPalCheckout~tokenizePayload|tokenizePayload}.
     * @returns {(Promise|void)} Returns a promise if no callback is provided.
     * @example
     * paypalCheckoutInstance.getClientId().then(function (id) {
     *  var script = document.createElement('script');
     *
     *  script.src = 'https://www.paypal.com/sdk/js?client-id=' + id;
     *  script.onload = function () {
     *    // setup the PayPal SDK
     *  };
     *
     *  document.body.appendChild(script);
     * });
     */
    getClientId(): Promise<string>;
    getClientId(callback: (id: string) => void): void;

    /**
     * Initializes the PayPal checkout flow with a payment method nonce that represents a vaulted PayPal account.
     * When a {@link callback} is defined, the function returns undefined and invokes the callback with the id to be used with the checkout.js library. Otherwise, it returns a Promise that resolves with the id.
     * @public
     * @ignore
     * @param {object} options These options are identical to the {@link PayPalCheckout#createPayment|options for creating a payment resource}, except for the following:
     * * `flow` cannot be set (will always be `'checkout'`)
     * * `amount`, `currency`, and `vaultInitiatedCheckoutPaymentMethodToken` are required instead of optional
     * * Additional configuration is available (listed below)
     * @param {boolean} [options.optOutOfModalBackdrop=false] By default, the webpage will darken and become unusable while the PayPal window is open. For full control of the UI, pass `true` for this option.
     * @param {callback} [callback] The second argument, <code>payload</code>, is a {@link PayPalCheckout~tokenizePayload|tokenizePayload}. If no callback is provided, the promise resolves with a {@link PayPalCheckout~tokenizePayload|tokenizePayload}.
     * @example
     * paypalCheckoutInstance.startVaultInitiatedCheckout({
     *   vaultInitiatedCheckoutPaymentMethodToken: 'nonce-that-represents-a-vaulted-paypal-account',
     *   amount: '10.00',
     *   currency: 'USD'
     * }).then(function (payload) {
     *   // send payload.nonce to your server
     * }).catch(function (err) {
     *   if (err.code === 'PAYPAL_POPUP_CLOSED') {
     *     // indicates that customer canceled by
     *     // manually closing the PayPal popup
     *   }
     *
     *   // handle other errors
     * });
     *
     * @returns {(Promise|void)} Returns a promise if no callback is provided.
     */
    startVaultInitiatedCheckout(options: { optOutOfModalBackdrop: boolean }): Promise<void>;
    startVaultInitiatedCheckout(options: { optOutOfModalBackdrop: boolean }, callback: callback): void;

    /**
     * Cleanly tear down anything set up by {@link module:braintree-web/paypal-checkout.create|create}.
     * @public
     * @param {callback} [callback] Called once teardown is complete. No data is returned if teardown completes successfully.
     * @example
     * paypalCheckoutInstance.teardown();
     * @example <caption>With callback</caption>
     * paypalCheckoutInstance.teardown(function () {
     *   // teardown is complete
     * });
     * @returns {(Promise|void)} Returns a promise if no callback is provided.
     */
    teardown(callback: () => void): void;
    teardown(): Promise<void>;
  }
}

declare namespace braintree {  // extends HostedFieldsAccountDetails from @types/braintree-web
  interface HostedFieldsAccountDetails {
    bin: string;
    expirationMonth: string;
    expirationYear: string;
  }

  export interface HostedFields {
    // Cleanly remove anything set up by create.
    // Called on completion, containing an error if one occurred.
    // No data is returned if teardown completes successfully.
    // If no callback is provided, teardown returns a promise.
    teardown(): Promise<void>;
  }

  /** @type {module:braintree-web/venmo} */
  export var venmo: braintree.Venmo;
  export var googlePayment: braintree.GooglePayment;
  export var paypalCheckout: braintree.PayPalCheckout;
}
