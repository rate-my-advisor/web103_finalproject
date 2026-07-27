import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { getAdvisorById } from "../api/advisors";
import "../css/ViewAdvisor.css";

const ViewAdvisor = () => {
  const { id } = useParams();
  const [advisor, setAdvisor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAdvisor = async () => {
      try {
        setAdvisor(await getAdvisorById(id));
      } catch {
        setError("This advisor could not be found.");
      }
    };

    loadAdvisor();
  }, [id]);

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
    return <p>Loading advisor…</p>;
  }

  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="summary">
          <div>
            <h1>{advisor.name}</h1>
            <p>{advisor.specialty}</p>
            <p>{advisor.department}</p>
            <p>{advisor.university}</p>
          </div>

          <strong className="rating-card">{advisor.rating} / 5</strong>
        </section>
      </main>
    </>
  );
};

export default ViewAdvisor;