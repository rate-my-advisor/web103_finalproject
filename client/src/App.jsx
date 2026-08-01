import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import ViewAdvisor from "./pages/ViewAdvisor";
import UniversityAdvisors from "./pages/UniversityAdvisors";
import CreateAdvisor from "./pages/CreateAdvisor";
import "./App.css";

const App = () => {
  const element = useRoutes([
    { path: "/", element: <Home /> },
    {
      path: "/university/:universityId/advisors",
      element: <UniversityAdvisors />,
    },
    { path: "/advisor/:id", element: <ViewAdvisor /> },
    { path: "/advisors/create", element: <CreateAdvisor /> },
  ]);

  return <div className="app">{element}</div>;
};

export default App;
