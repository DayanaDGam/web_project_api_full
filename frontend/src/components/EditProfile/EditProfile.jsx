import { useState, useEffect } from "react";

export default function EditProfile({ onUpdateUser, currentUser = {} }) {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  useEffect(() => {
    setName(currentUser?.name || "");
    setAbout(currentUser?.about || "");
  }, [currentUser]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({ name, about });
  }

  return (
    <form className="popup__form" noValidate onSubmit={handleSubmit}>
      <div className="popup__field">
        <input
          type="text"
          name="name"
          className="popup__input popup__input_type_name"
          placeholder="Nombre"
          required
          minLength="2"
          maxLength="40"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className="popup__input-error" />
      </div>

      <div className="popup__field">
        <input
          type="text"
          name="about"
          className="popup__input popup__input_type_description"
          placeholder="Profesión / Acerca de mí"
          required
          minLength="2"
          maxLength="200"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
        <span className="popup__input-error" />
      </div>

      <button type="submit" className="popup__button popup__button_save">
        Guardar
      </button>
    </form>
  );
}

