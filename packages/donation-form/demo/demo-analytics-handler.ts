import { AnalyticsManagerInterface } from '@internetarchive/analytics-manager';
export class DemoAnalyticsHandler implements AnalyticsManagerInterface {
  nodeToUpdate!: HTMLElement;

  sendEvent(options: {
    category: string;
    action: string;
    label?: string;
    additionalEventParams?: object;
  }): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.nodeToUpdate.innerHTML = `Action: ${options.action} - Label: ${options.label}`;
    console.debug('DemoAnalyticsHandler -- sendEventNoSampling ', { ...options }, this.nodeToUpdate.innerHTML);
  }

  sendEventNoSampling(
    options: {
      category: string;
      action: string;
      label?: string;
      additionalEventParams?: object;
    }): void {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.nodeToUpdate.innerHTML = `Action: ${options.action} - Label: ${options.label}`;
      console.debug('DemoAnalyticsHandler -- sendEventNoSampling ', { ...options }, this.nodeToUpdate.innerHTML);
  }

  sendPing(values: Record<string, any>): void {
    console.debug('DemoAnalyticsHandler -- sendPing ', { ...values });
  }
}
