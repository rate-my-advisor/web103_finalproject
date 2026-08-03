import express from "express"
import universityController from "../controllers/universityController.js"

const router = express.Router()

router.get("/", universityController.getUniversities)
router.get("/:universityId/advisors", universityController.getAdvisorsByUniversity)

router.post("/", universityController.createUniversity)

export default router