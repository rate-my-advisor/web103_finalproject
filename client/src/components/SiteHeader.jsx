import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/SiteHeader.css";

const SiteHeader = () => {
  const { user, login, logout, loading } = useAuth();

  return (
    <header className="site-header">
      <Link className="site-brand" to="/">
        <span className="site-logo">A</span>
        <span>
          Rate My <strong>Advisor</strong>
        </span>
      </Link>

      <div className="auth-nav">
        {loading ? (
          <span className="auth-loading">Loading...</span>
        ) : user ? (
          <div className="user-profile">
            {user.avatar_url && (
              <img
                src={user.avatar_url}
                alt={user.name || user.username}
                className="user-avatar"
              />
            )}
            <span className="user-name">{user.name || user.username}</span>
            <button onClick={logout} className="auth-btn logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="auth-btn login-btn">
            Log In / Register
          </Link>
        )}
      </div>
    </header>
  );
};

export default SiteHeader;
