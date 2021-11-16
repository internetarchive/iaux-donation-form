import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import { UpsellModalContent, UpsellModalCTAMode } from '../../../src/modals/upsell-modal-content';
import '../../../src/modals/upsell-modal-content';
import { html as lit2html } from 'lit';

describe('Upsell Modal Content', () => {
  describe('UI Actions', () => {
    it('shows a no button', async () => {
      const el = (await fixture(html`
        <upsell-modal-content></upsell-modal-content>
      `)) as UpsellModalContent;

      const noButton = el.shadowRoot?.querySelector('#no-button');
      expect(noButton).to.exist;
    });

    it('shows the proper yes button for non-paypal types', async () => {
      const el = (await fixture(html`
        <upsell-modal-content .yesButtonMode=${UpsellModalCTAMode.YesButton}></upsell-modal-content>
      `)) as UpsellModalContent;

      const yesButton = el.shadowRoot?.querySelector('#yes-button');
      expect(yesButton).to.exist;
      const payPalSlot = el.shadowRoot?.querySelector('.paypal-upsell-slot-container');
      expect(payPalSlot).to.not.exist;
    });

    it('shows the paypal upsell slot for paypal upsells', async () => {
      const el = (await fixture(html`
        <upsell-modal-content
          .yesButtonMode=${UpsellModalCTAMode.PayPalUpsellSlot}
        ></upsell-modal-content>
      `)) as UpsellModalContent;

      const payPalSlot = el.shadowRoot?.querySelector('.paypal-upsell-slot-container');
      expect(payPalSlot).to.exist;
      const yesButton = el.shadowRoot?.querySelector('#yes-button');
      expect(yesButton).to.not.exist;
    });
  });

  describe('Events Emitted', () => {
    it('emits a `yesSelected` event with the amount when yes is selected', async () => {
      const el = (await fixture(html`
        <upsell-modal-content
          .amount=${7.5}
          .yesButtonMode=${UpsellModalCTAMode.YesButton}
        ></upsell-modal-content>
      `)) as UpsellModalContent;

      const yesButton = el.shadowRoot?.querySelector('#yes-button');
      const clickEvent = new MouseEvent('click');
      setTimeout(() => {
        yesButton?.dispatchEvent(clickEvent);
      });
      const response = await oneEvent(el, 'yesSelected');
      expect(response).to.exist;
      expect(response.detail.amount).to.equal(7.5);
    });

    it('emits a `noThanksSelected` event when no thanks is selected', async () => {
      const el = (await fixture(html`
        <upsell-modal-content></upsell-modal-content>
      `)) as UpsellModalContent;

      const noButton = el.shadowRoot?.querySelector('#no-button');
      const clickEvent = new MouseEvent('click');
      setTimeout(() => {
        noButton?.dispatchEvent(clickEvent);
      });
      const response = await oneEvent(el, 'noThanksSelected');
      expect(response).to.exist;
    });
  });

  describe('Amount Changer', () => {
    it('emits an `amountChanged` event with the amount if change successful', async () => {
      const el = (await fixture(html`
        <upsell-modal-content></upsell-modal-content>
      `)) as UpsellModalContent;

      const amountInput = el.shadowRoot?.querySelector('#amount-input') as HTMLInputElement;
      amountInput.value = '3.50';
      const inputEvent = new Event('input');
      setTimeout(() => {
        amountInput.dispatchEvent(inputEvent);
      });
      const response = await oneEvent(el, 'amountChanged');
      expect(response).to.exist;
      expect(response.detail.amount).to.equal(3.5);
    });

    it('nothing happens if the input is empty', async () => {
      const el = (await fixture(html`
        <upsell-modal-content></upsell-modal-content>
      `)) as UpsellModalContent;

      const amountInput = el.shadowRoot?.querySelector('#amount-input') as HTMLInputElement;
      amountInput.value = '';
      const inputEvent = new Event('input');
      expect(el.error).to.be.undefined;
      amountInput.dispatchEvent(inputEvent);
      await el.updateComplete;
      expect(el.error).to.be.undefined;
    });

    it('shows an error if the amount isNaN', async () => {
      const el = (await fixture(html`
        <upsell-modal-content></upsell-modal-content>
      `)) as UpsellModalContent;

      const amountInput = el.shadowRoot?.querySelector('#amount-input') as HTMLInputElement;
      amountInput.value = 'a';
      const inputEvent = new Event('input');
      const errorDiv = el.shadowRoot?.querySelector('.error');
      expect(el.error).to.be.undefined;
      amountInput.dispatchEvent(inputEvent);
      await el.updateComplete;
      expect(el.error).to.not.be.undefined;
      expect(errorDiv?.innerHTML).to.contain('Please enter a valid amount.');
    });

    it('shows an error if the amount is too low', async () => {
      const el = (await fixture(html`
        <upsell-modal-content></upsell-modal-content>
      `)) as UpsellModalContent;

      const amountInput = el.shadowRoot?.querySelector('#amount-input') as HTMLInputElement;
      amountInput.value = '0.99';
      const inputEvent = new Event('input');
      const errorDiv = el.shadowRoot?.querySelector('.error');
      expect(el.error).to.be.undefined;
      amountInput.dispatchEvent(inputEvent);
      await el.updateComplete;
      expect(el.error).to.not.be.undefined;
      expect(errorDiv?.innerHTML).to.contain('The minimum donation amount is $1');
    });

    it('shows an error if the amount is too high', async () => {
      const el = (await fixture(html`
        <upsell-modal-content></upsell-modal-content>
      `)) as UpsellModalContent;

      const amountInput = el.shadowRoot?.querySelector('#amount-input') as HTMLInputElement;
      amountInput.value = '10000';
      const inputEvent = new Event('input');
      const errorDiv = el.shadowRoot?.querySelector('.error');
      expect(el.error).to.be.undefined;
      amountInput.dispatchEvent(inputEvent);
      await el.updateComplete;
      expect(el.error).to.not.be.undefined;
      expect(errorDiv?.innerHTML).to.contain('To make a donation of $10,000 or more');
    });

    it('shows the paypal blocker if there is an error', async () => {
      const el = (await fixture(html`
        <upsell-modal-content
          .yesButtonMode=${UpsellModalCTAMode.PayPalUpsellSlot}
        ></upsell-modal-content>
      `)) as UpsellModalContent;

      const paypalBlocker = el.shadowRoot?.querySelector(
        '.paypal-upsell-slot-blocker',
      ) as HTMLDivElement;
      expect(el.error).to.be.undefined;
      expect(paypalBlocker.classList.contains('hidden')).to.be.true;
      el.error = lit2html`
        Some error
      `;
      await el.updateComplete;
      expect(el.error).to.not.be.undefined;
      expect(paypalBlocker.classList.contains('hidden')).to.be.false;
    });
  });
});
