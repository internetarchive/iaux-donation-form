import { html, fixture, expect } from '@open-wc/testing';
import { CurrencyValidator } from '../src/currency-validator';

describe('Currency Validator', () => {
  it('Allows a currency value', async () => {
    const validator = new CurrencyValidator();
    const el = (await fixture(html`
      <input type="text" @keydown=${validator.keydown} />
    `)) as HTMLInputElement;
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: '3',
    });
    let preventCalled = false;
    keyDownEvent.preventDefault = (): void => {
      preventCalled = true;
    };
    el.dispatchEvent(keyDownEvent);
    expect(preventCalled).to.be.false;
  });

  it('Disallows a non-currency value', async () => {
    const validator = new CurrencyValidator();
    const el = (await fixture(html`
      <input type="text" @keydown=${validator.keydown} />
    `)) as HTMLInputElement;
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: 'a',
    });
    let preventCalled = false;
    keyDownEvent.preventDefault = (): void => {
      preventCalled = true;
    };
    el.dispatchEvent(keyDownEvent);
    expect(preventCalled).to.be.true;
  });

  it('Allows a single decimal', async () => {
    const validator = new CurrencyValidator();
    const el = (await fixture(html`
      <input type="text" value="3" @keydown=${validator.keydown} />
    `)) as HTMLInputElement;
    el.selectionStart = 1;
    el.selectionEnd = 1;
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: '.',
    });
    let preventCalled = false;
    keyDownEvent.preventDefault = (): void => {
      preventCalled = true;
    };
    el.dispatchEvent(keyDownEvent);
    expect(preventCalled).to.be.false;
  });

  it('Disallows multiple decimals', async () => {
    const validator = new CurrencyValidator();
    const el = (await fixture(html`
      <input type="text" value="3.3" @keydown=${validator.keydown} />
    `)) as HTMLInputElement;
    el.selectionStart = 3;
    el.selectionEnd = 3;
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: '.',
    });
    let preventCalled = false;
    keyDownEvent.preventDefault = (): void => {
      preventCalled = true;
    };
    el.dispatchEvent(keyDownEvent);
    expect(preventCalled).to.be.true;
  });

  it('Checks for final validity after a selected range is modified', async () => {
    const validator = new CurrencyValidator();
    const el = (await fixture(html`
      <input type="text" value="456" @keydown=${validator.keydown} />
    `)) as HTMLInputElement;
    el.selectionStart = 1;
    el.selectionEnd = 2;
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: '3',
    });
    let preventCalled = false;
    keyDownEvent.preventDefault = (): void => {
      preventCalled = true;
    };
    el.dispatchEvent(keyDownEvent);
    expect(preventCalled).to.be.false;
  });

  it('Allows changes when user selects all', async () => {
    const validator = new CurrencyValidator();
    const el = (await fixture(html`
      <input type="text" value="456" @keydown=${validator.keydown} />
    `)) as HTMLInputElement;
    el.selectionStart = 0;
    el.selectionEnd = 3;
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: '3',
    });
    let preventCalled = false;
    keyDownEvent.preventDefault = (): void => {
      preventCalled = true;
    };
    el.dispatchEvent(keyDownEvent);
    expect(preventCalled).to.be.false;
  });

  it('Checks for final invalidity after a selected range is modified', async () => {
    const validator = new CurrencyValidator();
    const el = (await fixture(html`
      <input type="text" value="456" @keydown=${validator.keydown} />
    `)) as HTMLInputElement;
    el.selectionStart = 1;
    el.selectionEnd = 2;
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: 'a',
    });
    let preventCalled = false;
    keyDownEvent.preventDefault = (): void => {
      preventCalled = true;
    };
    el.dispatchEvent(keyDownEvent);
    expect(preventCalled).to.be.true;
  });

  it('Allows the metakey', async () => {
    const validator = new CurrencyValidator();
    const el = (await fixture(html`
      <input type="text" value="456" @keydown=${validator.keydown} />
    `)) as HTMLInputElement;
    const keyDownEvent = new KeyboardEvent('keydown', {
      metaKey: true,
    });
    let preventCalled = false;
    keyDownEvent.preventDefault = (): void => {
      preventCalled = true;
    };
    el.dispatchEvent(keyDownEvent);
    expect(preventCalled).to.be.false;
  });

  it('Allows some modifier keys', async () => {
    const validator = new CurrencyValidator();
    const el = (await fixture(html`
      <input type="text" value="456" @keydown=${validator.keydown} />
    `)) as HTMLInputElement;

    const allowedModifiers = [
      'Tab',
      'Delete',
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
    ];

    let preventCalled = false;
    allowedModifiers.forEach(modifier => {
      const keyDownEvent = new KeyboardEvent('keydown', {
        key: modifier,
      });
      keyDownEvent.preventDefault = (): void => {
        preventCalled = true;
      };
      el.dispatchEvent(keyDownEvent);
    });
    expect(preventCalled).to.be.false;
  });

  it('Disallows other modifier keys', async () => {
    const validator = new CurrencyValidator();
    const el = (await fixture(html`
      <input type="text" value="456" @keydown=${validator.keydown} />
    `)) as HTMLInputElement;

    const disallowedModifiers = ['Shift', 'Control'];

    disallowedModifiers.forEach(modifier => {
      let preventCalled = false;
      const keyDownEvent = new KeyboardEvent('keydown', {
        key: modifier,
      });
      keyDownEvent.preventDefault = (): void => {
        preventCalled = true;
      };
      el.dispatchEvent(keyDownEvent);
      expect(preventCalled).to.be.true;
    });
  });
});
