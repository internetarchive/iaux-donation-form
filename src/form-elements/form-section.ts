import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
} from 'lit-element';

@customElement('form-section')
export class FormSection extends LitElement {
  @property({ type: Number }) number = 0;

  @property({ type: String }) headline: string | undefined;

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div class="container">
        <div class="col left">
          <div class="number">${this.number}</div>
        </div>
        <div class="col right">
          ${this.headline ? html`<div class="title">${this.headline}</div>` : ''}
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    const numberSize = css`var(--formSectionNumberRadius, 10px)`;

    return css`
      .container {
        display: flex;
        margin-bottom: 1em;
      }

      .right {
        margin-left: 0.5em;
        flex: 1;
      }

      .number {
        background-color: black;
        color: white;
        width: calc(${numberSize} * 2);
        height: calc(${numberSize} * 2);
        border-radius: ${numberSize};
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
      }

      .title {
        line-height: calc(${numberSize} * 2);
        margin-bottom: 0.5em;
      }
    `;
  }
}
