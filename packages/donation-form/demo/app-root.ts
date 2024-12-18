// import { LitElement, html, TemplateResult, CSSResultGroup, css } from 'lit';
// import { customElement, query, state } from 'lit/decorators.js';

// import '../src/banner-thermometer';
// import {
//   CurrentAmountMode,
//   DonationBannerThermometer,
//   GoalMessageMode,
// } from '../src/banner-thermometer';
// import { SharedResizeObserver } from '@internetarchive/shared-resize-observer';


import { LitElement, html, TemplateResult, CSSResultGroup, css } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';

// import { DonationPaymentInfo, DonationType } from '@internetarchive/donation-form-data-models';
import { BraintreeEndpointManager } from './braintree-endpoint-manager';
import { DemoAnalyticsHandler } from './demo-analytics-handler';
import { LazyLoaderService } from '@internetarchive/lazy-loader-service';
import { ModalManager } from '@internetarchive/modal-manager';
import { DonationFormController } from '../src/donation-form-controller';

@customElement('app-root')
export class AppRoot extends LitElement {
  private braintreeEndpointManager = new BraintreeEndpointManager();
  private analyticsHandler = new DemoAnalyticsHandler();
  private lazyLoader = new LazyLoaderService();

  @property({ type: Boolean }) foo = false;

  @query('modal-manager') modalManager!: ModalManager;

  @query('#recaptcha') recaptcha!: HTMLDivElement;

  @query('donation-form-controller') donationFormController!: DonationFormController;

  render(): TemplateResult {
    return html`
      <modal-manager>
        <!--
          The PayPal buttons cannot exist in the shadowDOM so they have to be slotted
          from the top.
        -->
        <div slot="paypal-upsell-button">
          <div id="paypal-upsell-button"></div>
        </div>
      </modal-manager>

      <donation-form-controller
        environment='dev'
        braintreeAuthToken='sandbox_x634jsj7_7zybks4ybp63pbmd'
        recaptchaSiteKey='6LeTUvYUAAAAAPTvW98MaXyS8c6vxk4-9n8DI1ve'
        venmoProfileId='1953896702662410263'
        googlePayMerchantId=''
        .endpointManager=${this.braintreeEndpointManager}
        .lazyLoaderService=${this.lazyLoader}
        referrer='demo-app'
        ?showCreditCardButtonText=${true}
        loggedInUser='demo-user'>
      </donation-form-controller>

      <div id="recaptcha"></div>
    `;
  }

  firstUpdated() {
    this.donationFormController.modalManager = this.modalManager;
    this.donationFormController.recaptchaElement = this.recaptcha;
    this.donationFormController.analyticsHandler = this.analyticsHandler;
  }

  static get styles(): CSSResultGroup {
    return css`
        body {
          color: #333;
          font-family: sans-serif;
        }

        body.modal-manager-open {
          overflow: hidden;
        }

        modal-manager {
          display: none;
          /* var(--modalTopMargin, 4rem);
          var(--modalBottomMargin, 0.25rem); */
        }

        modal-manager[mode='open'] {
          display: block;
        }

        donation-form-controller {
          display: block;
          width: 32rem;
        }

        .dev-tools {
          background-color: lightblue;
          padding: 1rem 1rem;
        }

        #paypal-upsell-button {
          opacity: 0.01;
          padding-bottom: 0.6rem;
        }

      div#options {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        align-items: center;
      }
      div#options button {
        margin: 2px 5px;
      }
    `;
  }
}
