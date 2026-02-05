const BASE_URL = "https://se-register-api.en.tripleten-services.com/v1";

const checkResponse = (res) => (res.ok ? res.json() : Promise.reject(res.status));

export const register = (email, password) =>
  fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);

export const authorize = (email, password) =>
  fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);

// ✅ ESTO TE FALTA para validar token y sacar el email
export const getUserData = (token) =>
  fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ OJO: con Bearer
    },
  }).then(checkResponse);

