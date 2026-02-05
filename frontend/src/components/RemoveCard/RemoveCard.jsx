export default function RemoveCard({ onCancel, onConfirm }) {
  function handleSubmit(e) {
    e.preventDefault();
    onConfirm?.();
  }

  return (
    <form className="popup__form" onSubmit={handleSubmit} noValidate>
      <p style={{ margin: 0, marginBottom: 16 }}>
        ¿Seguro que quieres eliminar esta tarjeta?
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button type="button" className="popup__button" onClick={onCancel}>
          Cancelar
        </button>
        <button
          type="submit"
          className="popup__button"
          style={{ background: "#d32f2f" }}
        >
          Eliminar
        </button>
      </div>
    </form>
  );
}
