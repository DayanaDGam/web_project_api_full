export default function Popup({ title, children, onClose }) {
  return (
    <div className="popup popup_opened" role="dialog" aria-modal="true">
      <div className="popup__container">
        <button
          type="button"
          aria-label="Close modal"
          className="popup__button_close"
          onClick={onClose}
        ></button>

        {title ? <h3 className="popup__title">{title}</h3> : null}

        <div className="popup__content">{children}</div>
      </div>
    </div>
  );
}










