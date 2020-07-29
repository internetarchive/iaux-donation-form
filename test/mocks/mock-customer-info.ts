import { CustomerInfo } from '../../src/models/common/customer-info';

export class MockCustomerInfo extends CustomerInfo {
  email = 'foo@bar.com';
  firstName = 'Fooey';
  lastName = 'McBarrison';
}
