import { useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import ViewAdvisor from "./pages/ViewAdvisor";
import UniversityAdvisors from "./pages/UniversityAdvisors";
import CreateAdvisor from "./pages/CreateAdvisor";
import Login from "./pages/Login";
import CreateReview from "./pages/CreateReview";
import "./App.css";

const App = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/university/:universityId/advisors",
      element: <UniversityAdvisors />,
    },
    {
      path: "/advisors/create",
      element: <CreateAdvisor />
    },
    {
      path: "/advisors/:id",
      element: <ViewAdvisor /> ,
    },
    {
      path: "/advisors/:advisorId/review",
      element: <CreateReview />,
    },
  ]);

  return <div className="app">{element}</div>;
};

export default App;
