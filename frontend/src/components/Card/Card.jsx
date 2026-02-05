import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

export default function Card({ card, onImageClick, onCardLike, onCardDelete }) {
  const { currentUser } = useContext(CurrentUserContext);
  const { name, link, isLiked, owner, _id } = card;

  const canDelete = true || currentUser?._id === owner;

  const likeBtnClass = `card__like-button ${
    isLiked ? "card__like-button_is-active" : ""
  }`;

  return (
    <li className="main__gallery-card">
      <img
        className="card__image"
        src={link}
        alt={name}
        onClick={() => onImageClick(card)}
      />
      {canDelete && (
        <button
          aria-label="Delete card"
          className="card__button_trash"
          type="button"
          onClick={() => onCardDelete(card)}
        />
      )}
      <div className="card__description">
        <h2 className="card__title">{name}</h2>
        <button
          aria-label="Like card"
          type="button"
          className={likeBtnClass}
          onClick={() => onCardLike(card)}
        />
      </div>
    </li>
  );
}
