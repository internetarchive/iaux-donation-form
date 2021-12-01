/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  LazyLoaderServiceEvents,
  LazyLoaderServiceInterface,
  BundleType,
} from '@internetarchive/lazy-loader-service';
import { createNanoEvents, Unsubscribe } from 'nanoevents';

export class MockLazyLoader implements LazyLoaderServiceInterface {
  private emitter = createNanoEvents<LazyLoaderServiceEvents>();

  on<E extends keyof LazyLoaderServiceEvents>(
    event: E,
    callback: LazyLoaderServiceEvents[E],
  ): Unsubscribe {
    return this.emitter.on(event, callback);
  }

  async loadBundle(bundle: {
    module?: string | undefined;
    nomodule?: string | undefined;
  }): Promise<void> {
    return;
  }

  async loadScript(options: {
    src: string;
    bundleType?: BundleType | undefined;
    attributes?: Record<string, string> | undefined;
  }): Promise<void> {
    return;
  }
  // async loadBundle(bundle: {
  //   module?: string | undefined;
  //   nomodule?: string | undefined;
  // }): Promise<Event | undefined> {
  //   return new Event('done');
  // }
  // async loadScript(options: {
  //   src: string;
  //   bundleType?: BundleType | undefined;
  //   attributes?: { key: string; value: any }[] | undefined;
  // }): Promise<Event> {
  //   return new Event('done');
  // }
}
