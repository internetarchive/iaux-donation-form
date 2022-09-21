/** Analytics functionality from Donation Form Controller
 * this will get passed thru to the children handlers
 * so that they can send analytics events in donation form context
 */
export interface DonationControllerEventLoggerInterface {
  logEvent(action: string, label: string): void;
  logDonationFlowEvent(action: string, label: string): void;
}
