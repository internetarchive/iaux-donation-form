/* eslint-disable @typescript-eslint/camelcase */
import { CustomerInfo } from '../../common/customer-info';
import { BillingInfo } from '../../common/billing-info';
import { SubscriptionResponse } from './subscription-response';
import { DonationType } from '../../donation-info/donation-type';

export class SuccessResponse {
  paymentMethodNonce: string;
  amount: string;
  donationType: DonationType;
  transaction_id: string;
  customer_id: string;
  customer: CustomerInfo;
  billing: BillingInfo;
  subscription?: SubscriptionResponse;

  constructor(params: {
    paymentMethodNonce: string;
    amount: string;
    donationType: DonationType;
    transaction_id: string;
    customer_id: string;
    customer: CustomerInfo;
    billing: BillingInfo;
    subscription?: SubscriptionResponse;
  }) {
    this.paymentMethodNonce = params.paymentMethodNonce;
    this.amount = params.amount;
    this.donationType = params.donationType;
    this.transaction_id = params.transaction_id;
    this.customer_id = params.customer_id;

    this.customer = new CustomerInfo(params.customer);
    this.billing = new BillingInfo(params.billing);

    if (params.subscription) {
      this.subscription = new SubscriptionResponse(params.subscription);
    }
  }
}
