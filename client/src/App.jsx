import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import ViewAdvisor from "./pages/ViewAdvisor";
import UniversityAdvisors from "./pages/UniversityAdvisors";
import CreateReview from "./pages/CreateReview";
import "./App.css";

const App = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/university/:universityId/advisors",
      element: <UniversityAdvisors />,
    },
    {
      path: "/advisor/:id",
      element: <ViewAdvisor /> ,
    },
    {
      path: "/advisor/:advisorId/review",
      element: <CreateReview />,
    }
  ]);

  return <div className="app">{element}</div>;
};

export default App;
