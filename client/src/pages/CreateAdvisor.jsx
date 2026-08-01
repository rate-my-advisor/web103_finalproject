import AdvisorForm from "../components/AdvisorForm"
import SiteHeader from "../components/SiteHeader"
import "../css/CreateAdvisor.css"

const CreateAdvisor = () => {
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

                    <AdvisorForm />
                </div>
            </main>
        </>
    );
};

export default CreateAdvisor