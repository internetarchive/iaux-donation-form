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
          ${this.headline
            ? html`
                <div class="title">${this.headline}</div>
              `
            : ''}
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    const numberRadius = css`var(--formSectionNumberRadius, 12px)`;
    const numberFontSize = css`var(--formSectionNumberFontSize, 18px)`;
    const numberFontWeight = css`var(--formSectionNumberFontWeight, bold)`;
    const titleFontSize = css`var(--formSectionTitleFontSize, 18px)`;
    const titleFontWeight = css`var(--formSectionTitleFontWeight, bold)`;

    const lineHeightCss = css`calc(${numberRadius} * 2)`;

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
        width: calc(${numberRadius} * 2);
        height: calc(${numberRadius} * 2);
        border-radius: ${numberRadius};
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: ${numberFontWeight};
        font-size: ${numberFontSize};
      }

      .title {
        line-height: ${lineHeightCss};
        margin-bottom: 0.5em;
        font-size: ${titleFontSize};
        font-weight: ${titleFontWeight};
      }
    `;
  }
}
