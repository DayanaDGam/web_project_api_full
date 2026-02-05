const BASE_URL = "https://around-api.en.tripleten-services.com/v1";

const checkResponse = (res) => (res.ok ? res.json() : Promise.reject(res.status));

export const getUserInfo = (token) =>
  fetch(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then(checkResponse);

export const getInitialCards = (token) =>
  fetch(`${BASE_URL}/cards`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then(checkResponse);

export const setUserInfo = ({ name, about }, token) =>
  fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, about }),
  }).then(checkResponse);

export const setUserAvatar = ({ avatar }, token) =>
  fetch(`${BASE_URL}/users/me/avatar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ avatar }),
  }).then(checkResponse);

export const addCard = ({ name, link }, token) =>
  fetch(`${BASE_URL}/cards`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, link }),
  }).then(checkResponse);