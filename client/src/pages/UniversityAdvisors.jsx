import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { getAdvisorsByUniversity } from "../api/advisors";
import "../css/UniversityAdvisors.css";

const UniversityAdvisors = () => {
  const { universityId } = useParams();
  const [universityName, setUniversityName] = useState("")
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAdvisors = async () => {
      try {
        setLoading(true);
        setError("");

        const {university, advisors} = await getAdvisorsByUniversity(universityId);

        setUniversityName(university.name)
        setAdvisors(
          [...advisors].sort((firstAdvisor, secondAdvisor) =>
            firstAdvisor.first_name.localeCompare(secondAdvisor.first_name),
          ),
        );
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadAdvisors();
  }, [universityId]);

  return (
    <>
      <SiteHeader />

      <main className="advisor-list-page">
        <h1>Advisors at {universityName ? universityName: "..."}</h1>

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
                key={advisor.advisor_id}
                to={`/advisor/${advisor.advisor_id}`}
              >
                <div>
                  <h2>{`${advisor.first_name} ${advisor.last_name}`}</h2>
                  <p className="advisor-email">{advisor.email}</p>
                  <p className="advisor-department">{advisor.department}</p>
                </div>

                <div
                  className="advisor-rating"
                  aria-label={`${advisor.rating ?? 0} out of 5`}
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
