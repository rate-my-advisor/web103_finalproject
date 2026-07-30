const API_BASE_URL = "http://localhost:3000";

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Unable to complete this request.");
  }

  return response.json();
}

export function getUniversities() {
  return request("/api/universities");
}

export function getAdvisorsByUniversity(universityId) {
  return request(`/api/universities/${universityId}/advisors`);
}

export function getAdvisorById(advisorId) {
  return request(`/api/advisors/${advisorId}`);
}

export function getReviewsByAdvisor(advisorId) {
  return request(`/api/reviews/advisor/${advisorId}`);
}
