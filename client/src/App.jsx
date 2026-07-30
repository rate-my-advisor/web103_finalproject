import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import ViewAdvisor from "./pages/ViewAdvisor";
import UniversityAdvisors from "./pages/UniversityAdvisors";
import Login from "./pages/Login";
import "./App.css";

const App = () => {
  const element = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    {
      path: "/university/:universityId/advisors",
      element: <UniversityAdvisors />,
    },
    { path: "/advisor/:id", element: <ViewAdvisor /> },
  ]);

  return <div className="app">{element}</div>;
};

export default App;
