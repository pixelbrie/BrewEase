import express from "express"
import cors from "cors"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
const authRoutes = require('./routes/authRoutes.js')
app.use('/api/auth', authRoutes)

app.get("/", (req, res) => {
  res.json({ message: "BrewEase API running" })
})

export default app
