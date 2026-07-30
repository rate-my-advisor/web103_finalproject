import express from "express"
import advisorController from "../controllers/advisorController.js"

const router = express.Router()

router.get("/", advisorController.getAdvisors)
router.get("/:advisorId", advisorController.getAdvisorById)

router.post("/", advisorController.createAdvisor)
router.delete("/:advisorId", advisorController.deleteAdvisor)
router.patch("/:advisorId", advisorController.updateAdvisor)

export default router