import { Timestamp } from 'firebase-admin/firestore';

export default class Payment {
  constructor(paymentId, orderId, provider, status, amount, paymentMethod, createdAt, transactionId=null, last4=null) {
    this.paymentId = paymentId;
    this.orderId = orderId;
    this.provider = provider;
    this.transactionId = transactionId; 
    this.status = status;
    this.amount = amount;
    this.paymentMethod = paymentMethod;
    this.last4 = last4;
    this.createdAt = Timestamp.now();
  }
}