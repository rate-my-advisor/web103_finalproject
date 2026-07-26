import express from "express"
import reviewController from "../controllers/reviewController.js"

const router = express.Router()

router.get("/advisor/:advisorId", reviewController.getReviewsByAdvisor)

router.post("/", reviewController.createReview)
router.delete("/:reviewId", reviewController.deleteReview)
router.patch("/:reviewId", reviewController.updateReview)

export default router