import { Link } from "react-router-dom";
import "../css/SiteHeader.css";

const SiteHeader = () => {
  return (
    <header className="site-header">
      <Link className="site-brand" to="/">
        <span className="site-logo">A</span>
        <span>
          Rate My <strong>Advisor</strong>
        </span>
      </Link>
    </header>
  );
};

export default SiteHeader;
