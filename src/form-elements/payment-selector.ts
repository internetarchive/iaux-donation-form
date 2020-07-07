import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
  PropertyValues,
} from 'lit-element';

import applePayButtonImage from '../assets/img/payment-providers/applepay';
import googlePayButtonImage from '../assets/img/payment-providers/googlepay';
import paypalButtonImage from '../assets/img/payment-providers/paypal';
import venmoButtonImage from '../assets/img/payment-providers/venmo';
import { PaymentProvidersInterface } from '../braintree-manager/payment-providers';

enum PaymentButtonMode {
  Loading = 'loading',
  Available = 'available',
  Unavailable = 'unavailable',
}

@customElement('payment-selector')
export class PaymentSelector extends LitElement {
  @property({ type: Boolean }) donationInfoValid = true;

  @property({ type: Object }) paymentProviders?: PaymentProvidersInterface;

  @property({ type: String }) private applePayMode: PaymentButtonMode = PaymentButtonMode.Loading;

  @property({ type: String }) private googlePayMode: PaymentButtonMode = PaymentButtonMode.Loading;

  @property({ type: String }) private venmoMode: PaymentButtonMode = PaymentButtonMode.Loading;

  @property({ type: String }) private payPalMode: PaymentButtonMode = PaymentButtonMode.Loading;

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div
        class="payment-container ${this.donationInfoValid
          ? 'donation-info-valid'
          : 'donation-info-invalid'}"
      >
        <div class="applepay provider-button ${this.applePayMode}" @click=${this.applePaySelected}>
          <div class="payment-image">${applePayButtonImage}</div>
        </div>

        <div
          class="googlepay provider-button ${this.googlePayMode}"
          @click=${this.googlePaySelected}
        >
          <div class="payment-image">${googlePayButtonImage}</div>
        </div>

        <div class="venmo provider-button ${this.venmoMode}" @click=${this.venmoSelected}>
          <div class="payment-image">${venmoButtonImage}</div>
        </div>

        <div class="paypal-container provider-button ${this.payPalMode}">
          <div class="payment-image">
            <div class="paypal-local-button" @click=${this.localPaypalButtonClicked}>
              ${paypalButtonImage}
            </div>
            <slot name="paypal-button"></slot>
          </div>
        </div>

        <button @click=${this.creditCardSelected} class="button-style credit-card-button">
          <div class="cc-background">
            <span class="cc-title">Credit Card</span>
          </div>
        </button>
      </div>
    `;
  }

  /** @inheritdoc */
  firstUpdated(): void {
    this.dispatchEvent(new Event('firstUpdated'));
  }

  /** @inheritdoc */
  updated(changed: PropertyValues): void {
    console.debug('updated', changed);
    if (changed.has('paymentProviders')) {
      this.setButtonVisibility();
    }
  }

  showPaypalButton(): void {
    this.payPalMode = PaymentButtonMode.Available;
  }

  private async setButtonVisibility(): Promise<void> {
    console.debug('setButtonVisibility');

    this.paymentProviders
      ?.getVenmoHandler()
      .then(handler => {
        console.debug('getVenmo inside');
        if (!handler) {
          console.debug('venmo handler unavailable');
          this.venmoMode = PaymentButtonMode.Unavailable;
          return;
        }

        handler
          .isBrowserSupported()
          .then(supported => {
            console.debug('venmo: isBrowserSupporter', supported);
            this.venmoMode = supported
              ? PaymentButtonMode.Available
              : PaymentButtonMode.Unavailable;
          })
          .catch(reason => {
            console.error('error loading venmo', reason);
            this.venmoMode = PaymentButtonMode.Unavailable;
          });
      })
      .catch(reason => {
        console.error('venmo unavailable', reason);
        this.venmoMode = PaymentButtonMode.Unavailable;
      });

    this.paymentProviders
      ?.getApplePayHandler()
      .then(handler => {
        console.debug('getApplePayHandler inside');
        if (!handler) {
          console.error('applePayHandler unavailable');
          this.applePayMode = PaymentButtonMode.Unavailable;
          return;
        }

        handler
          .isAvailable()
          .then(supported => {
            console.debug('applePay: isAvailable', supported);
            this.applePayMode = supported
              ? PaymentButtonMode.Available
              : PaymentButtonMode.Unavailable;
          })
          .catch(reason => {
            console.error('error loading applepay', reason);
            this.applePayMode = PaymentButtonMode.Unavailable;
          });
      })
      .catch(reason => {
        console.error('apple pay unavailable', reason);
        this.applePayMode = PaymentButtonMode.Unavailable;
      });

    this.paymentProviders
      ?.getGooglePayHandler()
      .then(handler => {
        if (!handler) {
          console.debug('google pay handler unavailable');
          this.googlePayMode = PaymentButtonMode.Unavailable;
          return;
        }

        handler
          .isBrowserSupported()
          .then(supported => {
            console.debug('googlePay: isAvailable', supported);
            this.googlePayMode = supported
              ? PaymentButtonMode.Available
              : PaymentButtonMode.Unavailable;
          })
          .catch(reason => {
            console.error('error loading googlepay', reason);
            this.googlePayMode = PaymentButtonMode.Unavailable;
          });
      })
      .catch(reason => {
        console.error('google pay unavailable', reason);
        this.googlePayMode = PaymentButtonMode.Unavailable;
      });
  }

  private googlePaySelected(): void {
    this.dispatchEvent(new Event('googlePaySelected'));
  }

  private applePaySelected(e: Event): void {
    const event = new CustomEvent('applePaySelected', { detail: { originalEvent: e } });
    this.dispatchEvent(event);
  }

  private venmoSelected(): void {
    this.dispatchEvent(new Event('venmoSelected'));
  }

  private creditCardSelected(): void {
    this.dispatchEvent(new Event('creditCardSelected'));
  }

  private localPaypalButtonClicked(): void {
    this.dispatchEvent(new Event('paypalBlockerSelected'));
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    const paymentButtonWidthCss = css`var(--paymentButtonWidth, 50px)`;
    const paymentButtonHeightCss = css`var(--paymentButtonHeight, 32px)`;

    return css`
      .payment-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        column-gap: 1em;
        row-gap: 1em;
      }

      .provider-button {
        cursor: pointer;
        width: ${paymentButtonWidthCss};
        height: ${paymentButtonHeightCss};
        border-radius: 4px;
      }

      .provider-button.unavailable {
        display: none;
      }

      .provider-button.loading {
        border: 1px solid #ddd;
      }

      .provider-button.loading .payment-image {
        display: none;
      }

      .paypal-local-button {
        position: absolute;
        width: ${paymentButtonWidthCss};
        height: ${paymentButtonHeightCss};
      }

      .donation-info-valid .paypal-local-button {
        z-index: 0;
      }

      .donation-info-invalid .paypal-local-button {
        z-index: 250;
      }

      .credit-card-button {
        grid-column-start: 1;
        grid-column-end: 5;

        background-color: white;
        border: 1px solid #333;
        border-radius: 4px;
        height: ${paymentButtonHeightCss};
        cursor: pointer;
        margin: 0;
        padding: 3px 6px;
      }

      .credit-card-button .cc-background {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-image: url(https://archive.org/images/cc_logos.png);
        background-position: 50% 50%;
        background-size: contain;
      }

      .credit-card-button .cc-title {
        display: none;
      }
    `;
  }
}
