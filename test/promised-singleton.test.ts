import { expect } from '@open-wc/testing';

import { PromisedSingleton } from '../src/util/promised-singleton';

describe('Promised Singleton', () => {
  it('can execute the promised result', async () => {
    const promisedSingleton: PromisedSingleton<string> = new PromisedSingleton(
      new Promise(resolve => {
        resolve('foo');
      }),
    );

    const result = await promisedSingleton.get();
    expect(result).to.equal('foo');
  });

  it('only executes the promised result once', async () => {
    const promisedSingleton: PromisedSingleton<string> = new PromisedSingleton(
      new Promise(resolve => {
        const random = Math.random();
        resolve(`foo-${random}`);
      }),
    );

    const result = await promisedSingleton.get();
    const result2 = await promisedSingleton.get();
    expect(result).to.equal(result2);
  });

  it('resolves many concurrent requests for the singlton', async () => {
    const count = 5;
    const promisedSingleton: PromisedSingleton<string> = new PromisedSingleton(
      new Promise(resolve => {
        const random = Math.random();
        resolve(`foo-${random}`);
      }),
    );

    const promises: Promise<string>[] = [];
    for (let index = 0; index < count; index++) {
      const promise = promisedSingleton.get();
      promises.push(promise);
    }

    const results: string[] = await Promise.all(promises);

    const firstResult = results[0];
    for (let index = 0; index < count; index++) {
      expect(results[index]).to.equal(firstResult);
    }
  });
});
