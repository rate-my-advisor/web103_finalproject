import cors from "cors";
import express from "express";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const advisors = [
  {
    id: 1,
    name: "Aisha Patel",
    university: "New York University",
    specialty: "Computer Science",
    department: "Tandon School of Engineering",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Daniel Kim",
    university: "New York University",
    specialty: "Pre-Health",
    department: "College of Arts and Science",
    rating: 4.5,
  },
  {
    id: 3,
    name: "Maria Gonzalez",
    university: "New York University",
    specialty: "Business and Finance",
    department: "Stern School of Business",
    rating: 4.7,
  },
];

app.get("/api/universities/:universityName/advisors", (request, response) => {
  const universityName = request.params.universityName.toLowerCase();

  const matchingAdvisors = advisors.filter(
    (advisor) => advisor.university.toLowerCase() === universityName,
  );

  response.json(matchingAdvisors);
});

app.get("/api/advisors/:id", (request, response) => {
  const advisor = advisors.find(
    (currentAdvisor) => currentAdvisor.id === Number(request.params.id),
  );

  if (!advisor) {
    return response.status(404).json({ error: "Advisor not found" });
  }

  response.json(advisor);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});