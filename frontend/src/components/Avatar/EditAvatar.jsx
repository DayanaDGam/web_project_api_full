import { useRef, useEffect } from "react";

export default function EditAvatar({ onUpdateAvatar, currentAvatar = "" }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = currentAvatar || "";
  }, [currentAvatar]);

  function handleSubmit(e) {
    e.preventDefault();
    const url = inputRef.current.value.trim();
    if (!url) return;
    onUpdateAvatar({ avatar: url });
  }

  return (
    <form className="popup__form" noValidate onSubmit={handleSubmit}>
      <h3 className="popup__subtitle">Actualizar avatar</h3>

      <div className="popup__field">
        <input
          ref={inputRef}
          type="url"
          name="avatar"
          className="popup__input"
          placeholder="https://…"
          required
        />
        <span className="popup__input-error" />
      </div>

      <button type="submit" className="popup__button_save">
        Guardar
      </button>
    </form>
  );
}
