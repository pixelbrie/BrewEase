const express = require("express");
const router = express.Router();

const menuController = require("../controllers/menuController")

router.get("/menu", menuController.getAllMenu);

router.get("/menu/:id", menuController.getMenuById);

router.post("/menu", menuController.createMenuItem);

router.delete("/menu/:id", menuController.deleteMenuItem);

router.put("/menu/:id", menuController.updateMenuItem);

module.exports = router;