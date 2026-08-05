import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import AdvisorForm from "../components/AdvisorForm"
import SiteHeader from "../components/SiteHeader"
import "../css/CreateAdvisor.css"

const CreateAdvisor = () => {
    // optional: pre-fill the universityId field in the form if it is provided in the query string
    const [searchParams] = useSearchParams()
    const initialUniversityId = searchParams.get("universityId")

    const [universities, setUniversities] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const loadUniversities = async () => {
            try {
                setError("")

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
                setError(error.message || "Unable to load universities.")
            } finally {
                setIsLoading(false)
            }
        }

        loadUniversities()
    }, []);

    const initialUniversity =
        universities.find(
            (university) =>
                String(university.university_id) === String(initialUniversityId)
        ) ?? null

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

                    {/* add loading */}
                    {isLoading && <p>Loading Form...</p>}

                    {error && (
                        <p className="form-message form-error" role="alert">{error}</p>
                    )}

                    {!isLoading && !error && (
                        <AdvisorForm
                            key = {
                                initialUniversity?.university_id ?? "no-initial-university"
                            }
                            universities={universities}
                            initialUniversity={initialUniversity}
                        />
                    )}
                </div>
            </main>
        </>
    );
};

export default CreateAdvisor