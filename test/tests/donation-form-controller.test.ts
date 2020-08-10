/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, fixture, expect, elementUpdated } from '@open-wc/testing';

import '../../src/donation-form-controller';
import { DonationFormController } from '../../src/donation-form-controller';
import { MockGrecaptcha, MockGrecaptchaMode } from '../mocks/payment-clients/mock-grecaptcha';
import { HostingEnvironment } from '../../src/braintree-manager/braintree-interfaces';
import { MockEndpointManager } from '../mocks/mock-endpoint-manager';
import { MockPaymentClients } from '../mocks/mock-payment-clients';
import { ContactForm } from '../../src/form-elements/contact-form/contact-form';
import { fillInContactForm } from '../helpers/fillInContactForm';
import { promisedSleep } from '../helpers/promisedSleep';
import { MockModalManager } from '../mocks/mock-modal-manager';
import { MockHostedFieldsClient } from '../mocks/payment-clients/mock-hostedfields-client';
import { DonationForm } from '../../src/donation-form';
import { PaymentSelector } from '../../src/form-elements/payment-selector';

describe('Donation Form Controller', () => {
  beforeEach(() => {
    (window['grecaptcha' as any] as any) = new MockGrecaptcha(MockGrecaptchaMode.Success);
  });

  afterEach(() => {
    delete window['grecaptcha' as any];
  });

  it('has no shadowRoot', async () => {
    const el = (await fixture(html`
      <donation-form-controller></donation-form-controller>
    `)) as DonationFormController;

    expect(el.shadowRoot).to.equal(null);
  });

  it('can submit a donation', async () => {
    const controller = (await fixture(html`
      <donation-form-controller></donation-form-controller>
    `)) as DonationFormController;

    // configure the donation-form-controller
    const recaptchaElement = (await fixture(
      html`
        <div></div>
      `,
    )) as HTMLElement;
    const endpointManager = new MockEndpointManager();
    const paymentClients = new MockPaymentClients();
    const modalManager = new MockModalManager();
    controller.paymentClients = paymentClients;
    controller.modalManager = modalManager;
    controller.environment = HostingEnvironment.Development;
    controller.recaptchaElement = recaptchaElement;
    controller.endpointManager = endpointManager;
    controller.braintreeAuthToken = 'foo';
    controller.recaptchaSiteKey = 'bar';
    controller.venmoProfileId = 'baz';
    controller.referrer = 'test-referrer';
    controller.loggedInUser = 'test-user';

    // grab some internal elements to interact with
    const donationForm: DonationForm = controller.querySelector('donation-form') as DonationForm;
    const paymentSelector: PaymentSelector = donationForm?.shadowRoot?.querySelector(
      'payment-selector',
    ) as PaymentSelector;
    const creditCardButton = paymentSelector?.shadowRoot?.querySelector('.credit-card-button');

    // click on the credit card button
    const ccClickEvent = new MouseEvent('click');
    creditCardButton?.dispatchEvent(ccClickEvent);

    // clicking on the credit card button will show the contact form so wait for it to be updated
    await elementUpdated(donationForm);
    const contactForm = donationForm?.shadowRoot?.querySelector('contact-form') as ContactForm;
    await fillInContactForm(contactForm);

    // verify the Donate button is still disabled
    const donateButton = donationForm?.shadowRoot?.querySelector(
      '#donate-button',
    ) as HTMLButtonElement;
    expect(donateButton.disabled).to.equal(true);

    // simulates after the user has input all of the credit card fields
    const hostedFields = (await paymentClients.hostedFields.get()) as MockHostedFieldsClient;
    hostedFields.emitValidityChangedEvent(true);
    await promisedSleep(100);

    // verify that the donate button has become enabled and no request has been submitted
    expect(donateButton.disabled).to.equal(false);
    expect(endpointManager.requestSubmitted).to.equal(undefined);

    // click the donate button
    const donateClickEvent = new MouseEvent('click');
    donateButton?.dispatchEvent(donateClickEvent);
    await promisedSleep(100);

    // verify that a payload has been requested to be submitted to the backend
    expect(endpointManager.requestSubmitted).to.not.equal(undefined);
  });
});
