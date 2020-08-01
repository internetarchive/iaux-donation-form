import { ButtonRenderOptions } from 'paypal-checkout-components/modules/button';

export class MockPayPalButtonRenderer implements paypal.ButtonRenderer {
  options?: paypal.ButtonRenderOptions;
  selector?: string;

  render(
    options: paypal.ButtonRenderOptions,
    selector: string,
  ): void {
    console.debug('MOCK RENDER');
    this.options = options;
    this.selector = selector;
  }
}
