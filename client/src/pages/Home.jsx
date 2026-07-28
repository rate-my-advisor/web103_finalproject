import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { getUniversities } from "../api/advisors";
import "../css/Home.css";

const Home = () => {
  const [universities, setUniversities] = useState([]);
  const [universityName, setUniversityName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setUniversities(await getUniversities());
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadUniversities();
  }, []);

  const selectedUniversity = useMemo(() => {
    const normalizedName = universityName.trim().toLocaleLowerCase();

    return universities.find(
      (university) =>
        university.name.toLocaleLowerCase() === normalizedName,
    );
  }, [universities, universityName]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedUniversity) {
      setError("Choose a university from the available options.");
      return;
    }

    navigate(`/university/${selectedUniversity.university_id}/advisors`);
  };

  return (
    <>
      <SiteHeader />
      <main className="home-page">
        <section className="home-hero" aria-labelledby="home-heading">
          <p className="home-eyebrow">Advice starts with the right advisor</p>
          <h1 id="home-heading">
            Find support you can <span>count on.</span>
          </h1>
          <p className="home-description">
            Search your university to compare academic advisors and learn from
            real student experiences.
          </p>

          <form className="university-search" onSubmit={handleSubmit}>
            <label htmlFor="university-name">Find your university</label>
            <div className="university-search-controls">
              <input
                id="university-name"
                name="universityName"
                type="search"
                list="university-options"
                value={universityName}
                onChange={(event) => {
                  setUniversityName(event.target.value);
                  setError("");
                }}
                placeholder={
                  loading
                    ? "Loading universities…"
                    : "Start typing a university"
                }
                autoComplete="off"
                disabled={loading}
                required
              />
              <datalist id="university-options">
                {universities.map((university) => (
                  <option
                    key={university.university_id}
                    value={university.name}
                  />
                ))}
              </datalist>
              <button type="submit" disabled={loading}>
                Find advisors
              </button>
            </div>
            {error && (
              <p className="search-error" role="alert">
                {error}
              </p>
            )}
          </form>

          <div className="home-proof" aria-label="Why use Rate My Advisor">
            <span>Verified university listings</span>
            <span>Student-written reviews</span>
            <span>Ratings that explain the experience</span>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
