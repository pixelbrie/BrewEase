import { Timestamp } from 'firebase-admin/firestore';

export default class Reward {
  constructor({ rewardId, name, description, pointsCost, type, discountValue, active = true }) {
    this.rewardId = rewardId;
    this.name = name;                 
    this.description = description;   
    this.pointsCost = pointsCost;     
    this.type = type; // free_item/discount
    this.discountValue = discountValue ?? null;    
    this.active = active; // if the reward is active or not
    this.createdAt = Timestamp.now();
  }
}
