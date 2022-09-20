/** Analytics functionality from Donation Form Controller
 * this will get passed thru to the children handlers
 * so that they can send analytics events in donation form context
 */
export interface DonationControllerEventLoggerInterface {
  logEvent(action: string, label: string): void;
  logEventNoSampling(action: string, label: string): void;
}

/**
 * This is an interface for the analytics handler in petabox
 * because we don't currently have a declarations file for it.
 */
export interface AnalyticsHandlerInterface {
  /**
   * Sends a tracking event.
   *
   * @param {string} category
   * @param {string} action
   * @param {string} label Defaults to `window.location.pathname`
   * @param {Object} additionalEventParams These are internal params, not sent to GA
   */
  // eslint-disable-next-line @typescript-eslint/camelcase
  send_event(
    category: string,
    action: string,
    label?: string,
    additionalEventParams?: object,
  ): void;

  /**
   * Sends a tracking event to no sampling bucket.
   *
   * @param {string} category
   * @param {string} action
   * @param {string} label
   * @param {Object} additionalEventParams These are internal params, not sent to GA
   */
  // eslint-disable-next-line @typescript-eslint/camelcase
  send_event_no_sampling(
    category: string,
    action: string,
    label?: string,
    additionalEventParams?: object,
  ): void;
}
