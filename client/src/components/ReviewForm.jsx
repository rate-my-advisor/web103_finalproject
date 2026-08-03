import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createReview } from "../api/advisors";
import "../css/ReviewForm.css";

// small component (rating 1 to 5)
const RatingSelect = ({ id, name, value, onChange }) => {
    return (
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required
        >
            <option value="">Select a rating</option>
            <option value="5">5 — Excellent</option>
            <option value="4">4 — Good</option>
            <option value="3">3 — Average</option>
            <option value="2">2 — Poor</option>
            <option value="1">1 — Very poor</option>
        </select>
    );
};

// necessary fields to fill out
const initialFormData = {
    overall_rating: "",
    communication_rating: "",
    availability_rating: "",
    comment: "",
    would_recommend: "",
}

// prop is advisorId
const ReviewForm = ({ advisorId }) => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState(initialFormData)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    // when form is being filled out and changed
    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        setError("")
        setSuccessMessage("")

        const reviewData = {
            advisor_id: Number(advisorId),
            overall_rating: Number(formData.overall_rating),
            communication_rating: Number(formData.communication_rating),
            availability_rating: Number(formData.availability_rating),
            comment: formData.comment.trim() || null,
            would_recommend: formData.would_recommend === "true",
        }

        try {
            setIsSubmitting(true)
            console.log("Review is being submitted: ", reviewData)

            const result = await createReview(reviewData)

            console.log("Saved review:", result);

            setSuccessMessage("Review was submitted successfully.")
            // reset form after successful submission
            setFormData(initialFormData)
            // go back to advisor profile
                // replace: true (prevents accidental duplicate submissions
                // through browser navigation by replacing current page
                // in browder's history instead of adding a new history entry)
            navigate(`/advisor/${advisorId}`, { replace: true })
        } catch (err) {
            setError(err.message || "Unable to submit review. :(")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <fieldset className="review-form-section">
                <legend>Overall rating</legend>
                <p>How would you rate your overall experience with this advisor?</p>

                <RatingSelect
                    id="overall-rating"
                    name="overall_rating"
                    value={formData.overall_rating}
                    onChange={handleChange}
                />
            </fieldset>

            <fieldset className="review-form-section">
                <legend>Communication</legend>
                <p>How clearly and effectively did the advisor communicate?</p>

                <RatingSelect
                    id="communication-rating"
                    name="communication_rating"
                    value={formData.communication_rating}
                    onChange={handleChange}
                />
            </fieldset>

            <fieldset className="review-form-section">
                <legend>Availability</legend>
                <p>How available was the advisor when you needed assistance?</p>

                <RatingSelect
                    id="availability-rating"
                    name="availability_rating"
                    value={formData.availability_rating}
                    onChange={handleChange}
                />
            </fieldset>

            <fieldset className="review-form-section">
                <legend>Recommendation</legend>
                <p>Would you recommend this advisor to another student?</p>

                <div className="recommendation-options">
                <label>
                    <input
                        type="radio"
                        name="would_recommend"
                        value="true"
                        checked={formData.would_recommend === "true"}
                        onChange={handleChange}
                        required
                    />
                    Yes
                </label>

                <label>
                    <input
                        type="radio"
                        name="would_recommend"
                        value="false"
                        checked={formData.would_recommend === "false"}
                        onChange={handleChange}
                        required
                    />
                    No
                </label>
                </div>
            </fieldset>

            <div className="review-form-section">
                <label htmlFor="review-comment">
                <strong>Additional comments</strong>
                </label>

                <p>
                    Describe your experience with this advisor. Do not include private
                    or sensitive information.
                </p>

                <textarea
                    id="review-comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows="6"
                    maxLength="1000"
                    placeholder="Write your review here..."
                />

                {/* put limit of 1000 characters */}
                <p className="character-count">
                    {formData.comment.length}/1000 characters
                </p>
            </div>

            {error && (
                <p className="form-message form-error" role="alert">
                    {error}
                </p>
            )}

            {successMessage && (
                <p className="form-message form-success" role="status">
                    {successMessage}
                </p>
            )}

            <button
                className="submit-review-button"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    );
};

export default ReviewForm;
