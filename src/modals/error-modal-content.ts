import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
} from 'lit-element';

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
        <a href="https://help.archive.org/hc/en-us/articles/360037568971-Why-is-there-a-problem-processing-my-donation-" target="_blank">
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

      a, a:link, a:visited {
        color: ${questionsLinkFontColor};
        font-size: ${questionsLinkFontSize}
      }
    `;
  }
}
