import { html, fixture, expect, elementUpdated, oneEvent } from '@open-wc/testing';

import '../../src/donation-form';
import { DonationForm } from '../../src/donation-form';
import {
  DonationType,
  DonationPaymentInfo,
  PaymentProvider,
} from '@internetarchive/donation-form-data-models';
import { PaymentSelector } from '../../src/form-elements/payment-selector';
import { MockBraintreeManager } from '../mocks/mock-braintree-manager';
import { MockPaymentFlowHandlers } from '../mocks/flow-handlers/mock-payment-flow-handlers';
import { promisedSleep } from '../../src/util/promisedSleep';
import { MockDonationInfo } from '../mocks/mock-donation-info';

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
      const editDonation = donationHeader?.shadowRoot?.querySelector('donation-form-edit-donation');
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

  it('emits paymentProviderSelected when the selected provider changes', async () => {
    const el = (await fixture(html`
      <donation-form></donation-form>
    `)) as DonationForm;
    const braintreeManager = new MockBraintreeManager();
    el.braintreeManager = braintreeManager;
    await elementUpdated(el);
    const paymentSelector = el.shadowRoot?.querySelector('payment-selector') as PaymentSelector;
    const creditCardButton = paymentSelector.shadowRoot?.querySelector(
      '.credit-card-button',
    ) as HTMLButtonElement;

    // on the first payment provider chosen, the previousPaymentProvider is undefined
    setTimeout(() => {
      const ccClickEvent = new MouseEvent('click');
      creditCardButton.dispatchEvent(ccClickEvent);
    });
    const ccResponse = await oneEvent(el, 'paymentProviderSelected');
    expect(ccResponse).to.exist;
    expect(ccResponse.detail.paymentProvider).to.equal(PaymentProvider.CreditCard);
    expect(ccResponse.detail.previousPaymentProvider).to.equal(undefined);

    // on subsequent payment provider choices, the previousPaymentProvider is populated
    setTimeout(() => {
      const venmoButton = paymentSelector.shadowRoot?.querySelector('.venmo') as HTMLButtonElement;
      const venmoClickEvent = new MouseEvent('click');
      venmoButton.dispatchEvent(venmoClickEvent);
    });
    const venmoResponse = await oneEvent(el, 'paymentProviderSelected');
    expect(venmoResponse).to.exist;
    expect(venmoResponse.detail.paymentProvider).to.equal(PaymentProvider.Venmo);
    expect(venmoResponse.detail.previousPaymentProvider).to.equal(PaymentProvider.CreditCard);
  });
});
