import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register({ onRegister }) {
  const [formValue, setFormValue] = useState({ email: '', password: '' });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormValue((s) => ({ ...s, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onRegister(formValue);
  }

  return (
    <div className="auth">
      <h2 className="auth__title">Regístrate</h2>

      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__input"
          type="email"
          name="email"
          placeholder="Correo electrónico"
          required
          value={formValue.email}
          onChange={handleChange}
        />

        <input
          className="auth__input"
          type="password"
          name="password"
          placeholder="Contraseña"
          required
          value={formValue.password}
          onChange={handleChange}
        />

        <button className="auth__submit" type="submit">
          Regístrate
        </button>
      </form>

      <p className="auth__caption">
        ¿Ya eres miembro?{' '}
        <Link className="auth__link" to="/signin">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}
