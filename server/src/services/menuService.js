//doc = pulling out one specific part of the database
//get = opening that part and reading it 

export async function getAllMenu() {
    const ss = await db.collection('purchaseableItems').get();
    return ss.docs.map(doc =>({
        itemId: doc.id, ...doc.data()}));
}

export async function getMenuById(itemId) {
    const doc = await db.collection('purchaseableItems').doc(itemId).get();
    if(!doc.exists) return null;
    return {itemId: doc.id, ...doc.data()}
}

export async function createMenuItem(item) {
    const docRef = await db.collection('purchaseableItems').add(item);
    return {itemId: docRef.id, ...item};
}

export async function updateMenuItem(itemId, update) {
    await db.collection('purchaseableItems').doc(itemId).update(update);
    return { itemId, ...update} 
}

export async function deleteMenuItem(itemId) {
    await db.collection('purchaseableItems').doc(itemId).delete();
    return {itemId, message: "Menu Item Deleted"};
}