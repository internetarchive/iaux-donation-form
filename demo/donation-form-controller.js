import { LitElement, html } from 'lit-element';

// import AnalyticsHandler from '../../analyticsHandler/analyticsHandler.js';

import { LazyLoaderService } from '@internetarchive/lazy-loader-service';
import '@internetarchive/modal-manager';

import { BraintreeEndpointManager } from './braintree-endpoint-manager.js';

import { DonationForm } from '../lib/donation-form.js';

import { PaymentClients } from '../lib/braintree-manager/payment-clients.js';
import { BraintreeManager } from '../lib/braintree-manager/braintree-manager.js';
import { PaymentFlowHandlers } from '../lib/payment-flow-handlers/payment-flow-handlers.js';
import { RecaptchaManager } from '../lib/recaptcha-manager/recaptcha-manager.js';

/**
 * The RadioPlayerController is the bridge between petabox and the radio player UI widget
 *
 * It is responsible for fetching metadata and transcript and passing them into
 * the radio player UI.
 *
 * @export
 * @class RadioPlayerController
 * @extends {LitElement}
 */
export default class DonationFormController extends LitElement {
  static get properties() {
    return {
      braintreeAuthToken: { type: String },
      recaptchaSiteKey: { type: String },
      venmoProfileId: { type: String },
      googlePayMerchantId: { type: String },

      braintreeManager: { type: Object },
      recaptchaManager: { type: Object },
      paymentFlowHandlers: { type: Object }
    };
  }

  constructor() {
    super();
    // this.analyticsHandler = new AnalyticsHandler();
    this.lazyLoaderService = new LazyLoaderService();
    this.endpointManager = new BraintreeEndpointManager();
    this.paymentClients = new PaymentClients(this.lazyLoaderService);
  }

  /** @inheritdoc */
  firstUpdated() {
  }

  /** @inheritdoc */
  updated(changedProperties) {
    if (changedProperties.has('braintreeAuthToken')) {
      console.debug('this.hostedFieldConfig', this.hostedFieldConfig);
      this.braintreeManager = new BraintreeManager({
        paymentClients: this.paymentClients,
        endpointManager: this.endpointManager,
        authorizationToken: this.braintreeAuthToken,
        venmoProfileId: this.venmoProfileId,
        googlePayMerchantId: this.googlePayMerchantId,
        hostedFieldStyle: this.hostedFieldStyle,
        hostedFieldConfig: this.hostedFieldConfig,
        hostingEnvironment: 'dev'
      });
    }

    if (changedProperties.has('recaptchaSiteKey')) {
      this.recaptchaManager = new RecaptchaManager({
        grecaptchaLibrary: window.grecaptcha,
        siteKey: this.recaptchaSiteKey
      });
    }

    if (changedProperties.has('braintreeManager') || changedProperties.has('recaptchaManager')) {
      if (this.braintreeManager && this.recaptchaManager) {
        this.setupPaymentFlowHandlers();
      }
    }
  }

  setupPaymentFlowHandlers() {
    const modalManager = document.querySelector('modal-manager');

    this.paymentFlowHandlers = new PaymentFlowHandlers({
      braintreeManager: this.braintreeManager,
      modalManager: modalManager,
      recaptchaManager: this.recaptchaManager
    });

    const recaptchaContainer = document.getElementById('recaptcha');
    const donationForm = document.querySelector('donation-form');

    donationForm.braintreeManager = this.braintreeManager;
    donationForm.modalManager = modalManager;
    donationForm.paymentFlowHandlers = this.paymentFlowHandlers;

    console.debug('setup recaptcha', window.grecaptcha.render);

    this.recaptchaManager.setup({ container: recaptchaContainer, theme: 'light', type: 'image' });
    this.braintreeManager.startup();
    this.paymentFlowHandlers.startup();
  }

  static get analyticsCategory() {
    return 'DonationForm';
  }

  get hostedFieldStyle() {
    return {
      input: {
        'font-size': '14px',
        'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
        'font-weight': '700',
        color: '#333',
      },
      ':focus': {
        color: '#333',
      },
      '.valid': {
      },
      '.invalid': {
        color: '#b00b00',
      }
    };
  }

