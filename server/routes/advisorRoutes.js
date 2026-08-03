import express from "express"
import advisorController from "../controllers/advisorController.js"
import { ensureAuthenticated } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public endpoints (Accessible by everyone, including anonymous users)
router.get("/", advisorController.getAdvisors)
router.get("/:advisorId", advisorController.getAdvisorById)
router.post("/", advisorController.createAdvisor)
router.patch("/:advisorId", advisorController.updateAdvisor)

// Protected endpoints (Require authentication to edit or delete)
// router.delete("/:advisorId", ensureAuthenticated, advisorController.deleteAdvisor)

export default router
