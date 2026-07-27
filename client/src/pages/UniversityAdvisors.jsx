import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { getAdvisorsByUniversity } from "../api/advisors";
import "../css/UniversityAdvisors.css";

const UniversityAdvisors = () => {
  const { universityName } = useParams();
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formattedUniversityName = decodeURIComponent(universityName || "")
    .replace(/-/g, " ")
    .trim();

  useEffect(() => {
    const loadAdvisors = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdvisorsByUniversity(formattedUniversityName);

        setAdvisors(
          [...data].sort((firstAdvisor, secondAdvisor) =>
            firstAdvisor.name.localeCompare(secondAdvisor.name),
          ),
        );
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadAdvisors();
  }, [formattedUniversityName]);

  return (
    <>
      <SiteHeader />

      <main className="advisor-list-page">
        <h1>Advisors at {formattedUniversityName}</h1>

        {loading && <p>Loading advisors…</p>}

        {error && <p className="advisor-message">{error}</p>}

        {!loading && !error && advisors.length === 0 && (
          <section className="advisor-empty-state">
            <h2>No advisors found</h2>
            <p>No advisor profiles are available for this university yet.</p>
          </section>
        )}

        {!loading && !error && advisors.length > 0 && (
          <section className="advisor-list" aria-label="University advisors">
            {advisors.map((advisor) => (
              <Link
                className="advisor-card"
                key={advisor.id}
                to={`/advisor/${advisor.id}`}
              >
                <div>
                  <h2>{advisor.name}</h2>
                  <p className="advisor-specialty">{advisor.specialty}</p>
                  <p className="advisor-department">{advisor.department}</p>
                </div>

                <div
                  className="advisor-rating"
                  aria-label={`${advisor.rating} out of 5`}
                >
                  {advisor.rating} / 5
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>
    </>
  );
};

export default UniversityAdvisors;