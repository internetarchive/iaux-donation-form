import { LitElement, html, TemplateResult, CSSResultGroup, css } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import '../src/banner-thermometer';
import {
  DonationBannerThermometer,
  GoalMessageMode,
} from '../src/banner-thermometer';

@customElement('app-root')
export class AppRoot extends LitElement {
  @query('#thermometer') thermometer!: DonationBannerThermometer;

  @query('#markerTopValue') markerTopValue!: HTMLSpanElement;

  @query('#markerHeightValue') markerHeightValue!: HTMLSpanElement;

  @query('#currentAmountSlider') currentAmountSlider!: HTMLInputElement;

  @query('#currentAmountInput') currentAmountInput!: HTMLInputElement;

  @query('#goalInput') goalInput!: HTMLInputElement;

  @state() defaultGoal = 6_500_000;

  @state() defaultCurrentAmount = 2_350_000;

  render(): TemplateResult {
    return html`
      <div class="thermometer-container">
        <donation-banner-thermometer
          id="thermometer"
          currentAmount=${this.defaultCurrentAmount}
          goalAmount=${this.defaultGoal}
        >
        </donation-banner-thermometer>
      </div>

      <fieldset>
        <legend>Config</legend>
        <dl>
          <dt><label for="goalInput">Set Goal</label></dt>
          <dd>
            <input
              type="text"
              id="goalInput"
              @input=${this.setGoal}
              value=${this.defaultGoal}
            />
          </dd>

          <dt><label for="setGoal">Set Current Amount</label></dt>
          <dd>
            <input
              type="text"
              id="currentAmountInput"
              @input=${this.setCurrentAmount}
              value=${this.defaultCurrentAmount}
            />
            <input
              type="range"
              id="currentAmountSlider"
              @input=${this.setCurrentAmountSlider}
              min="0"
              max="${this.defaultGoal}"
            />
          </dd>

          <dt><label for="goalMet">Goal Message</label></dt>
          <dd>
            <div>
              <input type="checkbox" id="goalMet" @input=${this.goalMet} />
            </div>
            <div>
              <label>Goal Met Message:</label>
              <input
                type="text"
                id="goalMetMessage"
                @input=${this.goalMetMessage}
                value="We've reached our goal!"
              />
            </div>
            <div>
              <label>Goal Near Message:</label>
              <input
                type="text"
                id="goalNearMessage"
                @input=${this.goalNearMessage}
                value="We’ve almost reached our goal!"
              />
            </div>
          </dd>

          <dt><label for="borderColor">Thermometer Border</label></dt>
          <dd>
            <input
              type="text"
              id="borderColor"
              @input=${this.changeBorderColor}
              value="1px solid #31A481"
            />
          </dd>

          <dt><label for="backgroundColor">Background Color</label></dt>
          <dd>
            <input
              type="text"
              id="backgroundColor"
              @input=${this.changeBackgroundColor}
              value="#D1FAED"
            />
          </dd>

          <dt><label for="fillColor">Fill Color</label></dt>
          <dd>
            <input
              type="text"
              id="fillColor"
              @input=${this.changeFillColor}
              value="#31A481"
            />
          </dd>

          <dt><label for="markerBorder">Marker Border</label></dt>
          <dd>
            <input
              type="text"
              id="markerBorder"
              @input=${this.changeMarkerBorder}
              value="1px solid #31A481"
            />
          </dd>

          <dt><label for="markerTop">Marker Top</label></dt>
          <dd>
            <input
              type="range"
              id="markerTop"
              @input=${this.changeMarkerTop}
              min="0"
              max="200"
              value="50"
            />
            <span id="markerTopValue">50%</span>
          </dd>

          <dt><label for="markerHeight">Marker Height</label></dt>
          <dd>
            <input
              type="range"
              id="markerHeight"
              @input=${this.changeMarkerHeight}
              min="50"
              max="200"
              value="100"
            />
            <span id="markerHeightValue">100%</span>
          </dd>
        </dl>
      </fieldset>
    `;
  }

  changeMarkerTop(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.style.setProperty(
      '--bannerThermometerMarkerTop',
      value + '%'
    );
    const numberValue = parseFloat(value);
    this.markerTopValue.innerHTML = `${Math.round(numberValue)}%`;
  }

  changeMarkerHeight(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.style.setProperty(
      '--bannerThermometerMarkerHeight',
      value + '%'
    );
    const numberValue = parseFloat(value);
    this.markerHeightValue.innerHTML = `${Math.round(numberValue)}%`;
  }

  goalMet(e: Event): void {
    if (!e.target) return;
    const target = e.target as HTMLInputElement;
    const mode = target.checked
      ? GoalMessageMode.ShowGoalMessage
      : GoalMessageMode.ShowGoalAmount;
    this.thermometer.goalMessageMode = mode;
  }

  setGoal(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.currentAmountSlider.max = value;
    this.thermometer.goalAmount = parseFloat(value);
  }

  setCurrentAmount(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.currentAmount = parseFloat(value);
  }

  setCurrentAmountSlider(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.currentAmountInput.value = value;
    this.thermometer.currentAmount = parseFloat(value);
  }

  goalMetMessage(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.goalReachedMessage = value;
  }

  goalNearMessage(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.goalNearMessage = value;
  }

  changeBorderColor(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.style.setProperty('--bannerThermometerBorder', value);
  }

  changeFillColor(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.style.setProperty(
      '--bannerThermometerProgressColor',
      value
    );
  }

  changeBackgroundColor(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.style.setProperty(
      '--bannerThermometerBackgroundColor',
      value
    );
  }

  changeMarkerBorder(e: Event): void {
    if (!e.target) return;
    const value = (e.target as HTMLInputElement).value;
    this.thermometer.style.setProperty(
      '--bannerThermometerMarkerBorder',
      value
    );
  }

  static get styles(): CSSResultGroup {
    return css`
      #thermometer {
        height: 50px;
        --bannerThermometerHeight: 30px;
      }

      .thermometer-container {
        margin-bottom: 2rem;
      }
    `;
  }
}
