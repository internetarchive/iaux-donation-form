import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * This is shown at the bottom of the error modal.
 *
 * @export
 * @class ErrorModalContent
 * @extends {LitElement}
 */
@customElement('donation-form-error-modal-content')
export class ErrorModalContent extends LitElement {
  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div class="container">
        <a
          href="https://help.archive.org/help/why-is-there-a-problem-processing-my-donation/"
          rel="noopener"
          target="_blank"
        >
          Questions?
        </a>
      </div>
    `;
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    const questionsLinkTopMargin = css`var(--errorModalQuestionsLinkTopMargin, 1rem)`;
    const questionsLinkFontColor = css`var(--errorModalQuestionsLinkFontColor, #333)`;
    const questionsLinkFontSize = css`var(--errorModalQuestionsLinkFontSize, 1.4rem)`;

    return css`
      .container {
        margin-top: ${questionsLinkTopMargin};
        text-align: center;
      }

      a,
      a:link,
      a:visited {
        color: ${questionsLinkFontColor};
        font-size: ${questionsLinkFontSize};
      }
    `;
  }
}
