# Donation Form Data Models

The data models for the Internet Archive donation form

## Installation

```bash
yarn add @internetarchive/donation-form-data-models
```

## Usage

This is meant to be used in conjunction with the Internet Archive donation form, but
you can instantiate the models:

```js
import {
  CustomerInfo,
  DonationPaymentInfo,
} from '@internetarchive/donation-form-data-models';

const customer = new CustomerInfo({
  email: 'foo@bar.com',
  firstName: 'Fooey',
  lastName: 'McBarrison',
});

const donationInfo = new DonationPaymentInfo({
  donationType: DonationType.OneTime,
  amount: 3.5,
  coverFees: false,
});

// donationInfo.total = 3.5
```

# Development

## Prerequisite

```bash
yarn install
```

## Start Development Server

```bash
yarn start
```

## Testing

```bash
yarn test
```

## Testing via browserstack

```bash
yarn test:bs
```

## Linting

```bash
yarn lint
```
