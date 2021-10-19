import { fixture, expect } from '@open-wc/testing';
import { MockGrecaptcha, MockGrecaptchaMode } from '../mocks/payment-clients/mock-grecaptcha';
import { RecaptchaManager } from '../../src/recaptcha-manager/recaptcha-manager';
import { html } from 'lit';

describe('ReCaptcha Manager', () => {
  it('can execute the recaptcha like a Promise', async () => {
    const recaptchaElement = (await fixture(html`
      <div></div>
    `)) as HTMLElement;
    const mockGrecaptcha = new MockGrecaptcha(MockGrecaptchaMode.Success);
    const recaptchaManager = new RecaptchaManager({
      grecaptchaLibrary: mockGrecaptcha,
      siteKey: '123',
    });
    recaptchaManager.setup(recaptchaElement, 1, 'dark', 'image');
    const result = await recaptchaManager.execute();
    expect(result).to.equal('foo');
  });

  it('can error properly like a Promise', async () => {
    const recaptchaElement = (await fixture(html`
      <div></div>
    `)) as HTMLElement;
    const mockGrecaptcha = new MockGrecaptcha(MockGrecaptchaMode.Error);
    const recaptchaManager = new RecaptchaManager({
      grecaptchaLibrary: mockGrecaptcha,
      siteKey: '123',
    });
    recaptchaManager.setup(recaptchaElement, 1, 'dark', 'image');
    try {
      await recaptchaManager.execute();
      expect.fail('should not get here');
    } catch (error) {
      expect(error).to.equal('error');
    }
  });

  it('can expire properly like a Promise', async () => {
    const recaptchaElement = (await fixture(html`
      <div></div>
    `)) as HTMLElement;
    const mockGrecaptcha = new MockGrecaptcha(MockGrecaptchaMode.Expired);
    const recaptchaManager = new RecaptchaManager({
      grecaptchaLibrary: mockGrecaptcha,
      siteKey: '123',
    });
    recaptchaManager.setup(recaptchaElement, 1, 'dark', 'image');
    try {
      await recaptchaManager.execute();
      expect.fail('should not get here');
    } catch (error) {
      expect(error).to.equal('expired');
    }
  });

  it('resets the captcha if execute() gets called more than once', async () => {
    const recaptchaElement = (await fixture(html`
      <div></div>
    `)) as HTMLElement;
    const mockGrecaptcha = new MockGrecaptcha(MockGrecaptchaMode.Success, true);
    const recaptchaManager = new RecaptchaManager({
      grecaptchaLibrary: mockGrecaptcha,
      siteKey: '123',
    });
    recaptchaManager.setup(recaptchaElement, 1, 'dark', 'image');
    recaptchaManager.execute();
    expect(mockGrecaptcha.resetCalled).to.be.false;
    recaptchaManager.execute();
    expect(mockGrecaptcha.resetCalled).to.be.true;
  });
});
