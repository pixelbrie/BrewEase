import { Timestamp } from 'firebase-admin/firestore';

export default class Order {
<<<<<<< HEAD
  constructor({ orderId, orderSource, paymentStatus, fulfillmentStatus, subtotal, tax, tip, totalPrice, createdAt, customerId=null, employeeId=null, items=[] }) {
=======
  constructor(orderId, orderSource, paymentStatus, fulfillmentStatus, subtotal, tax, tip, totalPrice, createdAt, customerId=null, employeeId=null, items=[]) {
>>>>>>> 9159b27 (feat: finished models)
    this.orderId = orderId;
    this.customerId = customerId;
    this.employeeId = employeeId;
    this.orderSource = orderSource;
    this.paymentStatus = paymentStatus;
    this.fulfillmentStatus = fulfillmentStatus;
    this.items = items; // Array of maps containing an item which holds: itemId, itemName, size, flavor, quantity, unitPriceAtPurchase, and totalLinePrice
    this.subtotal = subtotal;
    this.tax = tax;
    this.tip = tip;
    this.totalPrice = totalPrice;
    this.createdAt = Timestamp.now();
  }
}