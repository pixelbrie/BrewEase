export default class PurchasableItem {
<<<<<<< HEAD
  constructor({ itemId, itemName, categoryId, basePrice, description=null, previewImage=null, sizes=[], flavors=[], available=true, taxable=true }) {
=======
  constructor(itemId, itemName, categoryId, basePrice, description=null, previewImage=null, sizes=[], flavors=[], available=true, taxable=true) {
>>>>>>> 9159b27 (feat: finished models)
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