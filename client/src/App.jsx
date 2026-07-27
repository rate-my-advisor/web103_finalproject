import { useRoutes } from "react-router-dom";
import ViewAdvisor from "./pages/ViewAdvisor";
import UniversityAdvisors from "./pages/UniversityAdvisors";
import "./App.css";

const App = () => {
  const element = useRoutes([
    {
      path: "/university/:universityName/advisors",
      element: <UniversityAdvisors />,
    },
    { path: "/advisor/:id", element: <ViewAdvisor /> },
  ]);

  return <div className="app">{element}</div>;
};

export default App;