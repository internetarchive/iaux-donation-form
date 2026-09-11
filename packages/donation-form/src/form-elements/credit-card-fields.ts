import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, query } from 'lit/decorators.js';

import { SpacerOption } from './badged-input';
import './badged-input';

import creditCardImg from '@internetarchive/icon-credit-card/index.js';
import calendarImg from '@internetarchive/icon-calendar/index.js';
import lockImg from '@internetarchive/icon-lock/index.js';

import {
  HostedFieldContainer,
  HostedFieldContainerInterface,
} from '../braintree-manager/payment-providers/credit-card/hosted-field-container';

/**
 * Renders the Braintree Hosted Fields (card number, expiration, CVC) and owns
 * their error handling, mirroring how <contact-form> owns validation for its own
 * fields.
 *
 * Braintree renders the actual <input> inside a cross-origin iframe, so a real
 * <label for> association isn't possible here - the visible labels below are
 * decorative only. The accessible name still comes from Braintree's own
 * hosted-field `placeholder` config (see donation-form-controller.ts).
 */
@customElement('credit-card-fields')
export class CreditCardFields extends LitElement {
  @query('#braintree-creditcard') private numberField!: HTMLDivElement;

  @query('#braintree-expiration') private expirationField!: HTMLDivElement;

  @query('#braintree-cvv') private cvvField!: HTMLDivElement;

  @query('#braintree-error-message') private errorMessageField!: HTMLDivElement;

  get hostedFieldContainer(): HostedFieldContainerInterface {
    return new HostedFieldContainer({
      number: this.numberField,
      cvv: this.cvvField,
      expirationDate: this.expirationField,
      errorContainer: this.errorMessageField,
    });
  }

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div id="braintree-error-message"></div>
      <div class="braintree-row">
        <div class="field">
          <label class="field-label">Card Number<span class="required-asterisk"> *</span></label>
          <badged-input
            .icon=${creditCardImg}
            .requiredIndicatorSpaceOption=${SpacerOption.CompressSpace}
            class="creditcard"
          >
            <div class="braintree-input" id="braintree-creditcard"></div>
          </badged-input>
        </div>
      </div>
      <div class="braintree-row">
        <div class="field">
          <label class="field-label"
            >Expiration (MM / YY)<span class="required-asterisk"> *</span></label
          >
          <badged-input
            .icon=${calendarImg}
            .requiredIndicatorSpaceOption=${SpacerOption.CompressSpace}
            class="expiration"
          >
            <div class="braintree-input" id="braintree-expiration"></div>
          </badged-input>
        </div>
        <div class="field">
          <label class="field-label">CVC<span class="required-asterisk"> *</span></label>
          <badged-input
            .icon=${lockImg}
            .requiredIndicatorSpaceOption=${SpacerOption.CompressSpace}
            class="cvv"
          >
            <div class="braintree-input" id="braintree-cvv"></div>
          </badged-input>
        </div>
      </div>
      ${this.getStyles}
    `;
  }

  /** @inheritdoc */
  createRenderRoot(): this {
    // Render template without shadow DOM. Braintree's Hosted Fields SDK does not
    // work inside the shadow DOM, so this element must live in the light DOM.
    return this;
  }

  /**
   * This is not the normal LitElement styles block.
   *
   * This element uses the clear DOM instead of the shadow DOM (see createRenderRoot)
   * so it can't use the shadowRoot's isolated styling. This writes out our own
   * <style> tag and is careful about selectors since they will leak outside of
   * this component.
   */
  private get getStyles(): TemplateResult {
    const fieldLabelFontFamily = css`var(--fieldLabelFontFamily, "Helvetica Neue", Helvetica, Arial, sans-serif)`;
    const fieldLabelFontSize = css`var(--fieldLabelFontSize, 14px)`;
    const fieldLabelColor = css`var(--fieldLabelColor, #2c2c2c)`;
    const fieldLabelMarginBottom = css`var(--fieldLabelMarginBottom, 5px)`;
    const fieldRowGap = css`var(--fieldRowGap, 5px)`;
    const requiredAsteriskColor = css`var(--badgedInputRequiredIndicatorColor, red)`;

    return html`
      <style>
        /*
          **NOTE**
          This element is in the lightDOM so be sure to prefix all styles
          with "credit-card-fields" so styles don't leak.
         */
        credit-card-fields .field-label {
          display: block;
          font-family: ${fieldLabelFontFamily};
          font-size: ${fieldLabelFontSize};
          font-weight: bold;
          color: ${fieldLabelColor};
          margin-bottom: ${fieldLabelMarginBottom};
        }

        credit-card-fields .required-asterisk {
          color: ${requiredAsteriskColor};
        }

        /*
          Grid (not flex) so that a label wrapping to two lines in one column
          doesn't push that column's input out of alignment with its sibling -
          both labels share row-line 1 and both inputs share row-line 2.
        */
        credit-card-fields .braintree-row {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 1fr;
          grid-template-rows: auto auto;
          column-gap: ${fieldRowGap};
          margin-top: -1px;
        }

        credit-card-fields .braintree-row:first-child {
          margin-top: 0;
        }

        credit-card-fields .field {
          display: contents;
        }

        credit-card-fields badged-input {
          width: 100%;
        }

        credit-card-fields .braintree-input {
          width: 100%;
          height: 100%;
        }

        credit-card-fields #braintree-error-message {
          color: red;
          font-size: 1.4rem;
          margin-bottom: 0.6rem;
        }
      </style>
    `;
  }
}
