import { CodedError } from './coded-error.js';

export class ErrorResponse {
  message: string;
  errors: CodedError[];

  /**
   * Creates an instance of ErrorResponse.
   * @param {message: string, errors: BraintreeError[]} params
   * @memberof ErrorResponse
   */
  constructor(params: {
    message: string;
    errors?: CodedError[];
  }) {
    this.message = params.message;

    const { errors = [] } = params;
    this.errors = errors.map((error: CodedError) => new CodedError(error));
  }
}
