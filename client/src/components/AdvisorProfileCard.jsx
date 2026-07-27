import "../css/AdvisorProfileCard.css";

const AdvisorProfileCard = ({ advisor }) => {
  if (!advisor) return null;

  const initials = `${advisor.first_name?.[0] || ""}${advisor.last_name?.[0] || ""}`.toUpperCase();

  return (
    <div className="profile-column">
      <h3 className="section-title">Profile</h3>
      <div className="advisor-profile-card">
        <div className="category-header">
          STUDENT ADVISING • {advisor.university_name?.toUpperCase() || "UNIVERSITY"}
        </div>

        <div className="profile-main">
          <div className="avatar-circle">{initials}</div>
          <div className="profile-details">
            <h1 className="advisor-name">{`${advisor.first_name} ${advisor.last_name}`}</h1>
            <p className="advisor-subtitle">
              Academic Advisor · {advisor.department}
            </p>
            <div className="verification-badge">
              <span className="verified-icon">✓</span> Verified advisor
              {advisor.office ? ` · ${advisor.office}` : ""}
            </div>
          </div>
        </div>

        <div className="profile-tags">
          <span className="tag-pill">{advisor.department}</span>
          <span className="tag-pill">{advisor.university_name}</span>
          <span className="tag-pill">Academic Support</span>
        </div>
      </div>
    </div>
  );
};

export default AdvisorProfileCard;
