import { ErrorResponse } from '../src/response-models/error-models/error-response';
import { expect } from '@open-wc/testing';

describe('ErrorResponse', () => {
  it('can initialize with just a message', async () => {
    const errorResponse = new ErrorResponse({
      message: 'Foo went bad',
    });

    expect(errorResponse.message).to.equal('Foo went bad');
    expect(errorResponse.errors.length).to.equal(0);
  });

  it('can initialize with coded errors', async () => {
    const errorResponse = new ErrorResponse({
      message: 'Foo went bad',
      errors: [{ code: '12345', message: 'Foo went bad' }],
    });

    expect(errorResponse.message).to.equal('Foo went bad');
    expect(errorResponse.errors.length).to.equal(1);
    expect(errorResponse.errors[0].code).to.equal('12345');
    expect(errorResponse.errors[0].message).to.equal('Foo went bad');
  });
});
