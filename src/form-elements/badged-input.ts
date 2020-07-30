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
      <div class="input-wrapper ${this.errorClass} ${this.iconSpaceOptionClass}">
        <div class="icon-container">${this.icon}</div>
        <slot></slot>
      </div>
    `;
  }

  private get errorClass(): string {
    return this.error ? 'error' : '';
  }

  private get iconSpaceOptionClass(): string {
    return this.iconSpaceOption === IconSpaceOption.NoIconSpace ? 'no-icon-space' : ''
  }

  /** @inheritdoc */
  static get styles(): CSSResult {
    const outlineCss = css`var(--inputBorder, 1px solid #d9d9d9)`;
    const outlineErrorCss = css`var(--badgedInputBorderErrorColor, red)`;
    const iconSize = css`var(--badgedInputIconSize, 1.4rem)`;
    const iconSpacerWidth = css`var(--badgedInputIconSpacerWidth, 3rem)`;
    const noIconSpacerWidth = css`var(--badgedInputNoIconSpacerWidth, 1rem)`;
    const fieldHeight = css`var(--badgedInputHeight, 3rem)`;

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
        width: ${noIconSpacerWidth};
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
