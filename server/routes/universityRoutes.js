import express from "express"
import universityController from "../controllers/universityController.js"

const router = express.Router()

router.get("/", universityController.getUniversities)
router.get("/advisors/:universityId", universityController.getAdvisorsByUniversity)

export default router