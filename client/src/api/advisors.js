// Use a relative base URL so requests hit the same origin the app is served
// from. In dev, Vite proxies /api to the local server; in production, the
// server serves both the API and the built client, so /api resolves correctly.
const API_BASE_URL = "";

async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

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

export function likeReview(reviewId) {
  return request(`/api/reviews/${reviewId}/like`, { method: "PATCH" });
}

export function reportReview(reviewId) {
  return request(`/api/reviews/${reviewId}/report`, { method: "PATCH" });
}
