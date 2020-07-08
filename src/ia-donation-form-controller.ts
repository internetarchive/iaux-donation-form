import {
  LitElement,
  html,
  property,
  PropertyValues,
  query,
  TemplateResult,
  customElement,
  unsafeCSS
} from 'lit-element';

import {
  LazyLoaderService,
  LazyLoaderServiceInterface,
} from '@internetarchive/lazy-loader-service';
import { ModalManager } from '@internetarchive/modal-manager';

import { DonationForm } from './donation-form';
import { PaymentClients, PaymentClientsInterface } from './braintree-manager/payment-clients';
import { BraintreeManager } from './braintree-manager/braintree-manager';
import {
  BraintreeEndpointManagerInterface,
  BraintreeManagerInterface,
  HostingEnvironment,
} from './braintree-manager/braintree-interfaces';
import {
  PaymentFlowHandlers,
  PaymentFlowHandlersInterface,
} from './payment-flow-handlers/payment-flow-handlers';

import { RecaptchaManager, RecaptchaManagerInterface } from './recaptcha-manager/recaptcha-manager';
import { HostedFieldConfiguration } from './braintree-manager/payment-providers/credit-card/hosted-field-configuration';
import {
  HostedFieldContainerInterface,
  HostedFieldContainer,
} from './braintree-manager/payment-providers/credit-card/hosted-field-container';

import creditCardImg from './assets/img/contact-form-icons/ccard';
import calendarImg from './assets/img/contact-form-icons/calendar';
import lockImg from './assets/img/contact-form-icons/lock';

/**
 * The IADonationFormController is an IA-specific bridge between petabox
 * and the `<donation-form>` element.
 *
 * It handles all of the interactions between the various pieces that the
 * donation form.
 *
 * @export
 * @class RadioPlayerController
 * @extends {LitElement}
 */
@customElement('ia-donation-form-controller')
export class IADonationFormController extends LitElement {
  @property({ type: String }) environment: HostingEnvironment = HostingEnvironment.Development;

  @property({ type: String }) braintreeAuthToken?: string;

  @property({ type: String }) recaptchaSiteKey?: string;

  @property({ type: String }) venmoProfileId?: string;

  @property({ type: String }) googlePayMerchantId?: string;

  @property({ type: String }) analyticsCategory = 'DonationForm';

  @property({ type: Object }) endpointManager?: BraintreeEndpointManagerInterface;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @property({ type: Object }) analyticsHandler?: any;

  @property({ type: Object }) private braintreeManager?: BraintreeManagerInterface;

  @property({ type: Object }) private recaptchaManager?: RecaptchaManagerInterface;

  @property({ type: Object }) private paymentFlowHandlers?: PaymentFlowHandlersInterface;

  @query('modal-manager') private modalManager!: ModalManager;

  @query('donation-form') private donationForm!: DonationForm;

  @query('#recaptcha') private recaptcha!: HTMLElement;

  @query('#braintree-creditcard') private braintreeNumberInput!: HTMLInputElement;

  @query('#braintree-cvv') private braintreeCVVInput!: HTMLInputElement;

  @query('#braintree-expiration') private braintreeExpirationDateInput!: HTMLInputElement;

  private lazyLoaderService: LazyLoaderServiceInterface = new LazyLoaderService();

  private paymentClients: PaymentClientsInterface = new PaymentClients(
    this.lazyLoaderService,
    this.environment,
  );

  /** @inheritdoc */
  updated(changedProperties: PropertyValues): void {
    console.debug('updated', changedProperties);
    if (
      changedProperties.has('braintreeAuthToken') ||
      (changedProperties.has('endpointManager') && this.braintreeManager === undefined)
    ) {
      this.setupBraintreeManager();
    }

    if (changedProperties.has('recaptchaSiteKey') && this.recaptchaSiteKey) {
      this.recaptchaManager = new RecaptchaManager({
        grecaptchaLibrary: window.grecaptcha,
        siteKey: this.recaptchaSiteKey,
      });
    }

    if (changedProperties.has('braintreeManager') || changedProperties.has('recaptchaManager')) {
      if (this.braintreeManager && this.recaptchaManager) {
        this.setupPaymentFlowHandlers();
      }
    }
  }

