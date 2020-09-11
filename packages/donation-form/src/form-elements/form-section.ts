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
    const numberMargin = css`var(--formSectionNumberMargin, 1rem)`;
    const numberBackgroundColor = css`var(--formSectionNumberBackgroundColor, #333)`;
    const numberRadius = css`var(--formSectionNumberRadius, 1.2rem)`;
    const numberFontSize = css`var(--formSectionNumberFontSize, 1.8rem)`;
    const numberFontWeight = css`var(--formSectionNumberFontWeight, bold)`;
    const numberFontColor = css`var(--formSectionNumberFontColor, #fff)`;
    const titleFontSize = css`var(--formSectionTitleFontSize, 1.8rem)`;
    const titleFontWeight = css`var(--formSectionTitleFontWeight, bold)`;

    const lineHeightCss = css`calc(${numberRadius} * 2)`;

    return css`
      .container {
        display: flex;
        margin-bottom: 1rem;
      }

      .right {
        margin-left: ${numberMargin};
        flex: 1;
      }

      .number {
        background-color: ${numberBackgroundColor};
        color: ${numberFontColor};
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
        margin-bottom: 0.5rem;
        font-size: ${titleFontSize};
        font-weight: ${titleFontWeight};
      }
    `;
  }
}