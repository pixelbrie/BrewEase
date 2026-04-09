import express from "express";
import * as menuController from "../controllers/menuController.js";

const router = express.Router();

router.get("/menu", menuController.getAllMenu);
router.get("/menu/:id", menuController.getMenuById);
router.post("/menu", menuController.createMenuItem);
router.put("/menu/:id", menuController.updateMenuItem);
router.delete("/menu/:id", menuController.deleteMenuItem);

export default router;