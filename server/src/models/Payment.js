import { Timestamp } from 'firebase-admin/firestore';

export default class Payment {
<<<<<<< HEAD
  constructor({ paymentId, orderId, provider, status, amount, paymentMethod, createdAt, transactionId=null, last4=null }) {
=======
  constructor(paymentId, orderId, provider, status, amount, paymentMethod, createdAt, transactionId=null, last4=null) {
>>>>>>> 9159b27 (feat: finished models)
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