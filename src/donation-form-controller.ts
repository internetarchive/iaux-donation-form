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

import './form-elements/badged-input';

import creditCardImg from '@internetarchive/icon-credit-card';
import calendarImg from '@internetarchive/icon-calendar';
import lockImg from '@internetarchive/icon-lock';
import { AnalyticsHandlerInterface } from './@types/analytics-handler';
import { DonationPaymentInfo } from './models/donation-info/donation-payment-info';
import { DonationType } from './models/donation-info/donation-type';

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
  @property({ type: String }) environment?: HostingEnvironment;

  @property({ type: String }) braintreeAuthToken?: string;

  @property({ type: String }) recaptchaSiteKey?: string;

  @property({ type: String }) venmoProfileId?: string;

  @property({ type: String }) googlePayMerchantId?: string;

  @property({ type: String }) analyticsCategory = 'DonationForm';

  @property({ type: String }) referrer?: string;

  @property({ type: String }) loggedInUser?: string;

  @property({ type: Object }) endpointManager?: BraintreeEndpointManagerInterface;

  @property({ type: Object }) analyticsHandler?: AnalyticsHandlerInterface;

  @property({ type: Object }) modalManager?: ModalManagerInterface;

  @property({ type: Object }) recaptchaElement?: HTMLElement;

  @property({ type: Object }) private braintreeManager?: BraintreeManagerInterface;

  @property({ type: Object }) private recaptchaManager?: RecaptchaManagerInterface;

  @property({ type: Object }) private paymentFlowHandlers?: PaymentFlowHandlersInterface;

  @property({ type: Object }) private paymentClients?: PaymentClientsInterface;

  @query('donation-form') private donationForm!: DonationForm;

  @query('#braintree-creditcard') private braintreeNumberInput!: HTMLInputElement;

  @query('#braintree-cvv') private braintreeCVVInput!: HTMLInputElement;

  @query('#braintree-expiration') private braintreeExpirationDateInput!: HTMLInputElement;

  @query('#braintree-error-message') private braintreeErrorMessage!: HTMLDivElement;

  private lazyLoaderService: LazyLoaderServiceInterface = new LazyLoaderService();

  /** @inheritdoc */
  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('referrer') && this.referrer) {
      this.braintreeManager?.setReferrer(this.referrer);
    }

    if (changedProperties.has('loggedInUser') && this.loggedInUser) {
      this.braintreeManager?.setLoggedInUser(this.loggedInUser);
    }

    if (
      this.braintreeManager === undefined &&
      (changedProperties.has('paymentClients') ||
        changedProperties.has('braintreeAuthToken') ||
        changedProperties.has('endpointManager') ||
        changedProperties.has('environment'))
    ) {
      this.setupBraintreeManager();
    }

    if (changedProperties.has('recaptchaSiteKey') && this.recaptchaSiteKey) {
      this.recaptchaManager = new RecaptchaManager({
        grecaptchaLibrary: window.grecaptcha,
        siteKey: this.recaptchaSiteKey,
      });
    }

    if (
      changedProperties.has('braintreeManager') ||
      changedProperties.has('recaptchaManager') ||
      changedProperties.has('modalManager') ||
      changedProperties.has('recaptchaElement')
    ) {
      this.setupPaymentFlowHandlers();
    }

    if (changedProperties.has('environment') && this.environment) {
      this.paymentClients = new PaymentClients(this.lazyLoaderService, this.environment);
    }
  }

  private setupBraintreeManager(): void {
    if (
      this.braintreeAuthToken &&
      this.endpointManager &&
      this.paymentClients &&
      this.environment
    ) {
      this.braintreeManager = new BraintreeManager({
        paymentClients: this.paymentClients,
        endpointManager: this.endpointManager,
        authorizationToken: this.braintreeAuthToken,
        venmoProfileId: this.venmoProfileId,
        googlePayMerchantId: this.googlePayMerchantId,
        hostedFieldConfig: this.hostedFieldConfig,
        hostingEnvironment: this.environment,
        referrer: this.referrer,
        loggedInUser: this.loggedInUser,
      });
    }
  }

  /** @inheritdoc */
  firstUpdated(): void {
    this.readQueryParams();
  }

  private readQueryParams(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const frequencyParam = urlParams.get('frequency');
    const amountParam = urlParams.get('amount');
    const coverFeesParam = urlParams.get('coverFees');

    if (!frequencyParam && !amountParam && !coverFeesParam) {
      return;
    }

    let frequency = DonationType.OneTime;
    if (frequencyParam === 'monthly') {
      frequency = DonationType.Monthly;
    }

    let amount = this.defaultDonationInfo.amount;
    if (amountParam) {
      const parsedAmount = parseFloat(amountParam);
      if (!isNaN(parsedAmount)) {
        amount = parsedAmount;
      }
    }

    const donationInfo = new DonationPaymentInfo({
      donationType: frequency,
      amount: amount,
      coverFees: coverFeesParam === 'true',
    });

    this.donationForm.donationInfo = donationInfo;
  }

  private setupPaymentFlowHandlers(): void {
    // only set up once
    if (this.paymentFlowHandlers) {
      return;
    }

    // verify we have all of the dependencies
    if (
      !this.braintreeManager ||
      !this.recaptchaManager ||
      !this.modalManager ||
      !this.recaptchaElement
    ) {
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
      errorContainer: this.braintreeErrorMessage,
    });

    const config: HostedFieldConfiguration = new HostedFieldConfiguration({
      hostedFieldStyle,
      hostedFieldFieldOptions,
      hostedFieldContainer,
    });

    return config;
  }

  private defaultDonationInfo: DonationPaymentInfo = new DonationPaymentInfo({
    donationType: DonationType.OneTime,
    amount: 5,
    coverFees: false,
  });

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div class="donation-form-controller-container">
        <donation-form
          .donationInfo=${this.defaultDonationInfo}
          .environment=${this.environment}
          .braintreeManager=${this.braintreeManager}
        >
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
            <div id="braintree-error-message"></div>
            <div class="braintree-row">
              <badged-input .icon=${creditCardImg} class="creditcard">
                <div class="braintree-input" id="braintree-creditcard"></div>
              </badged-input>
            </div>
            <div class="braintree-row">
              <badged-input .icon=${calendarImg} class="expiration">
                <div class="braintree-input" id="braintree-expiration"></div>
              </badged-input>
              <badged-input .icon=${lockImg} class="cvv">
                <div class="braintree-input" id="braintree-cvv"></div>
              </badged-input>
            </div>
          </div>

          <div slot="paypal-button">
            <div id="paypal-button"></div>
          </div>

          <slot name="recaptcha" slot="recaptcha"> </slot>
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
          width: 5rem;
          height: 3rem;
          overflow: hidden;
        }

        .donation-form-controller-container .braintree-row {
          display: flex;
        }

        .donation-form-controller-container badged-input {
          width: 100%;
        }

        .donation-form-controller-container .braintree-input {
          width: 100%;
        }

        .donation-form-controller-container #braintree-error-message {
          color: red;
          font-size: 1.4rem;
          margin-bottom: 0.6rem;
        }
      </style>
    `;
  }
}
