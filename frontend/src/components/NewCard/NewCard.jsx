import { useState } from "react";

export default function NewCard({ onAddPlaceSubmit }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  function handleSubmit(e) {
    e.preventDefault();                   
    if (!name.trim() || !link.trim()) return;
    onAddPlaceSubmit?.({ name: name.trim(), link: link.trim() });
    setName("");
    setLink("");
  }

  return (
    <form className="popup__form" name="new-card-form" onSubmit={handleSubmit} noValidate>
      
      <div className="popup__field">
        <input
          className="popup__input"
          type="text"
          name="card-name"
          placeholder="Título"
          minLength="2"
          maxLength="30"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className="popup__input-error" />
      </div>

      <div className="popup__field">
        <input
          className="popup__input"
          type="url"
          name="card-link"
          placeholder="Enlace de la imagen"
          required
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <span className="popup__input-error" />
      </div>

      <button className="popup__button popup__button_save" type="submit">
        Guardar
      </button>
    </form>
  );
}
