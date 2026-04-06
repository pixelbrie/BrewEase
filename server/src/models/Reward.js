import { Timestamp } from 'firebase-admin/firestore';

export default class Reward {
  constructor({ rewardId, name, description, pointsCost, type, active = true }) {
    this.rewardId = rewardId;
    this.name = name;                 // e.g., "Free Drink"
    this.description = description;   // e.g., "Redeem any drink on the menu"
    this.pointsCost = pointsCost;     // e.g., 100
    this.type = type;                 // "free_item", "discount_percent", "discount_flat"
    this.active = active;             // admin can toggle off without deleting
    this.createdAt = Timestamp.now();
  }
}
