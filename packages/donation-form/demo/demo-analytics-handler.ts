import { AnalyticsHandlerInterface } from '../src/@types/analytics-handler';

export class DemoAnalyticsHandler implements AnalyticsHandlerInterface {
  nodeToUpdate!: HTMLElement;
  // eslint-disable-next-line @typescript-eslint/camelcase
  send_event(
    category: string,
    action: string,
    label?: string,
    additionalEventParams?: object,
  ): void {
    console.debug('DemoAnalyticsHandler', category, action, label, additionalEventParams);
  }
  // eslint-disable-next-line @typescript-eslint/camelcase
  send_event_no_sampling(
    category: string,
    action: string,
    label?: string,
    additionalEventParams?: object,
  ): void {
    console.debug('DemoAnalyticsHandler', category, action, label, additionalEventParams);
    const placeholder = document.querySelector('#latest-analytic');
    this.nodeToUpdate.innerHTML = `Action: ${action} - Label: ${label}`;
  }
}
