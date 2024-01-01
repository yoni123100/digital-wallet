export enum TransactionStatus {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PENDING = 'pending',
  CANCELED = 'canceled',
}

export type RequestedTransactionStatus = TransactionStatus.ACCEPTED | TransactionStatus.REJECTED;
