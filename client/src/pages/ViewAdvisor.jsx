import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import { getAdvisorById } from "../api/advisors";
import "../css/ViewAdvisor.css";

const ViewAdvisor = () => {
  const rawId = Number(useParams().id) || null;;
  const [advisor, setAdvisor] = useState(null);
  const [error, setError] = useState("");

  // Safely parse to number
  const id = Number(rawId);
  const isValidId = Boolean(rawId) && !Number.isNaN(id);

  useEffect(() => {
    if (!isValidId) return;

    const loadAdvisor = async () => {
      try {
        setAdvisor(await getAdvisorById(id));
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
    )
  };

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
          <p>Loading advisor…</p>;
        </main>
      </>
    )
  }
  console.log(advisor)

  return (
    <>
      <SiteHeader />
      <main className="container">
        <section className="summary">
          <div>
            <h1>{`${advisor.first_name} ${advisor.last_name}`}</h1>
            <p>{advisor.department}</p>
            <p>{advisor.email}</p>
            <p>{advisor.university_name}</p>
            {advisor.office && <p>{advisor.office}</p>}
          </div>
          <strong className="rating-card">{advisor.rating} / 5</strong>
        </section>
      </main>
    </>
  );
};

export default ViewAdvisor;
