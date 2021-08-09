import {
  LitElement,
  html,
  property,
  PropertyValues,
  query,
  TemplateResult,
  customElement,
} from 'lit-element';

import currency from 'currency.js';
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
import { ContactForm } from './form-elements/contact-form/contact-form';
import './form-elements/contact-form/contact-form';

import creditCardImg from '@internetarchive/icon-credit-card';
import calendarImg from '@internetarchive/icon-calendar';
import lockImg from '@internetarchive/icon-lock';
import { AnalyticsHandlerInterface } from './@types/analytics-handler';

import {
  DonationPaymentInfo,
  PaymentProvider,
  DonationType,
  defaultDonationAmounts,
} from '@internetarchive/donation-form-data-models';
import { UpsellModalCTAMode } from './modals/upsell-modal-content';

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

  @property({ type: Array }) amountOptions: number[] = defaultDonationAmounts;

  @property({ type: String }) referrer?: string;

  @property({ type: String }) loggedInUser?: string;

  @property({ type: String }) origin?: string;

  @property({ type: Object }) endpointManager?: BraintreeEndpointManagerInterface;

  @property({ type: Object }) analyticsHandler?: AnalyticsHandlerInterface;

  @property({ type: Object }) modalManager?: ModalManagerInterface;

  @property({ type: Object }) recaptchaElement?: HTMLElement;

  @property({ type: Object }) braintreeManager?: BraintreeManagerInterface;

  @property({ type: Object }) recaptchaManager?: RecaptchaManagerInterface;

  @property({ type: Object }) paymentFlowHandlers?: PaymentFlowHandlersInterface;

  @property({ type: Object }) paymentClients?: PaymentClientsInterface;

  @query('donation-form') private donationForm!: DonationForm;

  @query('#braintree-creditcard') private braintreeNumberInput!: HTMLInputElement;

  @query('#braintree-cvv') private braintreeCVVInput!: HTMLInputElement;

  @query('#braintree-expiration') private braintreeExpirationDateInput!: HTMLInputElement;

  @query('#braintree-error-message') private braintreeErrorMessage!: HTMLDivElement;

  @query('contact-form') private contactForm?: ContactForm;

  private lazyLoaderService: LazyLoaderServiceInterface = new LazyLoaderService();

  /** @inheritdoc */
  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('referrer') && this.referrer) {
      this.braintreeManager?.setReferrer(this.referrer);
    }

    if (changedProperties.has('loggedInUser') && this.loggedInUser) {
      this.braintreeManager?.setLoggedInUser(this.loggedInUser);
    }

    if (changedProperties.has('origin') && this.origin) {
      this.braintreeManager?.setOrigin(this.origin);
    }

    if (
      changedProperties.has('paymentClients') ||
      changedProperties.has('braintreeAuthToken') ||
      changedProperties.has('endpointManager') ||
      changedProperties.has('environment')
    ) {
      this.setupBraintreeManager();
      this.setupRecaptchaManager();
    }

    if (changedProperties.has('recaptchaSiteKey')) {
      this.setupRecaptchaManager();
    }

    if (
      changedProperties.has('braintreeManager') ||
      changedProperties.has('recaptchaManager') ||
      changedProperties.has('modalManager') ||
      changedProperties.has('recaptchaElement')
    ) {
      this.setupPaymentFlowHandlers();
    }

    if (changedProperties.has('environment') && this.environment && !this.paymentClients) {
      this.paymentClients = new PaymentClients(this.lazyLoaderService, this.environment);
    }
  }

  async showUpsellModalDev(options: {
    oneTimeAmount: number;
    ctaMode?: UpsellModalCTAMode;
    yesSelected?: (amount: number) => void;
    noSelected?: () => void;
    amountChanged?: (amount: number) => void;
    userClosedModalCallback?: () => void;
  }): Promise<void> {
    this.donationForm.showUpsellModalDev(options);
  }

  private setupBraintreeManager(): void {
    if (
      this.braintreeManager === undefined &&
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
        origin: this.origin,
      });
    }
  }

  private recaptchaManagerSetup = false;

  private async setupRecaptchaManager(): Promise<void> {
    if (!this.recaptchaSiteKey || !this.paymentClients || this.recaptchaManagerSetup) {
      return;
    }
    this.recaptchaManagerSetup = true;
    const grecaptchaLibrary = await this.paymentClients.recaptchaLibrary.get();
    this.recaptchaManager = new RecaptchaManager({
      grecaptchaLibrary: grecaptchaLibrary,
      siteKey: this.recaptchaSiteKey,
    });
  }

  /** @inheritdoc */
  firstUpdated(): void {
    this.setInitialDonationAmount();
    this.trackViewedEvent();
  }

  private setInitialDonationAmount(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const frequencyParam = urlParams.get('contrib_type');
    const amountParam = urlParams.get('amt');
    const coverFeesParam = urlParams.get('coverFees');
    const coverFees = coverFeesParam === 'true';

    let frequency = DonationType.OneTime;
    if (frequencyParam === 'monthly') {
      frequency = DonationType.Monthly;
    }

    let amount = 5;
    if (amountParam) {
      const parsedAmount = currency(amountParam).value;
      if (parsedAmount > 0) {
        amount = parsedAmount;
      }
    }

    const donationInfo = new DonationPaymentInfo({
      donationType: frequency,
      amount: amount,
      coverFees: coverFees,
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

    this.braintreeManager.startup();
    this.paymentFlowHandlers.startup();
    this.recaptchaManager.setup(this.recaptchaElement, 1, 'light', 'image');
  }

  private get hostedFieldConfig(): HostedFieldConfiguration {
    const hostedFieldStyle: Record<string, Record<string, string>> = {
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

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div class="donation-form-controller-container">
        <donation-form
          .environment=${this.environment}
          .braintreeManager=${this.braintreeManager}
          .contactForm=${this.contactForm}
          .amountOptions=${this.amountOptions}
          @donationInfoChanged=${this.donationInfoChanged}
          @paymentProviderSelected=${this.paymentProviderSelected}
          @paymentFlowStarted=${this.paymentFlowStarted}
          @paymentFlowCancelled=${this.paymentFlowCancelled}
          @paymentFlowError=${this.paymentFlowError}
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
              <badged-input .icon=${creditCardImg} ?required=${true} class="creditcard">
                <div class="braintree-input" id="braintree-creditcard"></div>
              </badged-input>
            </div>
            <div class="braintree-row">
              <badged-input .icon=${calendarImg} ?required=${true} class="expiration">
                <div class="braintree-input" id="braintree-expiration"></div>
              </badged-input>
              <badged-input .icon=${lockImg} ?required=${true} class="cvv">
                <div class="braintree-input" id="braintree-cvv"></div>
              </badged-input>
            </div>
          </div>

          <!--
            Form autocompletion does not work in the shadowDOM so
            we slot the contact form in from the lightDOM and pass
            in a reference to it in the <donation-form> tag above
          -->
          <div slot="contact-form">
            <contact-form></contact-form>
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

  private donationInfoChanged(): void {
    this.logEvent('DonationInfoChanged');
  }

  private trackViewedEvent(): void {
    this.logEvent('Viewed');
  }

  private paymentProviderSelected(e: CustomEvent): void {
    const paymentProvider = e.detail.paymentProvider as PaymentProvider;
    const previousPaymentProvider = e.detail.previousPaymentProvider;
    const providerNoSpaces = this.removeSpaces(paymentProvider);
    let eventName = `ProviderFirstSelected-${providerNoSpaces}`;
    let previousProviderInfo;
    if (previousPaymentProvider !== undefined) {
      eventName = `ProviderChangedTo-${providerNoSpaces}`;
      previousProviderInfo = `ProviderChangedFrom-${this.removeSpaces(previousPaymentProvider)}`;
    }
    this.logEvent(eventName, previousProviderInfo);
  }

  private paymentFlowStarted(e: CustomEvent): void {
    const selectedProvider = e.detail.paymentProvider as PaymentProvider;
    const providerNoSpaces = this.removeSpaces(selectedProvider);
    this.logEvent('PaymentFlowStarted', providerNoSpaces);
  }

  private paymentFlowCancelled(e: CustomEvent): void {
    const selectedProvider = e.detail.paymentProvider as PaymentProvider;
    const providerNoSpaces = this.removeSpaces(selectedProvider);
    this.logEvent('PaymentFlowCancelled', providerNoSpaces);
  }

  private paymentFlowError(e: CustomEvent): void {
    const selectedProvider = e.detail.paymentProvider as PaymentProvider;
    const providerNoSpaces = this.removeSpaces(selectedProvider);
    const error = e.detail.error;
    const detail = `${providerNoSpaces}-${error}`;
    this.logEvent('PaymentFlowError', detail);
  }

  private removeSpaces(original: string): string {
    return original.replace(/\s+/g, '');
  }

  /**
   * Log an event
   *
   * @param {string} name Name of event
   * @param {string} label Event label, optional
   */
  private logEvent(name: string, label?: string): void {
    this.analyticsHandler?.send_event(this.analyticsCategory, name, label);
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
          margin-top: -1px;
        }

        .donation-form-controller-container badged-input {
          width: 100%;
        }

        .donation-form-controller-container badged-input.cvv {
          margin-left: -1px;
        }

        .donation-form-controller-container .braintree-input {
          width: 100%;
          height: 100%;
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
