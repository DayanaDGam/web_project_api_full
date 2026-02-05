export default function InfoTooltip({ isOpen, onClose, isSuccess, message }) {
  if (!isOpen) return null;

  return (
    <div className="popup popup_opened" onMouseDown={onClose}>
      <div className="popup__container" onMouseDown={(e) => e.stopPropagation()}>
        <button className="popup__close" type="button" aria-label="Cerrar" onClick={onClose} />
        <div className="infotooltip">
          <div className={`infotooltip__icon ${isSuccess ? 'infotooltip__icon_success' : 'infotooltip__icon_fail'}`} />
          <h2 className="infotooltip__title">
            {message || (isSuccess ? '¡Correcto! Ya estás registrado.' : 'Uy, algo salió mal. Por favor, inténtalo de nuevo.')}
          </h2>
        </div>
      </div>
    </div>
  );
}
