import express from "express"
import reviewController from "../controllers/reviewController.js"
import { ensureAuthenticated } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public endpoints (Accessible by everyone, including anonymous users)
router.get("/advisors/:advisorId", reviewController.getReviewsByAdvisor)

router.post("/", reviewController.createReview)

// Protected endpoints
router.patch("/:reviewId/like", ensureAuthenticated, reviewController.toggleReviewLike)

// Review authors can modify or delete only their own reviews
router.delete("/:reviewId", ensureAuthenticated, reviewController.deleteReview)
router.patch("/:reviewId", ensureAuthenticated, reviewController.updateReview)

export default router
