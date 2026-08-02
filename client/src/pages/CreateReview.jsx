import ReviewForm from "../components/ReviewForm";
import SiteHeader from "../components/SiteHeader";
import { useParams } from "react-router-dom";
import "../css/CreateReview.css";

const CreateReview = () => {
    const { advisorId } = useParams();

    return (
        <>
            <SiteHeader />

            <main className="create-review-page">
                <div className="create-review-container">
                    <div className="create-review-heading">
                        <p>Advisor review</p>

                        <h1>Write a Review</h1>

                        <span>
                            Share your experience to help other students make informed decisions.
                        </span>
                    </div>

                    {/* pass advisorId as prop into component */}
                    <ReviewForm advisorId={advisorId} />
                </div>
            </main>
        </>
    );
} 

export default CreateReview;