import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

import avatarFallback from "../../images/avatar.jpg";

import EditProfile from "../EditProfile/EditProfile.jsx";
import EditAvatar from "../Avatar/EditAvatar.jsx";
import NewCard from "../NewCard/NewCard.jsx";
import Card from "../Card/Card.jsx";
import Popup from "./Popup.jsx";

export default function Main({
  onOpenPopup,
  onClosePopup,
  cards,
  onCardLike,
  onCardDelete,
  onAddPlaceSubmit,
  onUpdateUser,
  onUpdateAvatar,
}) {
  const { currentUser } = useContext(CurrentUserContext);

  const editProfilePopup = {
    title: "Editar perfil",
    children: <EditProfile onUpdateUser={onUpdateUser} />,
  };

  const editAvatarPopup = {
    title: "Editar avatar",
    children: <EditAvatar onUpdateAvatar={onUpdateAvatar} />,
  };

  const newCardPopup = {
    title: "Nuevo lugar",
    children: <NewCard onAddPlaceSubmit={onAddPlaceSubmit} />,
  };

  const getImagePopup = (card) => ({
    title: null,
    children: <ImagePopup card={card} onClose={onClosePopup} />,
  });

  return (
    <main className="main">
      <section className="main__profile">
        <div className="main__content-image">
          <img
            src={currentUser?.avatar || avatarFallback}
            alt="Avatar"
            className="main__profile-image"
          />

          {/* ✅ Botón/overlay para abrir EditAvatar */}
          <button
            type="button"
            className="main__avatar-edit"
            onClick={() => onOpenPopup(editAvatarPopup)}
            aria-label="Editar avatar"
          />
        </div>

        <div className="main__content-paragraph">
          <h1 className="main__paragraph main__paragraph_name">
            {currentUser?.name || "—"}
          </h1>
          <p className="main__paragraph main__paragraph_about">
            {currentUser?.about || "—"}
          </p>
        </div>

        <button
          className="main__button main__button_edit"
          type="button"
          onClick={() => onOpenPopup(editProfilePopup)}
          aria-label="Editar perfil"
        />
        <button
          className="main__button main__button_add"
          type="button"
          onClick={() => onOpenPopup(newCardPopup)}
          aria-label="Nuevo lugar"
        >
          +
        </button>
      </section>

      <section className="main__gallery">
        <ul className="cards__list">
          {cards?.map((card) => (
            <Card
              key={card._id}
              card={card}
              onImageClick={(c) => onOpenPopup(getImagePopup(c))}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
        </ul>
      </section>

      <div style={{ display: "none" }}>
        <Popup title="" onClose={() => {}}>
          {null}
        </Popup>
      </div>
    </main>
  );
}


