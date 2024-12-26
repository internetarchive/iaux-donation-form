type BtNextBillingDate = {
  date: string;
  timezone_type: number;
  timezone: string;
}

type BtData = {
  billingDayOfMonth: number;
  nextBillingDate: BtNextBillingDate;
  status: string;  // active, inactive
  paymentMethodType: string; // cc, paypal, venmo, etc
  last4: string|null;
  cardType: string|null;
  expirationMonth: string|null;
  expirationYear: string|null;
  paypalEmail?: string;
  venmoUsername?: string;
}

type aSummary = {
  id: string;
  token: string;
  amount: number;
  start_date: string;
  contribution_status_id: number;
  is_test: boolean;
  btdata: BtData;
}

export default class SubscriptionSummary {
  summary: aSummary;
  currencyType: string;
  payment: BtData;

  constructor(summary: aSummary) {
    this.summary = summary;
    this.payment = summary.btdata;
    this.currencyType = 'USD'; // not in data
  }

  get id(): string {
    return this.summary.id;
  }

  get amount(): number {
    return this.summary.amount;
  }

  get startDate(): string {
    return this.summary.start_date;
  }

  get isTest(): boolean {
    return this.summary.is_test;
  }
}