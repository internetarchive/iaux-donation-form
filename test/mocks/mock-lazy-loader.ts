/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { LazyLoaderServiceInterface, BundleType } from '@internetarchive/lazy-loader-service';

export class MockLazyLoader implements LazyLoaderServiceInterface {
  async loadBundle(bundle: {
    module?: string | undefined;
    nomodule?: string | undefined;
  }): Promise<Event | undefined> {
    return new Event('done');
  }
  async loadScript(options: {
    src: string;
    bundleType?: BundleType | undefined;
    attributes?: { key: string; value: any }[] | undefined;
  }): Promise<Event> {
    return new Event('done');
  }
}
