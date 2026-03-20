// services/menuService.js
import PurchasableItem from "../models/PurchasableItem.js";

let items = [
  new PurchasableItem("1", "Burger", "food", 5.99),
  new PurchasableItem("2", "Pizza", "food", 8.99)
];

let nextId = 3

// get all items
function getAllMenu() {
  return items;
}

// get item by ID
function getMenuById(itemId) {
  return items.find(item => item.itemId === itemId) || null;
}

// create a new item
function createMenuItem(data) {
  const newItem = new PurchasableItem(
    String(nextId++), 
    data.itemName,
    data.categoryId,
    data.basePrice,
    data.description || null,
    data.previewImage || null,
    data.sizes || [],
    data.flavors || [],
    data.available ?? true,
    data.taxable ?? true
  );
  items.push(newItem);
  return newItem;
}

// update an existing item
function updateMenuItem(itemId, update) {
  const item = items.find(item => item.itemId === itemId);
  if (!item) return null;

  Object.assign(item, update);
  return item;
}

// delete an item
function deleteMenuItem(itemId) {
  const index = items.findIndex(item => item.itemId === itemId);
  if (index === -1) return null;

  return items.splice(index, 1)[0];
}

// export functions for controller
export {
  getAllMenu,
  getMenuById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};