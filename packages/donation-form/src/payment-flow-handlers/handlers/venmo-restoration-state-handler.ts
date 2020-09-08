import { DonorContactInfo, DonationPaymentInfo } from '@internetarchive/donation-form-data-models';

export interface VenmoRestorationStateHandlerInterface {
  /**
   * Persist the session state
   *
   * @param {DonorContactInfo} contactInfo
   * @param {DonationPaymentInfo} donationInfo
   * @memberof VenmoRestorationStateHandlerInterface
   */
  persistState(contactInfo: DonorContactInfo, donationInfo: DonationPaymentInfo): void;

  /**
   * Get the session restoration state
   *
   * @returns {(Promise<VenmoRestorationState | undefined>)}
   * @memberof VenmoRestorationStateHandlerInterface
   */
  getRestorationState(): Promise<VenmoRestorationState | undefined>;

  /**
   * Clear the restoration state
   *
   * @memberof VenmoRestorationStateHandlerInterface
   */
  clearState(): void;
}

/**
 * Structure to store the session restoration state
 *
 * @export
 * @class VenmoRestorationState
 */
export class VenmoRestorationState {
  contactInfo: DonorContactInfo;
  donationInfo: DonationPaymentInfo;

  // TODO: Add restoration state expiration
  constructor(params: { contactInfo: DonorContactInfo; donationInfo: DonationPaymentInfo }) {
    this.contactInfo = params.contactInfo;
    this.donationInfo = params.donationInfo;
  }
}

/**
 * The VenmoRestorationStateHandler is used to persist and restore a Venmo checkout session.
 *
 * Venmo takes the user out of the web browser and into their app to authorize the purchase.
 * It then redirects the user back to the website to finish the transaction. The problem is
 * it may open a new browser tab so it's like starting a new session. We need to persist
 * the session information from the start of the Venmo session and restore it when it resumes.
 *
 * This class stores the session information in localStorage when the Venmo session is started
 * and retrieves it when the session is restored.
 *
 * @export
 * @class VenmoRestorationStateHandler
 * @implements {VenmoRestorationStateHandlerInterface}
 */
export class VenmoRestorationStateHandler implements VenmoRestorationStateHandlerInterface {
  private persistanceKey = 'venmoRestorationStateInfo';

  private storageSystem?: Storage;

  constructor(options?: { storageSystem?: Storage }) {
    if (options?.storageSystem) {
      this.storageSystem = options.storageSystem;
    } else if (this.storageSystemAvailable(localStorage)) {
      this.storageSystem = localStorage;
    } else if (this.storageSystemAvailable(sessionStorage)) {
      this.storageSystem = sessionStorage;
    }
  }

  /** @inheritdoc */
  clearState(): void {
    this.storageSystem?.removeItem(this.persistanceKey);
  }

  /** @inheritdoc */
  persistState(contactInfo: DonorContactInfo, donationInfo: DonationPaymentInfo): void {
    const venmoRestoration = new VenmoRestorationState({
      contactInfo,
      donationInfo,
    });
    const serialized = JSON.stringify(venmoRestoration);
    this.storageSystem?.setItem(this.persistanceKey, serialized);
  }

  /** @inheritdoc */
  async getRestorationState(): Promise<VenmoRestorationState | undefined> {
    const stored = this.storageSystem?.getItem(this.persistanceKey);
    if (!stored) {
      console.error('restoreState: No stored data');
      return undefined;
    }

    const deserialized = JSON.parse(stored);
    if (!deserialized) {
      console.error('restoreState: Data could not be deserialized');
      return undefined;
    }

    const donationInfo = new VenmoRestorationState(deserialized);

    return donationInfo;
  }

  /**
   * Check if a particular storage system (localStorage/sessionStorage) is availble
   *
   * @private
   * @param {Storage} system
   * @returns {boolean}
   * @memberof VenmoRestorationStateHandler
   */
  private storageSystemAvailable(system: Storage): boolean {
    try {
      system.setItem('foo', 'bar');
      system.removeItem('foo');
      return true;
    } catch (exception) {
      return false;
    }
  }
}
