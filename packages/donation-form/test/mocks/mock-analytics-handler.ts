import { AnalyticsHandlerInterface } from '../../src/@types/analytics-handler';

export class MockAnalyticHandler implements AnalyticsHandlerInterface {
  callCategory?: string;
  callAction?: string;
  callLabel?: string;
  callAdditionalEventParams?: object;

  // eslint-disable-next-line @typescript-eslint/camelcase
  send_event(
    category: string,
    action: string,
    label?: string,
    additionalEventParams?: object,
  ): void {
    this.callCategory = category;
    this.callAction = action;
    this.callLabel = label;
    this.callAdditionalEventParams = additionalEventParams;
  }

  // eslint-disable-next-line @typescript-eslint/camelcase
  send_event_no_sampling(
    category: string,
    action: string,
    label?: string,
    additionalEventParams?: object,
  ): void {
    this.callCategory = category;
    this.callAction = action;
    this.callLabel = label;
    this.callAdditionalEventParams = additionalEventParams;
  }
}
