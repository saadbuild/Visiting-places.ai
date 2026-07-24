const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      "Can't reach the Visiting Places server. Make sure the backend is running on " + BASE_URL
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong.");
  }
  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/auth/me", { token }),
  updateMe: (payload, token) => request("/auth/me", { method: "PATCH", body: payload, token }),

  listTrips: (token) => request("/trips", { token }),
  createTrip: (payload, token) => request("/trips", { method: "POST", body: payload, token }),
  deleteTrip: (id, token) => request(`/trips/${id}`, { method: "DELETE", token }),

  listFavorites: (token) => request("/favorites", { token }),
  addFavorite: (payload, token) => request("/favorites", { method: "POST", body: payload, token }),
  removeFavorite: (id, token) => request(`/favorites/${id}`, { method: "DELETE", token }),

  listPlans: () => request("/subscriptions/plans"),
  mySubscription: (token) => request("/subscriptions/me", { token }),
  selectPlan: (planId, token) => request("/subscriptions/select", { method: "POST", body: { planId }, token }),
  myPayments: (token) => request("/subscriptions/payments", { token }),
  submitPayment: (payload, token) => request("/subscriptions/payments", { method: "POST", body: payload, token }),
  pendingPayments: (token) => request("/subscriptions/payments/pending", { token }),
  verifyPayment: (id, token) => request(`/subscriptions/payments/${id}/verify`, { method: "POST", token }),
  consumeCredit: (token, amount = 1) => request("/subscriptions/consume-credit", { method: "POST", token, body: { amount } }),
};
