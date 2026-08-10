import { expect } from '@open-wc/testing';
import sinon from 'sinon';
import { VenmoRestorationStateHandler } from '../../../src/payment-flow-handlers/handlers/venmo-restoration-state-handler';

describe('VenmoRestorationStateHandler', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('does not throw when accessing localStorage/sessionStorage throws (e.g. Safari private browsing)', () => {
    sinon.stub(window, 'localStorage').get(() => {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    });
    sinon.stub(window, 'sessionStorage').get(() => {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    });

    expect(() => new VenmoRestorationStateHandler()).to.not.throw();
  });

  it('falls back to sessionStorage when localStorage is unavailable', () => {
    sinon.stub(window, 'localStorage').get(() => {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    });

    const handler = new VenmoRestorationStateHandler();
    handler.clearState();
    expect(() => handler.clearState()).to.not.throw();
  });

  it('uses the provided storageSystem when given', () => {
    const storageSystem = window.sessionStorage;
    const handler = new VenmoRestorationStateHandler({ storageSystem });
    const removeItemSpy = sinon.spy(storageSystem, 'removeItem');

    handler.clearState();

    expect(removeItemSpy.calledWith('venmoRestorationStateInfo')).to.be.true;
  });
});
