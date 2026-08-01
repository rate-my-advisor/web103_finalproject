const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Unable to complete this request.");
  }

  return response.json();
}

// Universities
export function getUniversities() {
  return request("/api/universities");
}

export function getAdvisorsByUniversity(universityId) {
  return request(`/api/universities/${universityId}/advisors`);
}

// Advisors
export function getAdvisors() {
  return request("/api/advisors");
}

export function getAdvisorById(advisorId) {
  return request(`/api/advisors/${advisorId}`);
}

export function createAdvisor(advisorData) {
  return request("/api/advisors", {
    method: "POST",
    body: JSON.stringify(advisorData),
  });
}

export function updateAdvisor(advisorId, advisorData) {
  return request(`/api/advisors/${advisorId}`, {
    method: "PATCH",
    body: JSON.stringify(advisorData),
  });
}

export function deleteAdvisor(advisorId) {
  return request(`/api/advisors/${advisorId}`, {
    method: "DELETE",
  });
}

// Reviews
export function getReviewsByAdvisor(advisorId) {
  return request(`/api/reviews/advisor/${advisorId}`);
}

export function createReview(reviewData) {
  return request("/api/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
}

export function updateReview(reviewId, reviewData) {
  return request(`/api/reviews/${reviewId}`, {
    method: "PATCH",
    body: JSON.stringify(reviewData),
  });
}

export function deleteReview(reviewId) {
  return request(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
}