  private setupBraintreeManager(): void {
    if (this.braintreeAuthToken && this.endpointManager) {
      this.braintreeManager = new BraintreeManager({
        paymentClients: this.paymentClients,
        endpointManager: this.endpointManager,
        authorizationToken: this.braintreeAuthToken,
        venmoProfileId: this.venmoProfileId,
        googlePayMerchantId: this.googlePayMerchantId,
        hostedFieldConfig: this.hostedFieldConfig,
        hostingEnvironment: HostingEnvironment.Development,
      });
    }
  }

  private setupPaymentFlowHandlers(): void {
    if (!this.braintreeManager || !this.recaptchaManager) {
      return;
    }

    this.paymentFlowHandlers = new PaymentFlowHandlers({
      braintreeManager: this.braintreeManager,
      modalManager: this.modalManager,
      recaptchaManager: this.recaptchaManager,
    });

    this.donationForm.braintreeManager = this.braintreeManager;
    this.donationForm.paymentFlowHandlers = this.paymentFlowHandlers;

    this.recaptchaManager.setup(this.recaptcha, 1, 'light', 'image');
    this.braintreeManager.startup();
    this.paymentFlowHandlers.startup();
  }

  private get hostedFieldConfig(): HostedFieldConfiguration {
    const hostedFieldStyle: object = {
      input: {
        'font-size': '14px',
        'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
        'font-weight': '700',
        color: '#333',
      },
      ':focus': {
        color: '#333',
      },
      '.valid': {},
      '.invalid': {
        color: '#b00b00',
      },
    };

    const hostedFieldFieldOptions: braintree.HostedFieldFieldOptions = {
      number: {
        selector: '#braintree-creditcard',
        placeholder: 'Card number',
      },
      cvv: {
        selector: '#braintree-cvv',
        placeholder: 'CVC',
      },
      expirationDate: {
        selector: '#braintree-expiration',
        placeholder: 'MM / YY',
      },
    };

    const hostedFieldContainer: HostedFieldContainerInterface = new HostedFieldContainer({
      number: this.braintreeNumberInput,
      cvv: this.braintreeCVVInput,
      expirationDate: this.braintreeExpirationDateInput,
    });

    const config: HostedFieldConfiguration = new HostedFieldConfiguration({
      hostedFieldStyle,
      hostedFieldFieldOptions,
      hostedFieldContainer,
    });

    return config;
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

      <donation-form .braintreeManager=${this.braintreeManager}>
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

        donation-form:focus {
          outline: none;
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
          padding-left: 2rem;
          background-position: 0.75rem 50%;
          background-repeat: no-repeat;
          background-size: auto 12px;
        }

        .braintree-input-wrapper.error {
          border-color: red;
        }

        .braintree-input {
          height: 25px;
        }

        .braintree-input-wrapper.creditcard {
          background-image: url('${unsafeCSS(creditCardImg)}')
        }

        .braintree-input-wrapper.expiration {
          background-image: url('${unsafeCSS(calendarImg)}')
        }

        .braintree-input-wrapper.cvv {
          background-image: url('${unsafeCSS(lockImg)}')
        }
      </style>
    `;
  }

  private bodyStyleOverflow?: string;
  private bodyStyleTransition?: string;

  private modalModeChanged(e: CustomEvent): void {
    console.debug('modalModeChanged', e);
    const mode = e.detail.mode;
    switch (mode) {
      case 'modal':
        this.bodyStyleOverflow = document.body.style.overflow;
        this.bodyStyleTransition = document.body.style.transition;

        document.body.style.transition = 'none';
        document.body.style.overflow = 'hidden';
        break;
      case 'closed':
        document.body.style.overflow = this.bodyStyleOverflow ?? 'auto';
        document.body.style.transition = this.bodyStyleTransition ?? 'none';
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
  private logEvent(name: string, params: object): void {
    this.analyticsHandler?.sendEvent(
      this.analyticsCategory,
      name,
      window.location.pathname,
      params,
    );
  }
}
