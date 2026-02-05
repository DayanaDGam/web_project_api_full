import { Link, useLocation } from "react-router-dom";

export default function Header({ loggedIn, email, onSignOut }) {
  const location = useLocation();

  return (
    <header className="header">
      <h1 className="header__logo">Around The U.S.</h1>

      <div className="header__auth">
        {loggedIn ? (
          <>
            <span className="header__email">{email}</span>
            <button
              className="header__logout"
              onClick={onSignOut}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            {location.pathname === "/signin" && (
              <Link to="/signup" className="header__link">
                Regístrate
              </Link>
            )}
            {location.pathname === "/signup" && (
              <Link to="/signin" className="header__link">
                Iniciar sesión
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}
