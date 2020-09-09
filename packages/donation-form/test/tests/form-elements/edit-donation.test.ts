import { html, fixture, expect, elementUpdated, oneEvent } from '@open-wc/testing';
import '../../../src/form-elements/header/edit-donation';
import { EditDonation, DonationInfoError } from '../../../src/form-elements/header/edit-donation';
import { DonationPaymentInfo } from '../../../src/models/donation-info/donation-payment-info';
import { DonationType } from '../../../src/models/donation-info/donation-type';
import { MockDonationInfo } from '../../mocks/mock-donation-info';

describe('EditDonation', () => {
  it('emits donationInfoChanged event when preset amount selected', async () => {
    const el = (await fixture(html`
      <edit-donation .donationInfo=${new MockDonationInfo()}></edit-donation>>
    `)) as EditDonation;
    const preset10Button = el.shadowRoot?.querySelector('#amount-10-option');
    const clickEvent = new MouseEvent('click');
    setTimeout(() => {
      preset10Button?.dispatchEvent(clickEvent);
    });
    const response = await oneEvent(el, 'donationInfoChanged');
    const donationInfo = response.detail.donationInfo as DonationPaymentInfo;
    expect(donationInfo.amount).to.equal(10);
  });

  it('emits donationInfoChanged event when frequency selected', async () => {
    const el = (await fixture(html`
      <edit-donation .donationInfo=${new MockDonationInfo()}></edit-donation>>
    `)) as EditDonation;
    const monthlyButton = el.shadowRoot?.querySelector('#donationType-monthly-option');
    const clickEvent = new MouseEvent('click');
    setTimeout(() => {
      monthlyButton?.dispatchEvent(clickEvent);
    });
    const response = await oneEvent(el, 'donationInfoChanged');
    const donationInfo = response.detail.donationInfo as DonationPaymentInfo;
    expect(donationInfo.amount).to.equal(5);
    expect(donationInfo.donationType).to.equal(DonationType.Monthly);
  });

  it('focuses the custom amount input when the radio is selected', async () => {
    const el = (await fixture(html`
      <edit-donation></edit-donation>>
    `)) as EditDonation;
    const customRadioButton = el.shadowRoot?.querySelector('#custom-amount-button');
    const clickEvent = new MouseEvent('click');
    customRadioButton?.dispatchEvent(clickEvent);
    await elementUpdated(el);
    const focusedElement = el.shadowRoot?.activeElement;
    const customInput = el.shadowRoot?.querySelector('#custom-amount-input');
    expect(customInput).to.equal(focusedElement);
  });

  it('emits donationInfoChanged event when cover fees checked', async () => {
    const el = (await fixture(html`
      <edit-donation .donationInfo=${new MockDonationInfo()}></edit-donation>>
    `)) as EditDonation;
    const coverFeesCheckbox = el.shadowRoot?.querySelector('#cover-fees');
    const clickEvent = new MouseEvent('click');
    setTimeout(() => {
      coverFeesCheckbox?.dispatchEvent(clickEvent);
    });
    const response = await oneEvent(el, 'donationInfoChanged');
    const donationInfo = response.detail.donationInfo as DonationPaymentInfo;
    expect(donationInfo.amount).to.equal(5);
    expect(donationInfo.coverFees).to.be.true;
  });

  it('ensure cover fees can be unchecked', async () => {
    const el = (await fixture(html`
      <edit-donation .donationInfo=${new MockDonationInfo()}></edit-donation>>
    `)) as EditDonation;
    const coverFeesCheckbox = el.shadowRoot?.querySelector('#cover-fees');
    const clickEvent = new MouseEvent('click');
    setTimeout(() => {
      coverFeesCheckbox?.dispatchEvent(clickEvent);
    });
    await oneEvent(el, 'donationInfoChanged');
    const clickEvent2 = new MouseEvent('click');
    setTimeout(() => {
      coverFeesCheckbox?.dispatchEvent(clickEvent2);
    });
    const response2 = await oneEvent(el, 'donationInfoChanged');
    const donationInfo = response2.detail.donationInfo as DonationPaymentInfo;
    expect(donationInfo.amount).to.equal(5);
    expect(donationInfo.coverFees).to.be.false;
  });

  it('selects the custom amount radio button when custom amount input changed', async () => {
    const el = (await fixture(html`
      <edit-donation .donationInfo=${new MockDonationInfo()}></edit-donation>>
    `)) as EditDonation;
    const customInput = el.shadowRoot?.querySelector('#custom-amount-input') as HTMLInputElement;
    const customRadioButton = el.shadowRoot?.querySelector(
      '#custom-amount-button',
    ) as HTMLInputElement;
    customInput.value = '3.50';
    expect(customRadioButton?.checked).to.be.false;
    const inputEvent = new Event('input');
    customInput.dispatchEvent(inputEvent);
    await elementUpdated(el);
    expect(customRadioButton?.checked).to.be.true;
  });

  it('emits a `editDonationError` event if the custom amount is too low', async () => {
    const el = (await fixture(html`
      <edit-donation .donationInfo=${new MockDonationInfo()}></edit-donation>>
    `)) as EditDonation;
    const customInput = el.shadowRoot?.querySelector('#custom-amount-input') as HTMLInputElement;
    customInput.value = '0.50';
    const inputEvent = new Event('input');
    setTimeout(() => {
      customInput?.dispatchEvent(inputEvent);
    });
    const response = await oneEvent(el, 'editDonationError');
    const error = response.detail.error;
    expect(error).to.equal(DonationInfoError.DonationTooLow);
  });

  it('emits a `editDonationError` event if the custom amount is too high', async () => {
    const el = (await fixture(html`
      <edit-donation .donationInfo=${new MockDonationInfo()}></edit-donation>>
    `)) as EditDonation;
    const customInput = el.shadowRoot?.querySelector('#custom-amount-input') as HTMLInputElement;
    customInput.value = '10000';
    const inputEvent = new Event('input');
    setTimeout(() => {
      customInput?.dispatchEvent(inputEvent);
    });
    const response = await oneEvent(el, 'editDonationError');
    const error = response.detail.error;
    expect(error).to.equal(DonationInfoError.DonationTooHigh);
  });

  it('emits a `editDonationError` event if the custom amount is empty', async () => {
    const el = (await fixture(html`
      <edit-donation .donationInfo=${new MockDonationInfo()}></edit-donation>>
    `)) as EditDonation;
    const customInput = el.shadowRoot?.querySelector('#custom-amount-input') as HTMLInputElement;
    customInput.value = '';
    const inputEvent = new Event('input');
    setTimeout(() => {
      customInput?.dispatchEvent(inputEvent);
    });
    const response = await oneEvent(el, 'editDonationError');
    const error = response.detail.error;
    expect(error).to.equal(DonationInfoError.InvalidDonationAmount);
  });

  it('displays an error message if there is one', async () => {
    const el = (await fixture(html`
      <edit-donation .donationInfo=${new MockDonationInfo()}></edit-donation>>
    `)) as EditDonation;
    const errorsContainer = el.shadowRoot?.querySelector('.errors') as HTMLDivElement;
    expect(errorsContainer.innerText).to.be.empty;
    const customInput = el.shadowRoot?.querySelector('#custom-amount-input') as HTMLInputElement;
    customInput.value = '10000';
    const inputEvent = new Event('input');
    setTimeout(() => {
      customInput?.dispatchEvent(inputEvent);
    });
    await oneEvent(el, 'editDonationError');
    expect(errorsContainer.innerText).to.not.be.empty;
  });
});
