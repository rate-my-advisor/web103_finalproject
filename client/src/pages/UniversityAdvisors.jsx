import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { getAdvisorsByUniversity } from "../api/advisors";
import "../css/UniversityAdvisors.css";

const UniversityAdvisors = () => {
  const { universityId } = useParams();
  const [universityName, setUniversityName] = useState("");
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const loadAdvisors = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdvisorsByUniversity(universityId);

        setUniversityName(data.university.name);
        setAdvisors(data.advisors);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadAdvisors();
  }, [universityId]);

  const departments = useMemo(
    () =>
      [...new Set(advisors.map((advisor) => advisor.department))]
        .filter(Boolean)
        .sort((first, second) => first.localeCompare(second)),
    [advisors],
  );

  const visibleAdvisors = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const filteredAdvisors = advisors.filter((advisor) => {
      const searchableText = [
        advisor.first_name,
        advisor.last_name,
        advisor.email,
        advisor.department,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      const matchesQuery =
        normalizedQuery === "" || searchableText.includes(normalizedQuery);
      const matchesDepartment =
        department === "all" || advisor.department === department;

      return matchesQuery && matchesDepartment;
    });

    return filteredAdvisors.toSorted((firstAdvisor, secondAdvisor) => {
      if (sortBy === "rating-high") {
        return (
          (Number(secondAdvisor.rating) || 0) -
          (Number(firstAdvisor.rating) || 0)
        );
      }

      if (sortBy === "rating-low") {
        return (
          (Number(firstAdvisor.rating) || 0) -
          (Number(secondAdvisor.rating) || 0)
        );
      }

      return `${firstAdvisor.last_name} ${firstAdvisor.first_name}`.localeCompare(
        `${secondAdvisor.last_name} ${secondAdvisor.first_name}`,
      );
    });
  }, [advisors, department, query, sortBy]);

  return (
    <>
      <SiteHeader />

      <main className="advisor-list-page">
        <header className="advisor-list-heading">
          <p className="advisor-list-eyebrow">Find the right support</p>
          <h1>Advisors at {universityName || "…"}</h1>
          <p>
            Search by name, email, or department, then sort the results by name
            or student rating.
          </p>
        </header>

        {loading && <p>Loading advisors…</p>}

        {error && <p className="advisor-message">{error}</p>}

        {!loading && !error && advisors.length > 0 && (
          <section className="advisor-controls" aria-label="Filter advisors">
            <label>
              <span>Search advisors</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, email, or department"
              />
            </label>

            <label>
              <span>Department</span>
              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
              >
                <option value="all">All departments</option>
                {departments.map((departmentName) => (
                  <option key={departmentName} value={departmentName}>
                    {departmentName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Sort by</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="name">Name</option>
                <option value="rating-high">Highest rating</option>
                <option value="rating-low">Lowest rating</option>
              </select>
            </label>
          </section>
        )}

        {!loading && !error && advisors.length === 0 && (
          <section className="advisor-empty-state">
            <h2>No advisors found</h2>
            <p>No advisor profiles are available for this university yet.</p>
          </section>
        )}

        {!loading &&
          !error &&
          advisors.length > 0 &&
          visibleAdvisors.length === 0 && (
            <section className="advisor-empty-state">
              <h2>No matching advisors</h2>
              <p>Try a different search or department.</p>
            </section>
          )}

        {!loading && !error && visibleAdvisors.length > 0 && (
          <>
            <div className="advisor-results-toolbar">
              <p className="advisor-result-count" aria-live="polite">
                {visibleAdvisors.length}{" "}
                {visibleAdvisors.length === 1 ? "advisor" : "advisors"}
              </p>

              {/* add button to lead to advisor creation form */}
              <Link to="/advisors/create" className="advisor-results-create-link">
                  Create Advisor Profile
              </Link>
            </div>

            <section className="advisor-list" aria-label="University advisors">
              {visibleAdvisors.map((advisor) => (
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
                  aria-label={
                    advisor.rating == null
                      ? "Not yet rated"
                      : `${advisor.rating} out of 5`
                  }
                >
                  {advisor.rating == null ? "Not rated" : `${advisor.rating} / 5`}
                </div>
              </Link>
              ))}
            </section>
          </>
        )}
      </main>
    </>
  );
};

export default UniversityAdvisors;
