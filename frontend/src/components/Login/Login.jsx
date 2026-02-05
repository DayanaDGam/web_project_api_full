import { Link } from "react-router-dom";
import { useState } from "react";

export default function Login({ onLogin }) {
  const [data, setData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(data);
  };

  return (
    <div className="auth">
      <h2 className="auth__title">Inicia sesión</h2>

      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__input"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={data.email}
          onChange={handleChange}
          required
        />
        <input
          className="auth__input"
          type="password"
          name="password"
          placeholder="Contraseña"
          value={data.password}
          onChange={handleChange}
          required
        />

        <button className="auth__button" type="submit">
          Inicia sesión
        </button>
      </form>

      <p className="auth__caption">
        ¿Aún no eres miembro?{" "}
        <Link className="auth__link" to="/signup">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
