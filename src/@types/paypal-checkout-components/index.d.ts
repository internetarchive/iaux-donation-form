// Type definitions for paypal-checkout-components 4.0
// Project: https://github.com/paypal/paypal-checkout-components/
// Definitions by: Jason Buckner <https://github.com/jbuckner>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.1

import { ButtonRenderer, ButtonRenderOptions, FUNDING } from './modules/button';

interface PayPal {
  button: ButtonRenderer;
}

import {
  ButtonColorOption,
  ButtonLabelOption,
  ButtonShapeOption,
  ButtonSizeOption,
  ButtonStyle,
  Environment,
} from './modules/configuration';

import {
  Address,
  AuthorizationData,
  AuthorizationTokenizePayload,
  CancellationData,
  CreditFinancingOptions,
  FlowType,
  Intent,
  LineItem,
  LineItemKind,
  ShippingOption,
  ShippingOptionType,
  TokenizePayload,
  TokenizePayloadDetails,
} from './modules/callback-data';
import { PayPalHandler } from '../../../src/braintree-manager/payment-providers/paypal/paypal';

export const Button: ButtonRenderer;

export {
  Address,
  AuthorizationData,
  AuthorizationTokenizePayload,
  ButtonRenderer,
  ButtonColorOption,
  ButtonLabelOption,
  ButtonRenderOptions,
  ButtonShapeOption,
  ButtonSizeOption,
  ButtonStyle,
  CancellationData,
  CreditFinancingOptions,
  Environment,
  FlowType,
  FUNDING,
  Intent,
  LineItem,
  LineItemKind,
  ShippingOption,
  ShippingOptionType,
  TokenizePayload,
  TokenizePayloadDetails,
};

export const paypal: PayPalHandler;
export as namespace paypal;
