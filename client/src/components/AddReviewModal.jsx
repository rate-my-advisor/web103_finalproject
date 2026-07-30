import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createReview } from "../api/advisors";
import "../css/AddReviewModal.css";

const AddReviewModal = ({ advisorId, isOpen, onClose, onReviewAdded }) => {
  const { user } = useAuth();
  const [overallRating, setOverallRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [availabilityRating, setAvailabilityRating] = useState(5);
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const reviewData = {
        advisor_id: Number(advisorId),
        overall_rating: Number(overallRating),
        communication_rating: Number(communicationRating),
        availability_rating: Number(availabilityRating),
        comment: comment.trim(),
        would_recommend: wouldRecommend,
        user_id: user ? user.id : null,
      };

      const newReview = await createReview(reviewData);

      // attach user details or fallback to Anonymous User
      const enrichedReview = {
        ...newReview,
        name: user ? user.name : "Anonymous User",
        username: user ? user.username : null,
        avatar_url: user ? user.avatar_url : null,
      };

      onReviewAdded(enrichedReview);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Write a Review</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {error && <div className="form-error">{error}</div>}

          {!user && (
            <div className="anon-notice">
              <span className="anon-badge">Posting Anonymously</span>
              <p>You are not logged in. Your review will be posted as <strong>Anonymous User</strong>.</p>
            </div>
          )}

          <div className="form-group">
            <label>Overall Rating (1 - 5)</label>
            <select
              value={overallRating}
              onChange={(e) => setOverallRating(e.target.value)}
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Communication Rating (1 - 5)</label>
            <select
              value={communicationRating}
              onChange={(e) => setCommunicationRating(e.target.value)}
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Availability Rating (1 - 5)</label>
            <select
              value={availabilityRating}
              onChange={(e) => setAvailabilityRating(e.target.value)}
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Would you recommend this advisor?</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="recommend"
                  checked={wouldRecommend === true}
                  onChange={() => setWouldRecommend(true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="recommend"
                  checked={wouldRecommend === false}
                  onChange={() => setWouldRecommend(false)}
                />
                No
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Review Comment</label>
            <textarea
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details of your experience with this advisor..."
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;
