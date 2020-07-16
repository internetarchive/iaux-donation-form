import {
  LitElement,
  html,
  css,
  customElement,
  CSSResult,
  TemplateResult,
  property,
} from 'lit-element';

export enum IconSpaceOption {
  IconSpace = 'icon-space',
  NoIconSpace = 'no-icon-space',
}

@customElement('badged-input')
export class BadgedInput extends LitElement {
  @property({ type: Boolean }) error = false;

  @property({ type: Object }) icon?: TemplateResult;

  @property({ type: String }) iconSpaceOption: IconSpaceOption = IconSpaceOption.IconSpace;

  /** @inheritdoc */
  render(): TemplateResult {
    return html`
      <div
        class="input-wrapper ${this.error ? 'error' : ''} ${this.iconSpaceOption ===
        IconSpaceOption.NoIconSpace
          ? 'no-icon-space'
          : ''}"
      >
        <div class="icon-container">${this.icon}</div>
        <slot></slot>
      </div>
    `;
  }

  get iconTemplate(): TemplateResult {
    return html`
      <div class="icon-container">${this.icon}</div>
    `;
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    const outlineCss = css`var(--contactFormFieldBorder, 1px solid #d9d9d9)`;
    const outlineErrorCss = css`var(--contactFormFieldBorderErrorColor, red)`;
    const iconSize = css`var(--contactFormFieldIconSize, 14px)`;
    const iconSpacerWidth = css`var(--contactFormFieldIconSpacerWidth, 30px)`;
    const fieldHeight = css`var(--contactFormFieldHeight, 30px)`;

    return css`
      .input-wrapper {
        width: 100%;
        outline: ${outlineCss};
        height: ${fieldHeight};
        display: flex;
      }

      .input-wrapper.error {
        outline-color: ${outlineErrorCss};
      }

      .input-wrapper.no-icon-space .icon-container {
        width: 10px;
      }

      .icon-container {
        width: ${iconSpacerWidth};
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .icon-container svg {
        height: ${iconSize};
      }
    `;
  }
}
