import express from "express"
import reviewController from "../controllers/reviewController.js"
import { ensureAuthenticated } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public endpoints (Accessible by everyone, including anonymous users)
router.get("/advisor/:advisorId", reviewController.getReviewsByAdvisor)
router.post("/", reviewController.createReview)

// Protected endpoints (Require owner/admin auth to modify/delete)
router.delete("/:reviewId", ensureAuthenticated, reviewController.deleteReview)
router.patch("/:reviewId", ensureAuthenticated, reviewController.updateReview)

export default router