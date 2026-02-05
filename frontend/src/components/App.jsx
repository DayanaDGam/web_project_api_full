import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Header from "./Header/Header";
import Main from "./Main/Main";
import Footer from "./Footer/Footer";
import Popup from "./Main/Popup.jsx";

import Login from "./Login/Login";
import Register from "./Register/Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip/InfoTooltip";

import { api } from "../utils/api";
import * as auth from "../utils/auth";

import CurrentUserContext from "../contexts/CurrentUserContext";

export default function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [popup, setPopup] = useState(null);

  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isInfoSuccess, setIsInfoSuccess] = useState(false);

  const navigate = useNavigate();

  const closeAllPopups = () => setPopup(null);

  // ✅ 1) Revisión de token al cargar la app
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    auth
      .getUserData(token)
      .then((res) => {
        // res puede venir como {data:{email}} según doc
        const userEmail = res?.data?.email || "";
        setEmail(userEmail);
        setLoggedIn(true);

        // importantísimo: setear token para Around API
        api.setToken(token);

        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.error("Token inválido:", err);
        localStorage.removeItem("jwt");
        setLoggedIn(false);
        setEmail("");
      });
  }, [navigate]);

  // ✅ 2) Cargar datos SOLO si está logueado
  useEffect(() => {
    if (!loggedIn) return;

    (async () => {
      try {
        const [user, initialCards] = await Promise.all([
          api.getUserInfo(),
          api.getInitialCards(),
        ]);
        setCurrentUser(user);
        setCards(initialCards);
      } catch (e) {
        console.error("init error:", e);
      }
    })();
  }, [loggedIn]);

  // ------- Popups -------
  function handleOpenPopup(p) {
    setPopup(p);
  }

  // ------- AUTH handlers -------
  const handleRegister = ({ email: userEmail, password }) => {
    if (!userEmail || !password) return;

    auth
      .register(userEmail, password)
      .then(() => {
        setIsInfoSuccess(true);
        setIsInfoOpen(true);
        navigate("/signin", { replace: true });
      })
      .catch((err) => {
        console.error(err);
        setIsInfoSuccess(false);
        setIsInfoOpen(true);
      });
  };

  const handleLogin = ({ email: userEmail, password }) => {
    if (!userEmail || !password) return;

    auth
      .authorize(userEmail, password)
      .then((data) => {
        if (data?.token) {
          localStorage.setItem("jwt", data.token);

          // setear token para Around API
          api.setToken(data.token);

          setLoggedIn(true);
          setEmail(userEmail);
          navigate("/");
        } else {
          throw new Error("No token in response");
        }
      })
      .catch((err) => {
        console.error(err);
        setIsInfoSuccess(false);
        setIsInfoOpen(true);
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setEmail("");
    setCurrentUser({});
    setCards([]);
    navigate("/signin", { replace: true });
  };

  // ------- Around handlers -------
  async function handleUpdateAvatar(payload) {
    try {
      const avatarUrl =
        typeof payload === "string" ? payload : payload?.avatar?.trim();
      if (!avatarUrl) return;

      const updated = await api.updateAvatar(avatarUrl);
      setCurrentUser(updated);
      closeAllPopups();
    } catch (err) {
      console.error("⛔ update avatar:", err);
    }
  }

  async function handleUpdateUser(data) {
    try {
      const updated = await api.updateUserInfo(data);
      setCurrentUser(updated);
      closeAllPopups();
    } catch (e) {
      console.error("update user:", e);
    }
  }

  async function handleCardLike(card) {
    try {
      // ojo: algunos backends devuelven likes, no isLiked.
      // si tu Card ya calcula isLiked, ok.
      const toggled = await api.changeLikeCardStatus(card._id, !card.isLiked);
      setCards((s) => s.map((c) => (c._id === card._id ? toggled : c)));
    } catch (e) {
      console.error("like:", e);
    }
  }

  async function handleCardDelete(card) {
    try {
      await api.deleteCard(card._id);
      setCards((s) => s.filter((c) => c._id !== card._id));
    } catch (e) {
      console.error("delete:", e);
    }
  }

  async function handleAddPlaceSubmit({ name, link }) {
    try {
      const newCard = await api.addNewCard({ name, link });
      setCards((s) => [newCard, ...s]);
      closeAllPopups();
    } catch (e) {
      console.error("add card:", e);
    }
  }

  const ctxValue = { currentUser, handleUpdateUser, handleUpdateAvatar };

  return (
    <CurrentUserContext.Provider value={ctxValue}>
      <div className="page__content">
        <Header loggedIn={loggedIn} email={email} onSignOut={handleSignOut} />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Main
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  onAddPlaceSubmit={handleAddPlaceSubmit}
                  onOpenPopup={handleOpenPopup}
                  onClosePopup={closeAllPopups}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/signup"
            element={
              loggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Register onRegister={handleRegister} />
              )
            }
          />

          <Route
            path="/signin"
            element={
              loggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="*"
            element={<Navigate to={loggedIn ? "/" : "/signin"} replace />}
          />
        </Routes>

        {popup && (
          <Popup onClose={closeAllPopups} title={popup.title}>
            <div className="popup__content">{popup.children}</div>
          </Popup>
        )}

        <InfoTooltip
          isOpen={isInfoOpen}
          isSuccess={isInfoSuccess}
          onClose={() => setIsInfoOpen(false)}
        />

        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}
