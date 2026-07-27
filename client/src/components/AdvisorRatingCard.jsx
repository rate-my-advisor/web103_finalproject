const StarRating = ({ rating }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = rating ? Math.min(1, Math.max(0, rating - (star - 1))) : 0;
        return (
          <span key={star} className="star-wrapper">
            <span className="star-empty">★</span>
            <span
              className="star-filled"
              style={{ width: `${fill * 100}%` }}
            >
              ★
            </span>
          </span>
        );
      })}
    </div>
  );
};

const AdvisorRatingCard = ({ advisor, reviews = [] }) => {
  if (!advisor) return null;

  const recommendCount = reviews.filter((r) => r.would_recommend).length;
  const recommendPercent =
    reviews.length > 0 ? Math.round((recommendCount / reviews.length) * 100) : null;

  const numericRating = advisor.rating != null ? Number(advisor.rating) : null;

  return (
    <div className="rating-column">
      <h3 className="section-title">Summary</h3>
      <div className="advisor-rating-card">
        <div className="rating-header">OVERALL STUDENT RATING</div>

        <div className="big-rating-row">
          <span className="big-rating">
            {numericRating !== null ? numericRating.toFixed(1) : "N/A"}
          </span>
          <span className="rating-max">/5</span>
        </div>

        <StarRating rating={numericRating} />

        <p className="reviews-count-text">
          Based on {reviews.length} student {reviews.length === 1 ? "review" : "reviews"}
        </p>

        <hr className="rating-divider" />

        <div className="recommend-footer">
          {recommendPercent !== null ? (
            <strong>{recommendPercent}% would recommend {advisor.first_name}</strong>
          ) : (
            <span>No student recommendations yet</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvisorRatingCard;
