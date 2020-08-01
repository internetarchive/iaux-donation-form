import { expect } from '@open-wc/testing';
import { MockBraintreeManager } from '../../mocks/mock-braintree-manager';
import { PayPalHandler } from '../../../src/braintree-manager/payment-providers/paypal/paypal';
import { MockPayPalClient } from '../../mocks/payment-clients/mock-paypal-client';
import { MockPayPalButtonRenderer } from '../../mocks/mock-paypal-button-renderer';
import { HostingEnvironment } from '../../../src/braintree-manager/braintree-interfaces';
import { DonationPaymentInfo } from '../../../src/models/donation-info/donation-payment-info';

describe('ApplePayHandler', () => {
  it('can render the paypal button', async () => {
    const braintreeManager = new MockBraintreeManager();
    const client = new MockPayPalClient();
    const buttonRenderer = new MockPayPalButtonRenderer();

    const handler = new PayPalHandler({
      braintreeManager: braintreeManager,
      paypalClient: client,
      paypalButton: buttonRenderer,
      hostingEnvironment: HostingEnvironment.Development
    });

    const datasource = await handler.renderPayPalButton({
      selector: 'foo',
      style: {
        color: 'blue' as paypal.ButtonColorOption, // I'm not sure why I can't access the enum directly here.. I get a UMD error
        label: 'paypal' as paypal.ButtonLabelOption,
        shape: 'rect' as paypal.ButtonShapeOption,
        size: 'medium' as paypal.ButtonSizeOption,
        tagline: false,
      },
      donationInfo: DonationPaymentInfo.default
    })

    expect(datasource?.donationInfo.amount).to.equal(5);
  });
});
