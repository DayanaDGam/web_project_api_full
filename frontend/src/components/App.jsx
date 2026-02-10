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

  // 🛡️ Revisión de token al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    auth.getUserData(token)
  .then((res) => {
    api.setToken(token); // <--- Muévelo aquí arriba, antes de los estados
    const userData = res.data || res; 
    setEmail(userData.email);
    setCurrentUser(userData);
    setLoggedIn(true);
    navigate("/", { replace: true });
  })
      .catch((err) => {
        console.error("Token inválido:", err);
        localStorage.removeItem("jwt");
        setLoggedIn(false);
      });
  }, [navigate]);

  // 📥 Cargar datos de usuario y tarjetas solo si está logueado
  useEffect(() => {
    if (!loggedIn) return;

    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userData, initialCards]) => {
        console.log("Datos del usuario recibidos:", userData); 
        console.log("Tarjetas recibidas:", initialCards);
        setCurrentUser(userData);
        setCards(initialCards);
      })
      .catch((err) => console.error("Error al cargar datos iniciales:", err));
  }, [loggedIn]);

  // ------- AUTH handlers -------
  const handleRegister = ({ email: userEmail, password }) => {
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
    auth
      .authorize(userEmail, password)
      .then((data) => {
        if (data?.token) {
          localStorage.setItem("jwt", data.token);
          api.setToken(data.token); // Configurar token
          setLoggedIn(true);
          setEmail(userEmail);
          navigate("/");
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
      const avatarUrl = typeof payload === "string" ? payload : payload?.avatar;
      const updated = await api.updateAvatar(avatarUrl);
      setCurrentUser(updated);
      closeAllPopups();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdateUser(data) {
    try {
      const updated = await api.updateUserInfo(data);
      setCurrentUser(updated);
      closeAllPopups();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCardLike(card) {
    // Verificamos si el ID del usuario actual está en el array de likes
    const isLiked = card.likes.some((id) => id === currentUser._id);

    try {
      const toggledCard = await api.changeLikeCardStatus(card._id, !isLiked);
      setCards((s) => s.map((c) => (c._id === card._id ? toggledCard : c)));
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCardDelete(card) {
    try {
      await api.deleteCard(card._id);
      setCards((s) => s.filter((c) => c._id !== card._id));
    } catch (e) {
      console.error(e);
    }
  }

  async function handleAddPlaceSubmit(data) {
    try {
      const newCard = await api.addNewCard(data);
      setCards([newCard, ...cards]);
      closeAllPopups();
    } catch (e) {
      console.error(e);
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
                  onOpenPopup={(p) => setPopup(p)}
                  onClosePopup={closeAllPopups}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<Register onRegister={handleRegister} />} />
          <Route path="/signin" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to={loggedIn ? "/" : "/signin"} />} />
        </Routes>

        {popup && (
          <Popup onClose={closeAllPopups} title={popup.title}>
            {popup.children}
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