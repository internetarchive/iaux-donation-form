/**
 * The PromisedSingleton is a generic wrapper for an asynchronous object that you only
 * want one instance of (a singleton).
 *
 * For the braintree libraries, we only want to load them once. This presents a problem
 * when several consumers request the clients at once. The Promises don't automatically
 * chain so you have to do some gatekeeping to make sure only one instance gets created.
 *
 * `PromisedSingleton` ensures that no matter how many callers request the object,
 * only one instance gets created.
 *
 * It gets initialized with a Promise that generates the singleton and when `get()` is
 * first called, it executes the Promise, caches its results and returns it to the caller.
 *
 * If more callers call it in the interim, it chains the promises and when the singleton
 * is created, it resolves them all.
 *
 * @export
 * @class PromisedSingleton
 * @template T
 */
export class PromisedSingleton<T> {
  /**
   * Reset the singleton cache to start a new fetch on next `get()`
   *
   * @memberof PromisedSingleton
   */
  reset(): void {
    this.cachedResponse = undefined;
  }

  /**
   * Request the singleton
   *
   * @returns {Promise<T>}
   * @memberof PromisedSingleton
   */
  async get(): Promise<T> {
    // if it's already in the cache return it
    if (this.cachedResponse) {
      return this.cachedResponse;
    }

    // if another promise is in line, chain it
    if (this.previousPromise) {
      this.previousPromise = this.previousPromise.then(response => {
        return response;
      });
      return this.previousPromise;
    }

    // this is the first load so kick off the generator and cache
    this.previousPromise = this.generateSingletonAndCache();
    return this.previousPromise;
  }

  private async generateSingletonAndCache(): Promise<T> {
    return this.generator.then(response => {
      this.cachedResponse = response;
      return response;
    });
  }

  private previousPromise?: Promise<T>;

  private cachedResponse?: T;

  private generator: Promise<T>;

  constructor(generator: Promise<T>) {
    this.generator = generator;
  }
}
