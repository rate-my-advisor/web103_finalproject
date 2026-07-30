import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import ReviewCard from "../components/ReviewCard.jsx";
import AdvisorProfileCard from "../components/AdvisorProfileCard.jsx";
import AdvisorRatingCard from "../components/AdvisorRatingCard.jsx";
import { getAdvisorById, getReviewsByAdvisor } from "../api/advisors";
import "../css/ViewAdvisor.css";

const ViewAdvisor = () => {
  const rawId = Number(useParams().id) || null;
  const [advisor, setAdvisor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  // Safely parse to number
  const id = Number(rawId);
  const isValidId = Boolean(rawId) && !Number.isNaN(id);

  useEffect(() => {
    if (!isValidId) return;

    const loadAdvisor = async () => {
      try {
        const [advisor, reviews] = await Promise.all([
          getAdvisorById(id),
          getReviewsByAdvisor(id),
        ]);
        setAdvisor(advisor);
        setReviews(reviews);
      } catch (error) {
        setError(error.message);
      }
    };
    loadAdvisor();
  }, [id, isValidId]);

  // Id not a number
  if (!isValidId) {
    return (
      <>
        <SiteHeader />
        <main className="container">
          <h1>Invalid id</h1>
          <Link to="/">Return home</Link>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SiteHeader />
        <main className="container">
          <h1>{error}</h1>
          <Link to="/">Return home</Link>
        </main>
      </>
    );
  }

  if (!advisor) {
    return (
      <>
        <SiteHeader />
        <main className="container">
          <p>Loading advisor…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="summary-section">
          <AdvisorProfileCard advisor={advisor} />
          <AdvisorRatingCard advisor={advisor} reviews={reviews} />
        </section>

        <section className="reviews">
          <h2>Reviews</h2>
          {reviews.length === 0 ? (
            <p className="no-reviews-msg">No reviews written for this advisor yet.</p>
          ) : (
            reviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))
          )}
        </section>
      </main>
    </>
  );
};

export default ViewAdvisor;

