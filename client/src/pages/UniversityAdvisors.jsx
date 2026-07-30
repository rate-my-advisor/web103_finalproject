// imp: react router imports for navigation and url params
import { Link, useParams } from "react-router-dom";
// imp: react hooks for state and lifecycle
import { useEffect, useState } from "react";
// imp: custom components and api functions
import SiteHeader from "../components/SiteHeader";
import { getAdvisorsByUniversity } from "../api/advisors";
// imp: stylesheet
import "../css/UniversityAdvisors.css";

const UniversityAdvisors = () => {
  // un: extract universityName from url parameters
  const { universityName: un } = useParams();
  
  // a: state variable for the raw advisors array
  const [a, setA] = useState([]);
  // l: state variable for the loading status
  const [l, setL] = useState(true);
  // e: state variable for the error message string
  const [e, setE] = useState("");
  // f: state variable for the search filter string
  const [f, setF] = useState("");
  // s: state variable for the sort dropdown option
  const [s, setS] = useState("name");

  // fn: decode and format the university name for the api
  const fn = decodeURIComponent(un || "")
    .replace(/-/g, " ")
    .trim();

  // eff: run this effect whenever the formatted name changes
  useEffect(() => {
    // ld: async function to handle the api request
    const ld = async () => {
      try {
        // upd: set loading to true before fetching
        setL(true);
        // upd: clear any previous error messages
        setE("");
        // d: wait for the api to return the advisor data
        const d = await getAdvisorsByUniversity(fn);
        // upd: save the raw data to the state
        setA(d);
      } catch (err) {
        // upd: save the error message if the request fails
        setE(err.message);
      } finally {
        // upd: set loading to false when completely finished
        setL(false);
      }
    };

    // run: execute the load function
    ld();
  }, [fn]);

  // fh: handle typing in the filter text box
  const fh = (evt) => {
    // upd: update filter state with new text
    setF(evt.target.value);
  };

  // sh: handle selecting a new option in the sort dropdown
  const sh = (evt) => {
    // upd: update sort state with new option
    setS(evt.target.value);
  };

  // arr: the final filtered and sorted array to render
  const arr = a
    // flt: filter out items that do not match the text
    .filter((adv) => {
      // chk: return true if empty, or if name/dept matches filter
      return (
        f === "" ||
        adv.name.toLowerCase().includes(f.toLowerCase()) ||
        adv.department.toLowerCase().includes(f.toLowerCase())
      );
    })
    // srt: sort the remaining items based on the dropdown
    .sort((a1, a2) => {
      // chk: if rating is selected, sort highest to lowest
      if (s === "rating") {
        return a2.rating - a1.rating;
      }
      // chk: default to alphabetical sorting by name
      return a1.name.localeCompare(a2.name);
    });

  // ret: return the jsx to be rendered in the browser
  return (
    <>
      <SiteHeader />

      <main className="advisor-list-page">
        <h1>Advisors at {fn}</h1>

        {/* rct: render controls only if data is loaded successfully */}
        {!l && !e && a.length > 0 && (
          <div className="controls" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input
              type="text"
              value={f}
              onChange={fh}
              placeholder="Filter by name or dept..."
            />
            <select value={s} onChange={sh}>
              <option value="name">Alphabetical</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        )}

        {/* rct: display loading message if currently fetching */}
        {l && <p>Loading advisors…</p>}

        {/* rct: display error message if the fetch failed */}
        {e && <p className="advisor-message">{e}</p>}

        {/* rct: display empty state if api returns no advisors */}
        {!l && !e && a.length === 0 && (
          <section className="advisor-empty-state">
            <h2>No advisors found</h2>
            <p>No advisor profiles are available for this university yet.</p>
          </section>
        )}

        {/* rct: display the list of advisors using the finalized array */}
        {!l && !e && arr.length > 0 && (
          <section className="advisor-list" aria-label="University advisors">
            {arr.map((adv) => (
              <Link
                className="advisor-card"
                key={adv.id}
                to={`/advisor/${adv.id}`}
              >
                <div>
                  <h2>{adv.name}</h2>
                  <p className="advisor-specialty">{adv.specialty}</p>
                  <p className="advisor-department">{adv.department}</p>
                </div>

                <div
                  className="advisor-rating"
                  aria-label={`${adv.rating} out of 5`}
                >
                  {adv.rating} / 5
                </div>
              </Link>
            ))}
          </section>
        )}
        
        {/* rct: handle edge case where filtering removes all results */}
        {!l && !e && a.length > 0 && arr.length === 0 && (
          <p>No advisors match your filter.</p>
        )}
      </main>
    </>
  );
};

// exp: make the component available for import
export default UniversityAdvisors;
