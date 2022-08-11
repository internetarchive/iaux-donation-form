import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import applePayButtonImage from '@internetarchive/icon-applepay';
import googlePayButtonImage from '@internetarchive/icon-googlepay';
import paypalButtonImage from '@internetarchive/icon-paypal';
import venmoButtonImage from '@internetarchive/icon-venmo';
import { PaymentProvidersInterface } from '../braintree-manager/payment-providers-interface';

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
          : 'donation-info-invalid'}
          "
      >
        <div class="payment-provider-container">
          <button
            class="applepay provider-button ${this.applePayMode}"
            @click=${this.applePaySelected}
            tabindex="0"
          >
            <div class="payment-image">${applePayButtonImage}</div>
          </button>

          <button
            class="googlepay provider-button ${this.googlePayMode}"
            @click=${this.googlePaySelected}
            tabindex="0"
          >
            <div class="payment-image">${googlePayButtonImage}</div>
          </button>

          <button
            class="venmo provider-button ${this.venmoMode}"
            @click=${this.venmoSelected}
            tabindex="0"
          >
            <div class="payment-image">${venmoButtonImage}</div>
          </button>

          <div class="paypal-container provider-button ${this.payPalMode}" tabindex="0">
            <div class="payment-image">
              <div class="paypal-local-button" @click=${this.localPaypalButtonClicked}>
                ${paypalButtonImage}
              </div>
              <slot name="paypal-button"></slot>
            </div>
          </div>
        </div>

        <div class="credit-card-container">
          <button
            @click=${this.creditCardSelected}
            class="button-style credit-card-button"
            tabindex="0"
          >
            <div class="cc-title">Credit Card</div>
            <div class="cc-background"></div>
          </button>
        </div>
      </div>
    `;
  }

  /** @inheritdoc */
  firstUpdated(): void {
    this.dispatchEvent(new Event('firstUpdated'));
  }

  /** @inheritdoc */
  updated(changed: PropertyValues): void {
    if (changed.has('paymentProviders')) {
      this.setButtonVisibility();
    }
  }

  showPaypalButton(): void {
    this.payPalMode = PaymentButtonMode.Available;
  }

  private async setButtonVisibility(): Promise<void> {
    this.paymentProviders?.venmoHandler
      .get()
      .then(handler => {
        if (!handler) {
          this.venmoMode = PaymentButtonMode.Unavailable;
          return;
        }

        handler
          .isBrowserSupported()
          .then(supported => {
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

    this.paymentProviders?.applePayHandler
      .get()
      .then(handler => {
        if (!handler) {
          console.error('applePayHandler unavailable');
          this.applePayMode = PaymentButtonMode.Unavailable;
          return;
        }

        handler
          .isAvailable()
          .then(supported => {
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

    this.paymentProviders?.googlePayHandler
      .get()
      .then(handler => {
        if (!handler) {
          console.error('google pay handler unavailable');
          this.googlePayMode = PaymentButtonMode.Unavailable;
          return;
        }

        handler
          .isBrowserSupported()
          .then(supported => {
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
    const paymentButtonWidthCss = css`var(--paymentButtonWidth, 5rem)`;
    const paymentButtonHeightCss = css`var(--paymentButtonHeight, 3.2rem)`;
    const creditCardFontSizeCss = css`var(--creditCardFontSize, 1.8rem)`;

    return css`
      button {
        color: inherit;
        font-family: inherit;
      }

      .payment-container {
        width: 100%;
      }

      .payment-provider-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-gap: 1rem;
        margin-bottom: 1rem;
        max-width: 23rem;
      }

      .provider-button {
        border: 0;
        padding: 0;
        background: none;
        cursor: pointer;
        width: ${paymentButtonWidthCss};
        height: ${paymentButtonHeightCss};
      }

      .provider-button.unavailable {
        display: none;
      }

      .provider-button.loading {
        border: 1px solid #ddd;
        border-radius: 2px;
        /* account for the borders that don't exist once the provider loads, otherwise the layout shifts */
        margin-bottom: -2px;
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
        color: var(--ccButtonFontColor, #333);
        background-color: var(--ccButtonColor, white);
        border: 1px solid #333;
        border-radius: 4px;
        cursor: pointer;
        margin: 0;
        padding: 0.7rem 1rem;
        width: 100%;
      }

      .credit-card-button .cc-background {
        height: 2.4rem;
        width: 100%;
        background-repeat: no-repeat;
        background-image: url(https://archive.org/images/cc_logos.png);
        background-position: 50% 50%;
        background-size: contain;
      }

      .credit-card-button .cc-title {
        font-size: ${creditCardFontSizeCss};
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
    `;
  }
}
