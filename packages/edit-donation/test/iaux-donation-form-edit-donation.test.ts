import {
  html,
  fixture,
  expect,
  elementUpdated,
  oneEvent,
} from '@open-wc/testing';
import { MockDonationInfo } from './mocks/mock-donation-info';
import {
  DonationFormEditDonation,
  EditDonationInfoStatus,
  DonationFormEditDonationStepNumberMode,
} from '../src/donation-form-edit-donation';
import {
  DonationPaymentInfo,
  DonationType,
} from '@internetarchive/donation-form-data-models';
import {
  DonationFormSectionBadgeMode,
  DonationFormSection,
} from '@internetarchive/donation-form-section';
import { promisedSleep } from './promised-sleep';

describe('EditDonation', () => {
  it('emits donationInfoChanged event when preset amount selected', async () => {
    const el = (await fixture(html`
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;
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
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;
    const monthlyButton = el.shadowRoot?.querySelector(
      '#donationType-monthly-option',
    );
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
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;
    const customRadioButton = el.shadowRoot?.querySelector(
      '#custom-amount-button',
    );
    const clickEvent = new MouseEvent('click');
    customRadioButton?.dispatchEvent(clickEvent);
    await elementUpdated(el);
    // this promisedSleep is necessary because we have to do a setTimeout
    // in the component to focus the input, and we need to wait for that
    // to complete before we can check the focused element.
    // See the `customRadioSelected` method in the component.
    await promisedSleep(100);
    const focusedElement = el.shadowRoot?.activeElement;
    const customInput = el.shadowRoot?.querySelector('#custom-amount-input');
    expect(customInput).to.equal(focusedElement);
  });

  it('checks the custom radio button when the custom amount is focused', async () => {
    const el = (await fixture(html`
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;
    const customRadioButton = el.shadowRoot?.querySelector(
      '#custom-amount-button',
    ) as HTMLInputElement;
    const customInput = el.shadowRoot?.querySelector('#custom-amount-input');
    const focusEvent = new FocusEvent('focus');
    expect(customRadioButton.checked).to.be.false;
    customInput?.dispatchEvent(focusEvent);
    await elementUpdated(el);
    expect(customRadioButton.checked).to.be.true;
  });

  it('displays trailing 0s in custom amount when appropriate', async () => {
    const el = (await fixture(html`
      <donation-form-edit-donation
        .donationInfo=${new DonationPaymentInfo({
          amount: 2.4,
          donationType: DonationType.OneTime,
          coverFees: false,
        })}
        .amountOptions=${[2, 4, 6, 8]}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;
    const customInput = el.shadowRoot?.querySelector(
      '#custom-amount-input',
    ) as HTMLInputElement;
    expect(customInput?.value).to.equal('2.40');
  });

  it('updates custom amount with trailing 0 on blur', async () => {
    const el = (await fixture(html`
      <donation-form-edit-donation
        .donationInfo=${new DonationPaymentInfo({
          amount: 2.4,
          donationType: DonationType.OneTime,
          coverFees: false,
        })}
        .amountOptions=${[2, 4, 6, 8]}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;
    const customInput = el.shadowRoot?.querySelector(
      '#custom-amount-input',
    ) as HTMLInputElement;
    customInput.value = '2.4';
    const blurEvent = new FocusEvent('blur');
    customInput.dispatchEvent(blurEvent);
    await elementUpdated(el);
    expect(customInput?.value).to.equal('2.40');
  });

  it('emits donationInfoChanged event when cover fees checked', async () => {
    const el = (await fixture(html`
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
      ></donation-form-edit-donation
      >>
    `)) as DonationFormEditDonation;
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
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;
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
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;
    const customInput = el.shadowRoot?.querySelector(
      '#custom-amount-input',
    ) as HTMLInputElement;
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
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;
    const customInput = el.shadowRoot?.querySelector(
      '#custom-amount-input',
    ) as HTMLInputElement;
    customInput.value = '0.50';
    const inputEvent = new Event('input');
    setTimeout(() => {
      customInput?.dispatchEvent(inputEvent);
    });
    const response = await oneEvent(el, 'editDonationError');
    const error = response.detail.error;
    expect(error).to.equal(EditDonationInfoStatus.DonationTooLow);
  });

  it('does not update donationInfo if there is a donation info error', async () => {
    const el = (await fixture(html`
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;
    const customInput = el.shadowRoot?.querySelector(
      '#custom-amount-input',
    ) as HTMLInputElement;
    customInput.value = '0.50';
    const inputEvent = new Event('input');
    customInput?.dispatchEvent(inputEvent);
    await el.updateComplete;
    expect(el.donationInfo.amount).to.equal(5);
  });

  it('emits a `editDonationError` event if the custom amount is too high', async () => {
    const el = (await fixture(html`
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;
    const customInput = el.shadowRoot?.querySelector(
      '#custom-amount-input',
    ) as HTMLInputElement;
    customInput.value = '10000';
    const inputEvent = new Event('input');
    setTimeout(() => {
      customInput?.dispatchEvent(inputEvent);
    });
    const response = await oneEvent(el, 'editDonationError');
    const error = response.detail.error;
    expect(error).to.equal(EditDonationInfoStatus.DonationTooHigh);
  });

  it('emits a `editDonationError` event if the custom amount is empty', async () => {
    const el = (await fixture(html`
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;
    const customInput = el.shadowRoot?.querySelector(
      '#custom-amount-input',
    ) as HTMLInputElement;
    customInput.value = '';
    const inputEvent = new Event('input');
    setTimeout(() => {
      customInput?.dispatchEvent(inputEvent);
    });
    const response = await oneEvent(el, 'editDonationError');
    const error = response.detail.error;
    expect(error).to.equal(EditDonationInfoStatus.InvalidDonationAmount);
  });

  it('displays an error message if there is one', async () => {
    const el = (await fixture(html`
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;
    const errorsContainer = el.shadowRoot?.querySelector(
      '.errors',
    ) as HTMLDivElement;
    expect(errorsContainer.innerText).to.be.empty;
    const customInput = el.shadowRoot?.querySelector(
      '#custom-amount-input',
    ) as HTMLInputElement;
    customInput.value = '10000';
    const inputEvent = new Event('input');
    setTimeout(() => {
      customInput?.dispatchEvent(inputEvent);
    });
    await oneEvent(el, 'editDonationError');
    expect(errorsContainer.innerText).to.not.be.empty;
  });

  it('can hide the numbers', async () => {
    const el = (await fixture(html`
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
        .stepNumberMode=${DonationFormEditDonationStepNumberMode.HideNumbers}
      ></donation-form-edit-donation>
    `)) as DonationFormEditDonation;

    const sections = el.shadowRoot?.querySelectorAll('donation-form-section');
    expect(sections?.length).to.equal(2);
    sections?.forEach(section => {
      expect((section as DonationFormSection).badgeMode).to.equal(
        DonationFormSectionBadgeMode.HideBadge,
      );
    });
  });

  it('uses defaultSelectedAmount if provided', async () => {
    const el = await fixture<DonationFormEditDonation>(html`
      <donation-form-edit-donation
        .donationInfo=${new MockDonationInfo()}
        defaultSelectedAmount="8.34"
      ></donation-form-edit-donation>
    `);

    expect(el.donationInfo.amount).to.equal(8.34);
  });

  /**
   * If we have a preset amount that matches the default selected amount, make sure
   * it gets selected and not a custom amount.
   */
  it('selects the proper preset if defaultSelectedAmount and amountOptions set', async () => {
    const el = await fixture<DonationFormEditDonation>(html`
      <donation-form-edit-donation
        .amountOptions=${[2.5, 3.7, 5.45, 20]}
        defaultSelectedAmount="5.45"
      ></donation-form-edit-donation>
    `);

    // Make sure the default amount preset is selected
    const presetToCheck = el.shadowRoot?.querySelector(
      '.amount-selector input[type=radio][value="5.45"]',
    );
    expect((presetToCheck as HTMLInputElement).checked).to.be.true;

    // Make sure the custom amount is not filled in
    const customInput = el.shadowRoot?.querySelector(
      '#custom-amount-input',
    ) as HTMLInputElement;
    expect(customInput?.value).to.equal('');
  });

  describe('configurable dollar amounts', () => {
    it('supports configurable dollar amounts', async () => {
      const el = await fixture<DonationFormEditDonation>(html`
        <donation-form-edit-donation
          .donationInfo=${new MockDonationInfo()}
          .amountOptions=${[2.5, 3.7, 5.45, 20]}
        ></donation-form-edit-donation>
      `);

      const amountList = el.shadowRoot?.querySelectorAll('.amount-selector li');
      expect(amountList?.length).to.equal(5); // 4 amounts + 1 custom
      expect((amountList?.item(0) as HTMLLIElement).innerText).to.equal(
        '$2.50',
      );
      expect((amountList?.item(1) as HTMLLIElement).innerText).to.equal(
        '$3.70',
      );
      expect((amountList?.item(2) as HTMLLIElement).innerText).to.equal(
        '$5.45',
      );
      expect((amountList?.item(3) as HTMLLIElement).innerText).to.equal('$20');
    });

    it('handles proper layout for different amounts', async () => {
      const el = await fixture<DonationFormEditDonation>(html`
        <donation-form-edit-donation
          .donationInfo=${new MockDonationInfo()}
        ></donation-form-edit-donation>
      `);

      const layouts: {
        count: number;
        columns: number;
        customColSpan: number;
      }[] = [
        { count: 3, columns: 2, customColSpan: 1 },
        { count: 4, columns: 3, customColSpan: 2 },
        { count: 5, columns: 4, customColSpan: 3 },
        { count: 6, columns: 4, customColSpan: 2 },
        { count: 7, columns: 5, customColSpan: 3 },
      ];

      for (const layout of layouts) {
        el.amountOptions = Array.from(Array(layout.count).keys());
        await el.updateComplete;
        const colCount = el.style.getPropertyValue(
          '--paymentSelectorAmountColumnCount',
        );
        const customColSpan = el.style.getPropertyValue(
          '--paymentSelectorCustomAmountColSpan',
        );
        expect(colCount).to.equal(`${layout.columns}`);
        expect(customColSpan).to.equal(`${layout.customColSpan}`);
      }
    });
  });
});