  get hostedFieldConfig() {
    return {
      number: {
        selector: '#braintree-creditcard',
        placeholder: 'Card number'
      },
      cvv: {
        selector: '#braintree-cvv',
        placeholder: 'CVC'
      },
      expirationDate: {
        selector: '#braintree-expiration',
        placeholder: 'MM / YY'
      }
    }
  }

  /** @inheritdoc */
  render() {
    return html`
      <modal-manager @modeChanged=${this.modalModeChanged}>
        <!--
          The PayPal buttons cannot exist in the shadowDOM so they have to be slotted
          from the top.
        -->
        <div slot="paypal-upsell-button">
          <div id="paypal-upsell-button"></div>
        </div>
      </modal-manager>

      <div id="recaptcha"></div>

      <donation-form
        .braintreeManager=${this.braintreeManager}>

        <!--
          Why are these slots here?

          Due to the way Braintree & PayPal works, they cannot exist
          in the shadowDOM so must exist in the clearDOM and get passed
          in through a <slot>. Their IDs are tied to the hostedFieldConfig
          configuration above.

          Braintree / PayPal are working on a solution to this. See:
          - https://github.com/braintree/braintree-web-drop-in/issues/614#issuecomment-616796104
          - https://github.com/braintree/braintree-web-drop-in/issues/296#issuecomment-616749307
          - https://github.com/paypal/paypal-checkout-components/issues/353#issuecomment-595956216
        -->
        <div slot="braintree-hosted-fields">
          <div class="braintree-row">
            <div class="braintree-input-wrapper creditcard">
              <div class="braintree-input" id="braintree-creditcard"></div>
            </div>
          </div>
          <div class="braintree-row">
            <div class="braintree-input-wrapper expiration">
              <div class="braintree-input" id="braintree-expiration"></div>
            </div>
            <div class="braintree-input-wrapper cvv">
              <div class="braintree-input" id="braintree-cvv"></div>
            </div>
          </div>
        </div>

        <div slot="paypal-button">
          <div id="paypal-button"></div>
        </div>
      </donation-form>

      <style>
        modal-manager {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 250; /* the PayPal button starts off at 200, then drops down to 100 so this is just staying above it */
        }

        modal-manager[mode='closed'] {
          display: none;
        }

        modal-manager[mode='modal'] {
          display: block;
        }

        #paypal-button {
          opacity: 0.001;
          width: 50px;
          height: 32px;
          overflow: hidden;
        }

        .braintree-row {
          display: flex;
        }

        .braintree-input-wrapper {
          width: 100%;
          border: 1px solid #d9d9d9;
          border-top: 0;
          padding-left: 2rem;
        }

        .braintree-input-wrapper.creditcard {
          border-top: 1px solid #d9d9d9;
        }

        .braintree-input-wrapper.cvv {
          border-left: 0;
        }

        .braintree-input {
          height: 25px;
        }

      </style>
    `;
  }

  modalModeChanged(e) {
    console.debug('modalModeChanged', e);
    const mode = e.detail.mode;
    switch (mode) {
      case 'modal':
        document.body.style.overflow = 'hidden';
        break;
      case 'closed':
        document.body.style.overflow = 'auto';
        break;
      default:
        break;
    }
  }

  /** @inheritdoc */
  createRenderRoot() {
    // Render template without shadow DOM. Note that shadow DOM features like
    // encapsulated CSS and slots are unavailable.
    // We have to do this to accomodate the PayPal buttons and HostedFields,
    // which do not work in the shadow DOM
    return this;
  }

  /**
   * Log an event
   *
   * @param {string} name Name of event
   * @param {object} params Additional tracking parameters
   */
  logEvent(name, params = {}) {
    // this.analyticsHandler.sendEvent(
    //   DonationFormController.analyticsCategory, name, window.location.pathname, params,
    // );
  }
}

customElements.define('donation-form-controller', DonationFormController);
