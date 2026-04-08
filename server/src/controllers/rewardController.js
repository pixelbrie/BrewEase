import {
  createReward as createRewardService,
  getRewardById as getRewardByIdService,
  getAllRewards as getAllRewardsService,
  updateReward as updateRewardService,
  deleteReward as deleteRewardService,
  accumulatePointsForOrder as accumulatePointsForOrderService,
} from "../services/rewardService.js"

// ========================
// Reward Catalog CRUD
// ========================

const createReward = async (req, res) => {
  try {
    const { name, description, pointsCost, type, discountValue, active } = req.body

    const reward = await createRewardService({
      name,
      description,
      pointsCost,
      type,
      discountValue,
      active,
    })

    return res.status(201).json(reward)
  } catch (err) {
    if (err.message.includes("required") || err.message.includes("must be")) {
      return res.status(400).json({ error: err.message })
    }
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
}

const getRewardById = async (req, res) => {
  try {
    const { id } = req.params
    const reward = await getRewardByIdService(id)

    return res.status(200).json(reward)
  } catch (err) {
    if (err.message === "Reward not found") {
      return res.status(404).json({ error: err.message })
    }
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
}

const getAllRewards = async (req, res) => {
  try {
    const activeOnly = req.query.activeOnly === "true"
    const rewards = await getAllRewardsService({ activeOnly })

    return res.status(200).json(rewards)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
}

const updateReward = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const reward = await updateRewardService(id, updates)

    return res.status(200).json(reward)
  } catch (err) {
    if (err.message === "Reward not found") {
      return res.status(404).json({ error: err.message })
    }
    if (
      err.message.includes("required") ||
      err.message.includes("cannot be empty") ||
      err.message.includes("no valid fields") ||
      err.message.includes("must be")
    ) {
      return res.status(400).json({ error: err.message })
    }
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
}

const deleteReward = async (req, res) => {
  try {
    const { id } = req.params
    await deleteRewardService(id)

    return res.status(200).json({ message: "Reward deleted" })
  } catch (err) {
    if (err.message === "Reward not found") {
      return res.status(404).json({ error: err.message })
    }
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
}

// ========================
// Points Accumulation
// ========================

const accumulatePoints = async (req, res) => {
  try {
    const { customerId, orderTotal } = req.body

    const result = await accumulatePointsForOrderService(customerId, orderTotal)

    return res.status(200).json(result)
  } catch (err) {
    if (err.message === "Customer not found") {
      return res.status(404).json({ error: err.message })
    }
    if (err.message.includes("required") || err.message.includes("must be")) {
      return res.status(400).json({ error: err.message })
    }
    console.error(err)
    return res.status(500).json({ error: "Server error" })
  }
}


export {
  createReward,
  getRewardById,
  getAllRewards,
  updateReward,
  deleteReward,
  accumulatePoints,
}
