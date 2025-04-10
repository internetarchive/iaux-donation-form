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
}
