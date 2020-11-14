import {
  html,
  css,
  LitElement,
  property,
  TemplateResult,
  CSSResult,
  customElement,
} from 'lit-element';
import currency from 'currency.js';

@customElement('donation-page-thermometer')
export class DonationPageThermometer extends LitElement {
  @property({ type: String }) goalNearMessage =
    'We’ve almost reached our goal!';

  @property({ type: String }) goalReachedMessage = "We've reached our goal!";

  @property({ type: Number }) goalAmount = 7_500_000;

  @property({ type: Number }) currentAmount = 0;

  render(): TemplateResult {
    return html`
      <div
        class="container"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="${this.goalAmount}"
        aria-valuenow="${this.currentAmount}"
        aria-valuetext="${this.currentAmountDisplayValue}"
      >
        <div class="thermometer-message-container">
          <div class="donate-goal">
            Thank you for helping us reach our ${this.goalAmountDisplayValue} goal!
          </div>
          <div class="thermometer-container">
            <div class="thermometer-background">
              <div
                class="thermometer-fill"
                style="height: ${this.percentComplete}%"
              ></div>
            </div>
            <div
              class="thermometer-value-container"
              style="height: ${this.percentComplete}%"
            >
              <div class="thermometer-value-indicator"></div>
              <div class="thermometer-value">
                ${this.currentAmountDisplayValue}
              </div>
            </div>
          </div>
          <div class="thermometer-bulb">Donate</div>
        </div>
      </div>
    `;
  }

  private get currentAmountDisplayValue(): string {
    return this.currencyFormatted(this.currentAmount);
  }

  private get goalAmountDisplayValue(): string {
    const goalInMillions = this.goalAmount / 1_000_000;
    const amount = Math.round((goalInMillions + Number.EPSILON) * 10) / 10
    return `$${amount}M`;
  }

  private currencyFormatted(value: number): string {
    return currency(value, {
      symbol: '$',
      precision: 0,
    }).format();
  }

  private get percentComplete(): number {
    return Math.min((this.currentAmount / this.goalAmount) * 100, 100);
  }

  static get styles(): CSSResult {
    const thermometerHeight = css`var(--bannerThermometerHeight, 30px)`;
    const borderStyle = css`var(--bannerThermometerBorder, 1px solid #31A481)`;
    const backgroundColor = css`var(--bannerThermometerBackgroundColor, #D1FAED)`;
    const progressColor = css`var(--bannerThermometerProgressColor, #31A481)`;
    const borderRadius = css`var(--bannerThermometerBorderRadius, 20px)`;
    const markerWidth = css`var(--bannerThermometerMarkerHeight, 50%)`;
    const markerBorder = css`var(--bannerThermometerMarkerBorder, ${borderStyle})`;
    const progressValueLineHeight = css`var(--bannerThermometerProgressValueLineHeight, 1)`;
    const goalMessageLineHeight = css`var(--bannerThermometerGoalMessageLineHeight, 1.5)`;
    const goalMessagePadding = css`var(--bannerThermometerGoalMessagePadding, 0 10px)`;
    const goalFontSize = css`var(--bannerThermometerGoalFontSize, 1.2rem)`;

    const bulbDiameter = css`var(--bannerThermometerBulbDiameter, 5rem)`;


    return css`
      :host {
        display: block;
      }

      .container {
        height: 100%;
      }

      .thermometer-message-container {
        height: 100%;
      }

      .thermometer-container {
        height: 100%;
        position: relative;
      }

      .thermometer-background {
        background-color: ${backgroundColor};
        padding: 0;
        height: 100%;
        margin: auto;
        width: ${thermometerHeight};
        border-top-left-radius: ${borderRadius};
        border-top-right-radius: ${borderRadius};
        border: ${borderStyle};
        overflow: hidden;
        position: relative;
      }

      .thermometer-fill {
        background-color: ${progressColor};
        text-align: right;
        width: 100%;
        border-top-left-radius: ${borderRadius};
        border-top-right-radius: ${borderRadius};
        position: absolute;
        bottom: 0;
      }

      .thermometer-bulb {
        border-radius: 100%;
        width: ${bulbDiameter};
        height: ${bulbDiameter};
        margin: auto;
        margin-top: calc(${bulbDiameter} / 4 * -1);
        background-color: ${progressColor};
        z-index: 1;
        position: relative;
        color: white;
        font-weight: bold;
        font-size: 1.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .thermometer-value-container {
        position: absolute;
        width: calc(${markerWidth} - 5px);
        bottom: 0;
        left: 5px;
      }

      .thermometer-value-indicator {
        height: 100%;
        border-top: ${markerBorder};
      }

      .thermometer-value {
        line-height: ${progressValueLineHeight};
        position: absolute;
        top: 5px;
        color: ${progressColor};
        text-align: left;
        font-weight: bold;
      }

      .donate-goal {
        text-align: center;
        padding: ${goalMessagePadding};
        line-height: ${goalMessageLineHeight};
        font-size: ${goalFontSize};
      }
    `;
  }
}
