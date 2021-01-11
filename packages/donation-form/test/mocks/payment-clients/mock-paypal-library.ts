import {
  ButtonRenderer,
  ButtonRenderOptions,
  PayPal,
} from '../../../src/@types/paypal-checkout-components/index';

export class MockPaypalLibrary implements PayPal {
  button: ButtonRenderer = {
    render(options: ButtonRenderOptions, selector: string): void {
      console.debug('render', options, selector);
    },
  };
}
