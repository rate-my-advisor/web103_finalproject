const API_BASE_URL = "http://localhost:3001";

async function request(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error("Unable to load advisor data.");
  }

  return response.json();
}

export function getAdvisorsByUniversity(universityName) {
  return request(
    `/api/universities/${encodeURIComponent(universityName)}/advisors`,
  );
}

export function getAdvisorById(advisorId) {
  return request(`/api/advisors/${advisorId}`);
}
