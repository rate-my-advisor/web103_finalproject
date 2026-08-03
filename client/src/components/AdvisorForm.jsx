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

        const advisorData = {
            university_id: Number(formData.university_id),
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email.trim().toLowerCase(),
            department: formData.department.trim(),
            office: formData.office.trim() || null,
        }

        if (
            !Number.isInteger(advisorData.university_id) ||
            advisorData.university_id <= 0
        ) {
            setError("Please select a valid university.")
            return
        }

        // require all fields to be filled out
        if (
            !advisorData.first_name ||
            !advisorData.last_name ||
            !advisorData.email ||
            !advisorData.department
        ) {
            setError("Please complete all required fields.");
            return
        }

        try {
            setIsSubmitting(true)

            const response = await fetch("/api/advisors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(advisorData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(
                    result.message || "Unable to create advisor profile."
                );
            }

            const createdAdvisorId = result.advisor_id ?? result.id

            if (!createdAdvisorId) {
                throw new Error(
                    "The advisor was created, but no advisor ID was returned."
                );
            }

            // redirect to the newly created advisor's profile page
            navigate(`/advisor/${createdAdvisorId}`, { replace: true })
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

        // clear ID until user selects an existing university
        setFormData((previousData) => ({
            ...previousData,
            university_id: "",
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

        setFormData((previousData) => ({
            ...previousData,
            university_id: String(university.university_id),
        }))
    }

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
                                        className="university-dropdown-option"
                                        type="button"
                                        role="option"
                                        onMouseDown={(event) => {
                                            // Prevent the input from blurring before selection.
                                            event.preventDefault();
                                        }}
                                        onClick={() =>
                                            handleUniversitySelect(university)
                                        }
                                        >
                                        {university.name}
                                    </button>
                                ))
                                ) : (
                                <p className="university-dropdown-empty">
                                    No matching universities found.
                                </p>
                            )}
                        </div>
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