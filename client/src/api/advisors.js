const API_BASE_URL = "http://localhost:3000";

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (response.status >= 400 && response.status < 500) {
    throw new Error("Not Found")
  }

  if (response.status >= 500) {
    throw new Error("Something went wrong");
  }

  return response.json();
}

export function getAdvisorsByUniversity(universityId) {
  return request(
    `/api/universities/${universityId}/advisors`,
  );
}

export function getAdvisorById(advisorId) {
  return request(`/api/advisors/${advisorId}`);
}

export function getReviewsByAdvisor(advisorId) {
  return request(`/api/reviews/advisor/${advisorId}`)
}
