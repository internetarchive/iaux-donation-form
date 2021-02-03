import { AnalyticsHandlerInterface } from '../src/@types/analytics-handler';

export class DemoAnalyticsHandler implements AnalyticsHandlerInterface {
  // eslint-disable-next-line @typescript-eslint/camelcase
  send_event(
    category: string,
    action: string,
    label?: string,
    additionalEventParams?: object,
  ): void {
    console.debug('DemoAnalyticsHandler', category, action, label, additionalEventParams);
  }
}
