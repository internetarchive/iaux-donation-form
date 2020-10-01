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

export enum GoalMessageMode {
  ShowGoalAmount = 'showgoalamount',
  ShowGoalMessage = 'showgoalmessage',
}

@customElement('donation-banner-thermometer')
export class DonationBannerThermometer extends LitElement {
  @property({ type: String }) goalMessageMode: GoalMessageMode =
    GoalMessageMode.ShowGoalAmount;

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
          <div class="thermometer-container">
            <div class="thermometer-background">
              <div
                class="thermometer-fill"
                style="width: ${this.percentComplete}%"
              ></div>
            </div>
            <div
              class="theremometer-value-container"
              style="width: ${this.percentComplete}%"
            >
              <div class="thermometer-value-indicator"></div>
              <div class="thermometer-value">
                ${this.currentAmountDisplayValue}
              </div>
            </div>
          </div>
          <div class="donate-goal">${this.currentGoalMessage}</div>
        </div>
      </div>
    `;
  }

  private get goalMessage(): string {
    return this.currentAmount >= this.goalAmount
      ? this.goalReachedMessage
      : this.goalNearMessage;
  }

  private get currentAmountDisplayValue(): string {
    return this.currencyFormatted(this.currentAmount);
  }

  private get goalAmountDisplayValue(): string {
    return this.currencyFormatted(this.goalAmount);
  }

  private currencyFormatted(value: number): string {
    return currency(value, {
      symbol: '$',
      precision: 0,
    }).format();
  }

  private get currentGoalMessage(): string {
    switch (this.goalMessageMode) {
      case GoalMessageMode.ShowGoalAmount:
        return `${this.goalAmountDisplayValue} goal`;
      case GoalMessageMode.ShowGoalMessage:
        return this.goalMessage;
    }
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
    const markerTop = css`var(--bannerThermometerMarkerTop, 50%)`;
    const markerHeight = css`var(--bannerThermometerMarkerHeight, 75%)`;
    const markerBorder = css`var(--bannerThermometerMarkerBorder, ${borderStyle})`;
    const progressValueLineHeight = css`var(--bannerThermometerProgressValueLineHeight, 1)`;
    const goalMessageLineHeight = css`var(--bannerThermometerGoalMessageLineHeight, 1)`;
    const goalMessagePadding = css`var(--bannerThermometerGoalMessagePadding, 0 10px)`;

    return css`
      :host {
        display: block;
        /* height: 100%; */
      }

      .container {
        height: 100%;
      }

      .thermometer-message-container {
        height: ${thermometerHeight};
        display: flex;
        align-items: center;
      }

      .thermometer-container {
        height: ${thermometerHeight};
        flex: 1;
        position: relative;
      }

      .thermometer-background {
        background-color: ${backgroundColor};
        padding: 0;
        height: 100%;
        border-radius: ${borderRadius};
        border: ${borderStyle};
        overflow: hidden;
      }

      .thermometer-fill {
        background-color: ${progressColor};
        text-align: right;
        height: 100%;
        border-radius: ${borderRadius};
      }

      .theremometer-value-container {
        position: absolute;
        height: ${markerHeight};
        top: ${markerTop};
      }

      .thermometer-value-indicator {
        height: 100%;
        border-right: ${markerBorder};
      }

      .thermometer-value {
        line-height: ${progressValueLineHeight};
        text-align: right;
      }

      .donate-goal {
        text-align: left;
        padding: ${goalMessagePadding};
        text-transform: uppercase;
        line-height: ${goalMessageLineHeight};
      }
    `;
  }
}
