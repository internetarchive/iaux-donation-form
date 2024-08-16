import { LitElement, html, css, CSSResult, TemplateResult, PropertyValues, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type SubscriptionSummary from './models/subscription-summary';

import './form-elements/contact-form/contact-form';

@customElement('iaux-mgc-edit-plan-payment-method')
export class MonthlyGivingCircle extends LitElement {
  @property({ type: String }) baseHost: string = 'archive.org';

  @property({ type: String }) giverId: string = '';

  @property({ type: Array }) activePlans: SubscriptionSummary[] = [];

  @property({ type: String }) planIdToDisplay = '';

  @property({ type: Object }) braintreeManager?: any;

  protected createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this.setupBraintreeManager();
  }

  paymentSelected(e: CustomEvent) {
    console.log('paymentSelected', e.detail);
  }
  paymentSelectorFirstUpdated() {
    console.log('paymentSelectorFirstUpdated');
  }

  protected render() {
    return html`
    <section>
      <h3>Payment method</h3>
      <p>this payment method</p>
      <p>Expires: when</p>

      <payment-selector
          .paymentProviders=${this.braintreeManager?.paymentProviders}
          @firstUpdated=${this.paymentSelectorFirstUpdated}
          @creditCardSelected=${this.paymentSelected}
          @venmoSelected=${this.paymentSelected}
          @applePaySelected=${this.paymentSelected}
          @googlePaySelected=${this.paymentSelected}
          @paypalBlockerSelected=${this.paymentSelected}
          @resetPaymentMethod=${async () => {
            debugger;
            // this.selectedPaymentProvider = undefined;
            // this.contactFormVisible = false;
            // this.requestUpdate();
          }}
          tabindex="0"
        >
          <slot name="paypal-button" slot="paypal-button"></slot>
          <slot></slot>
        </payment-selector>
      <!-- <contact-form></contact-form> -->
    </section>
      
    `;
  }

  private setupBraintreeManager(): void {
      // this.braintreeManager = new BraintreeManager({
      //   paymentClients: this.paymentClients,
      //   endpointManager: this.endpointManager,
      //   authorizationToken: this.braintreeAuthToken,
      //   venmoProfileId: this.venmoProfileId,
      //   googlePayMerchantId: this.googlePayMerchantId,
      //   hostedFieldConfig: this.hostedFieldConfig,
      //   hostingEnvironment: this.environment,
      //   referrer: this.referrer,
      //   loggedInUser: this.loggedInUser,
      //   origin: this.origin,
      // });

      // this.braintreeManager.on('paymentProvidersHostedFieldsRetry', (retryNumber: number) => {
      //   const event = new CustomEvent('paymentProvidersHostedFieldsRetry', {
      //     detail: { retryNumber },
      //   });
      //   this.dispatchEvent(event);
      // });

      // this.braintreeManager.on('paymentProvidersHostedFieldsFailed', (error: unknown) => {
      //   const event = new CustomEvent('paymentProvidersHostedFieldsFailed', {
      //     detail: { error },
      //   });
      //   this.dispatchEvent(event);
      // });
  }
}
