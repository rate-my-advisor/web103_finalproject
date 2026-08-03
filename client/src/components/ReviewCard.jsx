import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteReview, updateReview } from "../api/advisors";
import "../css/ReviewCard.css";

const RatingBar = ({ label, value }) => {
  return (
    <div className="rating-row">
      <div className="rating-top">
        <span>{label}</span>
        <span>{value.toFixed(1)}/5</span>
      </div>

      <div className="rating-segments">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));

          return (
            <div key={i} className="segment">
              <div
                className="segment-fill"
                style={{ width: `${fill * 100}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ReviewCard = ({ review, onReviewDeleted, onReviewUpdated }) => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const initialState = {
    overall_rating: review.overall_rating || 5,
    communication_rating: review.communication_rating || 5,
    availability_rating: review.availability_rating || 5,
    comment: review.comment || "",
    would_recommend: String(review.would_recommend ?? true),
  }
  const [editForm, setEditForm] = useState(initialState)

  // Strict ownership check: both logged-in user ID and review user_id must exist and match
  const isOwner = Boolean(
    user &&
    user.id &&
    review.user_id &&
    Number(user.id) === Number(review.user_id)
  );

  const {
    name,
    username,
    avatar_url,
    user_avatar,
    overall_rating,
    communication_rating,
    availability_rating,
    comment,
    would_recommend,
    review_date,
  } = review;

  const formattedDate = new Date(review_date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const avatar = avatar_url || user_avatar;
  const displayName = name || (username ? `@${username}` : "Anonymous User");

  const handleReport = () => {
    setIsMenuOpen(false);
    alert("Thank you. This review has been reported.");
  };

  const handleDelete = async () => {
    setIsMenuOpen(false);
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await deleteReview(review.review_id);

      if (onReviewDeleted) {
        onReviewDeleted(review.review_id);
      }
    } catch (err) {
      alert(err.message || "Failed to delete review.");
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const data = await updateReview(review.review_id, {
        overall_rating: Number(editForm.overall_rating),
        communication_rating: Number(editForm.communication_rating),
        availability_rating: Number(editForm.availability_rating),
        would_recommend: editForm.would_recommend === "true" || editForm.would_recommend === true,
        comment: editForm.comment.trim(),
      });

      setIsEditing(false);
      if (onReviewUpdated) {
        onReviewUpdated(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-card">
      {isEditing ? (
        <form className="edit-review-form" onSubmit={handleSaveEdit}>
          <h3 className="edit-title">Edit Your Review</h3>
          {error && <p className="edit-error">{error}</p>}

          <div className="edit-fields-grid">
            <div className="edit-field">
              <label htmlFor={`overall-${review.review_id}`}>Overall Rating</label>
              <select
                id={`overall-${review.review_id}`}
                value={editForm.overall_rating}
                onChange={(e) => setEditForm({ ...editForm, overall_rating: e.target.value })}
                required
              >
                <option value="5">5 — Excellent</option>
                <option value="4">4 — Good</option>
                <option value="3">3 — Average</option>
                <option value="2">2 — Poor</option>
                <option value="1">1 — Very Poor</option>
              </select>
            </div>

            <div className="edit-field">
              <label htmlFor={`comm-${review.review_id}`}>Communication</label>
              <select
                id={`comm-${review.review_id}`}
                value={editForm.communication_rating}
                onChange={(e) => setEditForm({ ...editForm, communication_rating: e.target.value })}
                required
              >
                <option value="5">5 — Excellent</option>
                <option value="4">4 — Good</option>
                <option value="3">3 — Average</option>
                <option value="2">2 — Poor</option>
                <option value="1">1 — Very Poor</option>
              </select>
            </div>

            <div className="edit-field">
              <label htmlFor={`avail-${review.review_id}`}>Availability</label>
              <select
                id={`avail-${review.review_id}`}
                value={editForm.availability_rating}
                onChange={(e) => setEditForm({ ...editForm, availability_rating: e.target.value })}
                required
              >
                <option value="5">5 — Excellent</option>
                <option value="4">4 — Good</option>
                <option value="3">3 — Average</option>
                <option value="2">2 — Poor</option>
                <option value="1">1 — Very Poor</option>
              </select>
            </div>

            <div className="edit-field">
              <label htmlFor={`recommend-${review.review_id}`}>Recommend Advisor?</label>
              <select
                id={`recommend-${review.review_id}`}
                value={String(editForm.would_recommend)}
                onChange={(e) => setEditForm({ ...editForm, would_recommend: e.target.value })}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div className="edit-field">
            <label htmlFor={`comment-${review.review_id}`}>Comment</label>
            <textarea
              id={`comment-${review.review_id}`}
              rows="4"
              value={editForm.comment}
              onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
              placeholder="Write your review comments..."
            />
          </div>

          <div className="edit-actions">
            <button type="submit" className="save-btn" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setIsEditing(false);
                setEditForm(initialState);
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="review-header">
            <div className="user-info">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="reviewer-avatar"
                />
              ) : (
                <div className="reviewer-avatar-fallback">
                  👤
                </div>
              )}
              <div className="user-details">
                <span className="username">{displayName}</span>
                {name && username && (
                  <span className="user-handle">@{username}</span>
                )}
                <span className="review-date">{formattedDate}</span>
              </div>
            </div>

            <div className="review-header-right">
              <div className="overall-rating">
                <span className="rating-num">{overall_rating}</span>
                <span className="rating-label"> / 5</span>
              </div>

              <div className="review-actions-menu">
                <button
                  type="button"
                  className="menu-trigger-btn"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  aria-label="Review options"
                >
                  ⋮
                </button>

                {isMenuOpen && (
                  <div className="dropdown-menu">
                    {isOwner && (
                      <>
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsEditing(true);
                          }}
                        >
                          ✏️ Edit Review
                        </button>
                        <button
                          type="button"
                          className="dropdown-item delete-item"
                          onClick={handleDelete}
                        >
                          🗑️ Delete Review
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      className="dropdown-item report-item"
                      onClick={handleReport}
                    >
                      🚩 Report Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sub-ratings">
            <RatingBar
              label="Communication"
              value={communication_rating}
            />
            <RatingBar
              label="Availability"
              value={availability_rating}
            />
          </div>

          {comment && <p className="review-comment">"{comment}"</p>}

          <div className="review-footer">
            {would_recommend ? (
              <span className="recommend-tag yes">✓ Recommends Advisor</span>
            ) : (
              <span className="recommend-tag no">✗ Does Not Recommend</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewCard;
