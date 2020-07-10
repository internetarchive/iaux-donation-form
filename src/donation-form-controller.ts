import {
  LitElement,
  html,
  property,
  PropertyValues,
  query,
  TemplateResult,
  customElement,
} from 'lit-element';

import {
  LazyLoaderService,
  LazyLoaderServiceInterface,
} from '@internetarchive/lazy-loader-service';
import { ModalManagerInterface } from '@internetarchive/modal-manager';

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
import lockImg from './assets/img/lock';
import { AnalyticsHandlerInterface } from './@types/analytics-handler';

/**
 * The DonationFormController orchestrates several of the interactions between
 * the various pieces of the donation form like modals, braintree, paypal, and recaptcha
 *
 * @export
 * @class RadioPlayerController
 * @extends {LitElement}
 */
@customElement('donation-form-controller')
export class DonationFormController extends LitElement {
  @property({ type: String }) environment: HostingEnvironment = HostingEnvironment.Development;

  @property({ type: String }) braintreeAuthToken?: string;

  @property({ type: String }) recaptchaSiteKey?: string;

  @property({ type: String }) venmoProfileId?: string;

  @property({ type: String }) googlePayMerchantId?: string;

  @property({ type: String }) analyticsCategory = 'DonationForm';

  @property({ type: Object }) endpointManager?: BraintreeEndpointManagerInterface;

  @property({ type: Object }) analyticsHandler?: AnalyticsHandlerInterface;

  @property({ type: Object }) modalManager?: ModalManagerInterface;

  @property({ type: Object }) recaptchaElement?: HTMLElement;

  @property({ type: Object }) private braintreeManager?: BraintreeManagerInterface;

  @property({ type: Object }) private recaptchaManager?: RecaptchaManagerInterface;

  @property({ type: Object }) private paymentFlowHandlers?: PaymentFlowHandlersInterface;

  @query('donation-form') private donationForm!: DonationForm;

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

    if (changedProperties.has('braintreeManager') || changedProperties.has('recaptchaManager') || changedProperties.has('modalManager') || changedProperties.has('recaptchaElement')) {
      this.setupPaymentFlowHandlers();
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
    if (!this.braintreeManager || !this.recaptchaManager || !this.modalManager || !this.recaptchaElement) {
      return;
    }

    this.paymentFlowHandlers = new PaymentFlowHandlers({
      braintreeManager: this.braintreeManager,
      modalManager: this.modalManager,
      recaptchaManager: this.recaptchaManager,
    });

    this.donationForm.braintreeManager = this.braintreeManager;
    this.donationForm.paymentFlowHandlers = this.paymentFlowHandlers;

    this.recaptchaManager.setup(this.recaptchaElement, 1, 'light', 'image');
    this.braintreeManager.startup();
    this.paymentFlowHandlers.startup();
  }

  private get hostedFieldConfig(): HostedFieldConfiguration {
    const hostedFieldStyle: object = {
      input: {
        'font-size': '16px',
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
      <div class="donation-form-controller-container">
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
                <div class="icon-container">${creditCardImg}</div>
                <div class="braintree-input" id="braintree-creditcard"></div>
              </div>
            </div>
            <div class="braintree-row">
              <div class="braintree-input-wrapper expiration">
                <div class="icon-container">${calendarImg}</div>
                <div class="braintree-input" id="braintree-expiration"></div>
              </div>
              <div class="braintree-input-wrapper cvv">
                <div class="icon-container">${lockImg}</div>
                <div class="braintree-input" id="braintree-cvv"></div>
              </div>
            </div>
          </div>

          <div slot="paypal-button">
            <div id="paypal-button"></div>
          </div>

          <slot name="recaptcha" slot="recaptcha">
          </slot>
        </donation-form>
      </div>

      ${this.getStyles}
    `;
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

  /**
   * This is not the normal LitElement styles block.
   *
   * This element uses the clear DOM instead of the shadow DOM, it can't use
   * the shadowRoot's isolated styling. This is a bit of a workaround to keep all of
   * the styling local by writing out our own <style> tag and just be careful about
   * the selectors since they will leak outside of this component.
   *
   * @readonly
   * @private
   * @type {TemplateResult}
   * @memberof IADonationFormController
   */
  private get getStyles(): TemplateResult {
    return html`
      <style>
        .donation-form-controller-container donation-form:focus {
          outline: none;
        }

        .donation-form-controller-container #paypal-button {
          opacity: 0.001;
          width: 50px;
          height: 32px;
          overflow: hidden;
        }

        .donation-form-controller-container .braintree-row {
          display: flex;
        }

        .donation-form-controller-container .braintree-input-wrapper {
          width: 100%;
          outline: 1px solid #d9d9d9;
          display: flex;
          height: 35px;
        }

        .donation-form-controller-container .braintree-input-wrapper.error {
          outline-color: red;
        }

        .donation-form-controller-container .braintree-input {
          width: 100%;
        }

        .donation-form-controller-container .braintree-input-wrapper .icon-container {
          width: 2em;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .donation-form-controller-container .braintree-input-wrapper .icon-container svg {
          height: 16px
        }
      </style>
    `;
  }
}
