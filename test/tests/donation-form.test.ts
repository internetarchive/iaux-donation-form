import { html, fixture, expect, elementUpdated } from '@open-wc/testing';

import '../../src/donation-form';
import { DonationForm } from '../../src/donation-form';
import { DonationType } from '../../src/models/donation-info/donation-type';
import { PaymentSelector } from '../../src/form-elements/payment-selector';
import { MockBraintreeManager } from '../mocks/mock-braintree-manager';
import { ContactForm } from '../../src/form-elements/contact-form/contact-form';
import { MockPaymentFlowHandlers } from '../mocks/flow-handlers/mock-payment-flow-handlers';
import { promisedSleep } from '../helpers/promisedSleep';
import { DonationPaymentInfo } from '../../src/models/donation-info/donation-payment-info';
import { MockDonationInfo } from '../mocks/mock-donation-info';

function fillInContactForm(contactForm: ContactForm): void {
  contactForm.emailField.value = 'foo@bar.com';
  contactForm.firstNameField.value = 'Fooey';
  contactForm.lastNameField.value = 'McBarrison';
  contactForm.streetAddressField.value = '123 Fake St';
  contactForm.extendedAddressField.value = 'Apt 123';
  contactForm.localityField.value = 'SF';
  contactForm.regionField.value = 'CA';
  contactForm.postalCodeField.value = '12345';

  // setting the values above does not trigger any validations
  // you have to send an `input` Event like what would happen in the browser
  const inputEvent = new Event('input');
  contactForm.postalCodeField.dispatchEvent(inputEvent);
}

describe('Donation Form', () => {
  describe('Configuration', () => {
    it('has no configuration', async () => {
      const el = (await fixture(html`
        <donation-form></donation-form>
      `)) as DonationForm;

      expect(el.braintreeManager).to.equal(undefined);
      expect(el.donationRequest).to.equal(undefined);
    });

    it('updates donationInfo when user changes donation info', async () => {
      const el = (await fixture(html`
        <donation-form .donationInfo=${new MockDonationInfo()}></donation-form>
      `)) as DonationForm;
      const donationHeader = el.shadowRoot?.querySelector('donation-form-header');
      const editDonation = donationHeader?.shadowRoot?.querySelector('edit-donation');
      const monthlyOption = editDonation?.shadowRoot?.querySelector('#donationType-monthly-option');
      const clickEvent = new MouseEvent('click');
      monthlyOption?.dispatchEvent(clickEvent);
      await elementUpdated(el);
      expect(el.donationInfo?.donationType).to.equal(DonationType.Monthly);
    });
  });

  it('shows the contact form when Credit Card is selected', async () => {
    const el = (await fixture(html`
      <donation-form></donation-form>
    `)) as DonationForm;
    const contactFormSection = el.shadowRoot?.querySelector('.contact-form-section');
    const paymentSelector = el.shadowRoot?.querySelector('payment-selector') as PaymentSelector;
    const creditCardButton = paymentSelector.shadowRoot?.querySelector(
      '.credit-card-button',
    ) as HTMLButtonElement;
    expect(contactFormSection?.classList.contains('hidden')).to.be.true;
    const clickEvent = new MouseEvent('click');
    creditCardButton.dispatchEvent(clickEvent);
    await elementUpdated(el);
    expect(contactFormSection?.classList.contains('hidden')).to.be.false;
  });

  it('shows the contact form when Venmo is selected', async () => {
    const el = (await fixture(html`
      <donation-form></donation-form>
    `)) as DonationForm;
    const braintreeManager = new MockBraintreeManager();
    el.braintreeManager = braintreeManager;
    await elementUpdated(el);
    const contactFormSection = el.shadowRoot?.querySelector('.contact-form-section');
    const paymentSelector = el.shadowRoot?.querySelector('payment-selector') as PaymentSelector;
    const venmoButton = paymentSelector.shadowRoot?.querySelector('.venmo') as HTMLButtonElement;
    expect(contactFormSection?.classList.contains('hidden')).to.be.true;
    const clickEvent = new MouseEvent('click');
    venmoButton.dispatchEvent(clickEvent);
    await elementUpdated(el);
    expect(contactFormSection?.classList.contains('hidden')).to.be.false;
  });

  it('activates the donate button when contact info is valid', async () => {
    const el = (await fixture(html`
      <donation-form></donation-form>
    `)) as DonationForm;
    const braintreeManager = new MockBraintreeManager();
    el.braintreeManager = braintreeManager;
    const paymentSelector = el.shadowRoot?.querySelector('payment-selector') as PaymentSelector;
    const venmoButton = paymentSelector.shadowRoot?.querySelector('.venmo') as HTMLButtonElement;
    const clickEvent = new MouseEvent('click');
    venmoButton.dispatchEvent(clickEvent);
    await elementUpdated(el);
    const donateButton = el.shadowRoot?.querySelector('#donate-button') as HTMLButtonElement;
    expect(donateButton.disabled).to.be.true;
    const contactForm = el.shadowRoot?.querySelector('contact-form') as ContactForm;
    fillInContactForm(contactForm);
    await elementUpdated(el);
    expect(donateButton.disabled).to.be.false;
  });

  it('properly configures the flow handlers when they are set', async () => {
    const donationInfo = new DonationPaymentInfo({
      donationType: DonationType.Monthly,
      amount: 3.5,
      coverFees: false,
    });
    const el = (await fixture(html`
      <donation-form .donationInfo=${donationInfo}></donation-form>
    `)) as DonationForm;
    const flowHandlers = new MockPaymentFlowHandlers();
    el.paymentFlowHandlers = flowHandlers;
    await elementUpdated(el);
    await promisedSleep(250);
    expect(flowHandlers.paypalHandler.donationInfo).to.equal(donationInfo);
  });
});
