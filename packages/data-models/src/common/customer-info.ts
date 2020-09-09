export class CustomerInfo {
  email?: string;
  firstName?: string;
  lastName?: string;

  constructor(params?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  }) {
    this.email = params?.email;
    this.firstName = params?.firstName;
    this.lastName = params?.lastName;
  }
}
