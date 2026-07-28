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

const ReviewCard = ({ review }) => {
  const {
    username,
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

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="user-info">
          <span className="username">@{username}</span>
          <span className="review-date">{formattedDate}</span>
        </div>

        <div className="overall-rating">
          <span className="rating-num">{overall_rating}</span>
          <span className="rating-label"> / 5</span>
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

      <p className="review-comment">"{comment}"</p>

      <div className="review-footer">
        {would_recommend ? (
          <span className="recommend-tag yes">✓ Recommends Advisor</span>
        ) : (
          <span className="recommend-tag no">✗ Does Not Recommend</span>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
