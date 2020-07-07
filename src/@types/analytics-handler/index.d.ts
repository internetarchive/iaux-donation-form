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
   * @param {Object} additionalEventParams
   */
  sendEvent(category: string, action: string, label: string, additionalEventParams: object): void;
}
