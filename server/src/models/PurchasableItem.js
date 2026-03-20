export default class PurchasableItem {
  constructor({ itemId, itemName, categoryId, basePrice, description=null, previewImage=null, sizes=[], flavors=[], available=true, taxable=true }) {
    this.itemId = itemId;
    this.itemName = itemName;
    this.categoryId = categoryId;
    this.description = description;
    this.previewImage = previewImage;
    this.sizes = sizes;
    this.flavors = flavors;
    this.basePrice = basePrice;
    this.available = available;
    this.taxable = taxable;
  }
}