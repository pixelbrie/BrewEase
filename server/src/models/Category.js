export default class Category {
  constructor(categoryId, name, orderIndex, active=true) {
    this.categoryId = categoryId;
    this.name = name;
    this.orderIndex = orderIndex;
    this.active = active;
  }
}