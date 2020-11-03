import { html, fixture, expect } from '@open-wc/testing';
import '../../../src/modals/error-modal-content';

describe('Error Modal Content', () => {
  it('renders a "Questions" link', async () => {
    const el = await fixture(html`
      <donation-form-error-modal-content></donation-form-error-modal-content>
    `);

    const questionsLink = el.shadowRoot?.querySelector('.container a');
    expect(questionsLink).to.exist;
    expect(questionsLink?.innerHTML).to.contain('Questions?');
  });
});
