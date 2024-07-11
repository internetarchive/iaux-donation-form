/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from '@open-wc/testing';
import { MockBraintreeManager } from '../../mocks/mock-braintree-manager';
import { PayPalHandler } from '../../../src/braintree-manager/payment-providers/paypal/paypal';
import { MockPayPalClient } from '../../mocks/payment-clients/mock-paypal-client';
import { MockPayPalButtonRenderer } from '../../mocks/mock-paypal-button-renderer';
import { HostingEnvironment } from '../../../src/braintree-manager/braintree-interfaces';
import { MockDonationInfo } from '../../mocks/mock-donation-info';

describe('PayPalHandler', () => {
  it('can render the paypal button', async () => {
    // This is the only way I can figure out how to mock window.paypal
    (window['paypal'] as any) = { FUNDING: { VENMO: 'venmo' } };

    const braintreeManager = new MockBraintreeManager();
    const client = new MockPayPalClient();
    const buttonRenderer = new MockPayPalButtonRenderer();

    const handler = new PayPalHandler({
      braintreeManager: braintreeManager,
      paypalClient: client,
      paypalButton: buttonRenderer,
      hostingEnvironment: HostingEnvironment.Development,
    });

    const donationInfo = new MockDonationInfo();

    const datasource = await handler.renderPayPalButton({
      selector: 'foo',
      style: {
        color: 'blue' as paypal.ButtonColorOption,
        label: 'paypal' as paypal.ButtonLabelOption,
        shape: 'rect' as paypal.ButtonShapeOption,
        size: 'medium' as paypal.ButtonSizeOption,
        tagline: false,
      },
      donationInfo: donationInfo,
    });

    expect(datasource?.donationInfo.amount).to.equal(5);

    delete window['paypal' as any];
  });
});
