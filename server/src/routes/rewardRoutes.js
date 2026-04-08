import express from "express"
import {
  createReward,
  getRewardById,
  getAllRewards,
  updateReward,
  deleteReward,
  accumulatePoints,
} from "../controllers/rewardController.js"

const router = express.Router()

router.post("/", createReward)
router.post("/accumulate", accumulatePoints)
router.get("/", getAllRewards)
router.get("/:id", getRewardById)
router.patch("/:id", updateReward)
router.delete("/:id", deleteReward)

export default router
