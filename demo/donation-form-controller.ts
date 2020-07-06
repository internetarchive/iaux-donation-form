import { LitElement, html, property, PropertyValues, query, TemplateResult } from 'lit-element';

// import AnalyticsHandler from '../../analyticsHandler/analyticsHandler.js';

import { LazyLoaderService, LazyLoaderServiceInterface } from '@internetarchive/lazy-loader-service';
import { ModalManager } from '@internetarchive/modal-manager';

import { BraintreeEndpointManager } from './braintree-endpoint-manager.js';

import { DonationForm, PaymentClients, BraintreeManager, PaymentFlowHandlers, RecaptchaManager,
  PaymentClientsInterface,
  BraintreeManagerInterface,
  BraintreeEndpointManagerInterface,
  HostingEnvironment,
  RecaptchaManagerInterface,
  PaymentFlowHandlersInterface
} from '../index';

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

  @property({ type: String }) braintreeAuthToken?: string;

  @property({ type: String }) recaptchaSiteKey?: string;

  @property({ type: String }) venmoProfileId?: string;

  @property({ type: String }) googlePayMerchantId?: string;

  @property({ type: Object }) braintreeManager?: BraintreeManagerInterface;

  @property({ type: Object }) recaptchaManager?: RecaptchaManagerInterface;

  @property({ type: Object }) paymentFlowHandlers?: PaymentFlowHandlersInterface;

  @query('modal-manager') modalManager!: ModalManager;

  @query('donation-form') donationForm!: DonationForm;

  @query('#recaptcha') recaptcha!: HTMLElement;

  private lazyLoaderService: LazyLoaderServiceInterface = new LazyLoaderService();

  private endpointManager: BraintreeEndpointManagerInterface = new BraintreeEndpointManager();

  private paymentClients: PaymentClientsInterface  = new PaymentClients(
    this.lazyLoaderService, HostingEnvironment.Development);

  /** @inheritdoc */
  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('braintreeAuthToken') && this.braintreeAuthToken) {
      console.debug('this.hostedFieldConfig', this.hostedFieldConfig);
      this.braintreeManager = new BraintreeManager({
        paymentClients: this.paymentClients,
        endpointManager: this.endpointManager,
        authorizationToken: this.braintreeAuthToken,
        venmoProfileId: this.venmoProfileId,
        googlePayMerchantId: this.googlePayMerchantId,
        hostedFieldStyle: this.hostedFieldStyle,
        hostedFieldConfig: this.hostedFieldConfig,
        hostingEnvironment: HostingEnvironment.Development
      });
    }

    if (changedProperties.has('recaptchaSiteKey') && this.recaptchaSiteKey) {
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

  setupPaymentFlowHandlers(): void {
    if (!this.braintreeManager || !this.recaptchaManager) { return; }

    this.paymentFlowHandlers = new PaymentFlowHandlers({
      braintreeManager: this.braintreeManager,
      modalManager: this.modalManager,
      recaptchaManager: this.recaptchaManager
    });

    this.donationForm.braintreeManager = this.braintreeManager;
    this.donationForm.paymentFlowHandlers = this.paymentFlowHandlers;

    this.recaptchaManager.setup(this.recaptcha, 1, 'light', 'image');
    this.braintreeManager.startup();
    this.paymentFlowHandlers.startup();
  }

  static get analyticsCategory(): string {
    return 'DonationForm';
  }

  get hostedFieldStyle(): object {
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

  get hostedFieldConfig(): braintree.HostedFieldFieldOptions {
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
  render(): TemplateResult {
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

      <donation-form
        .braintreeManager=${this.braintreeManager}>

        <!--
          Why are these slots here?

          Due to the way Braintree, PayPal, and Recaptcha work, they cannot exist
          in the shadowDOM so must exist in the clearDOM and get passed
          in through a <slot>.

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

        <div slot="recaptcha">
          <div id="recaptcha"></div>
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

  modalModeChanged(e: CustomEvent): void {
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
  createRenderRoot(): this {
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
  logEvent(): void {
    // this.analyticsHandler.sendEvent(
    //   DonationFormController.analyticsCategory, name, window.location.pathname, params,
    // );
  }
}

customElements.define('donation-form-controller', DonationFormController);
