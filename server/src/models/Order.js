import { Timestamp } from 'firebase-admin/firestore';

export default class Order {
  constructor({ orderId, orderSource, paymentStatus, fulfillmentStatus, subtotal, tax, tip, totalPrice, createdAt, customerId=null, employeeId=null, items=[] }) {
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