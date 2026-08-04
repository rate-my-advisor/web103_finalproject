import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/AdvisorForm.css"

const initialFormData = {
    university_id: "",
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    office: "",
}

const AdvisorForm = ({ universities = [] }) => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState(initialFormData)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [universitySearch, setUniversitySearch] = useState("")
    const [isUniversityDropdownOpen, setIsUniversityDropdownOpen] = useState(false)
    // for non-existing universities, allow user to create a new uni
    const [createNewUniversity, setCreateNewUniversity] = useState(false);

    // update form to show user input change accordingly
    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        setError("")

        const typedUniversityName = universitySearch.trim()

        if (!typedUniversityName) {
            setError("Please enter or select a university.")
            return
        }

        const firstName = formData.first_name.trim()
        const lastName = formData.last_name.trim()
        const email = formData.email.trim().toLowerCase()
        const department = formData.department.trim()
        const office = formData.office.trim()

        if (!firstName || !lastName || !email || !department) {
            setError("Please complete all required fields.")
            return
        }

        try {
            setIsSubmitting(true)

            // existing has ID, manually typed ones don't (bc they're new)
            let universityId = Number(formData.university_id)

            if (!Number.isInteger(universityId) || universityId <= 0) {
                const universityResponse = await fetch("/api/universities", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: typedUniversityName }),
                })

                const universityResult = await universityResponse.json()
                
                if (!universityResponse.ok) {
                    throw new Error(
                        universityResult.message || "Unable to create university."
                    )
                }

                universityId = universityResult.university_id ?? universityResult.id

                if (!Number.isInteger(Number(universityId))) {
                    throw new Error(
                        "The university was created, but no university ID was returned."
                    )
                }

                universityId = Number(universityId)
            }

            const advisorData = {
                university_id: universityId,
                first_name: firstName,
                last_name: lastName,
                email,
                department,
                office,
            }

            // require all fields to be filled out
            if (
                !advisorData.first_name ||
                !advisorData.last_name ||
                !advisorData.email ||
                !advisorData.department
            ) {
                throw new Error("Please complete all required fields.");
            }

            setIsSubmitting(true)

            const advisorResponse = await fetch("/api/advisors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(advisorData),
            })

            const advisorResult = await advisorResponse.json()

            if (!advisorResponse.ok) {
                throw new Error(
                    advisorResult.message || "Unable to create advisor profile."
                );
            }

            const createdAdvisorId = advisorResult.advisor_id ?? advisorResult.id

            if (!createdAdvisorId) {
                throw new Error(
                    "The advisor was created, but no advisor ID was returned."
                )
            }

            // redirect to the newly created advisor's profile page
            navigate(`/advisors/${createdAdvisorId}`, { replace: true })
        } catch (error) {
            console.error("Unable to create advisor:", error)

            setError(
                error.message || "Unable to create advisor profile."
            );
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUniversityChange = (event) => {
        const typedName = event.target.value

        setUniversitySearch(typedName)
        setIsUniversityDropdownOpen(true)

        const matchingUniversity = universities.find(
            (university) =>
            university.name.toLowerCase() ===
            typedName.trim().toLowerCase()
        );

        setFormData((previousData) => ({
            ...previousData,
            university_id: matchingUniversity
                ? String(matchingUniversity.university_id)
                : "",
        }))
    }

    const filteredUniversities = universities.filter((university) =>
        university.name
            .toLowerCase()
            .includes(universitySearch.trim().toLowerCase())
    )

    const handleUniversitySelect = (university) => {
        setUniversitySearch(university.name)
        setIsUniversityDropdownOpen(false)
        setCreateNewUniversity(false)

        setFormData((previousData) => ({
            ...previousData,
            university_id: String(university.university_id),
        }))
    }

    const handleCreateUniversitySelect = () => {
        setCreateNewUniversity(true);
        setIsUniversityDropdownOpen(false);

        setFormData((previousData) => ({
            ...previousData,
            university_id: "",
        }));
    };

    console.log("Universities received:", universities)

    return (
        <form className="advisor-form" onSubmit={handleSubmit}>
            <div className="advisor-form-section">
                <label htmlFor="advisor-university">
                    University
                </label>

                <p>
                    Start typing the university name, then select it from the results.
                </p>

                <div className="university-combobox">
                    <input
                        id="advisor-university"
                        type="text"
                        value={universitySearch}
                        onChange={handleUniversityChange}
                        onFocus={() => setIsUniversityDropdownOpen(true)}
                        onBlur={() => {
                            // Allows a dropdown option to receive the click first.
                            window.setTimeout(() => {
                                setIsUniversityDropdownOpen(false)
                            }, 150)
                        }}
                        placeholder="Search for a university"
                        autoComplete="off"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={isUniversityDropdownOpen}
                        aria-controls="university-results"
                        required
                    />

                    {isUniversityDropdownOpen && (
                        <div
                            id="university-results"
                            className="university-dropdown"
                            role="listbox"
                        >
                            {filteredUniversities.length > 0 ? (
                                filteredUniversities.map((university) => (
                                    <button
                                    key={university.university_id}
                                    type="button"
                                    className="university-dropdown-option"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleUniversitySelect(university)}
                                    >
                                    {university.name}
                                    </button>
                                ))
                            ) : (
                                <div className="university-dropdown-empty">
                                    <p>No matching universities found.</p>

                                    {universitySearch.trim() && (
                                        <button
                                            type="button"
                                            className="create-university-option"
                                            onMouseDown={(event) => event.preventDefault()}
                                            onClick={handleCreateUniversitySelect}
                                        >
                                            + Add “{universitySearch.trim()}”
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {createNewUniversity && (
                        <p className="new-university-message">
                            A new university named <strong>{universitySearch.trim()}</strong> will be
                            created.
                        </p>
                    )}
                </div>
            </div>

            {/* placeholder fake example: Jane Smith, CS major, and their email */}
            <div className="advisor-form-section advisor-name-fields">
                <div>
                    <label htmlFor="advisor-first-name">
                        First name
                    </label>

                    <input
                        id="advisor-first-name"
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Jane"
                        maxLength={100}
                        autoComplete="given-name"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="advisor-last-name">
                        Last name
                    </label>

                    <input
                        id="advisor-last-name"
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Smith"
                        maxLength={100}
                        autoComplete="family-name"
                        required
                    />
                </div>
            </div>

            <div className="advisor-form-section">
                <label htmlFor="advisor-email">
                    Email address
                </label>

                <p>Enter the advisor's university email address.</p>

                <input
                    id="advisor-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane.smith@university.edu"
                    maxLength={255}
                    autoComplete="email"
                    required
                />
            </div>

            <div className="advisor-form-section">
                <label htmlFor="advisor-department">
                    Department
                </label>

                <p>Enter the academic department the advisor belongs to.</p>

                <input
                    id="advisor-department"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    maxLength={255}
                    required
                />
            </div>

            <div className="advisor-form-section">
                <label htmlFor="advisor-office">
                    Office
                    <span className="optional-label"> Optional</span>
                </label>

                <p>Enter the advisor's office location, if known.</p>

                <input
                    id="advisor-office"
                    type="text"
                    name="office"
                    value={formData.office}
                    onChange={handleChange}
                    placeholder="Engineering Building, Room 204"
                    maxLength={255}
                />
            </div>

            {error && (
                <p className="form-message form-error" role="alert">
                {error}
                </p>
            )}

            <button
                className="submit-advisor-button"
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting
                ? "Creating Profile..."
                : "Create Advisor Profile"}
            </button>
        </form>
    )
}

export default AdvisorForm