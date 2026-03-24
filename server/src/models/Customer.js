import { Timestamp } from 'firebase-admin/firestore';

export default class Customer{
  constructor({ customerId, firstName, lastName, email, phone, loyaltyPoints=0 }){
    this.customerId = customerId;
    this.firstName = firstName;
    this.lastName = lastName || null;
    this.email = email; // Should it have || null? Or perhaps customers should have either email or phone, but not neither.
    this.phone = phone || null;
    this.loyaltyPoints = loyaltyPoints;
    this.createdAt = Timestamp.now();
  }
}