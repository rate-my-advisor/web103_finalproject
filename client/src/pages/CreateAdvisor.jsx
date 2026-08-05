import { useEffect, useState } from "react"
import AdvisorForm from "../components/AdvisorForm"
import SiteHeader from "../components/SiteHeader"
import "../css/CreateAdvisor.css"

const CreateAdvisor = () => {
    const [universities, setUniversities] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        const loadUniversities = async () => {
            try {
                // note to self, try using the api advisors.js
                const response = await fetch("/api/universities")
                const result = await response.json()

                if (!response.ok) {
                    throw new Error(
                        result.message || "Unable to load universities."
                    );
                }

                setUniversities(result)
            } catch (error) {
                setError(error.message)
            }
        }

        loadUniversities()
    }, []);

    return (
        <>
            <SiteHeader />

            <main className="create-advisor-page">
                <div className="create-advisor-container">
                    <div className="create-advisor-heading">
                        <h1>Create an Advisor Profile</h1>

                        <span>
                            Add an advisor profile so students can find the advisor and share
                            reviews about their advising experience.
                        </span>
                    </div>

                    {error && (
                        <p className="form-message form-error">{error}</p>
                    )}

                    <AdvisorForm universities={universities} />
                </div>
            </main>
        </>
    );
};

export default CreateAdvisor