/**
 * This a code-message pair for more easily identifying an error.
 */
export class CodedError {
  code: string;
  message: string;

  /**
   * Creates an instance of CodedError.
   * @param {code: string, message: string} params
   * @memberof CodedError
   */
  constructor(params: { code: string; message: string }) {
    this.code = params.code;
    this.message = params.message;
  }
}
