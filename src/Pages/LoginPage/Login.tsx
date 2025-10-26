import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  // Estados para los valores de los inputs, pre-rellenados como en la imagen
  const [username, setUsername] = useState("Pepito.perez-p");
  const [password, setPassword] = useState("••••••••");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Usuario:", username);
    console.log("Contraseña:", password);

    navigate("/dashboard");
    // Nota: Se evita el uso de alert() por buenas prácticas en React.
  };

  return (
    // Contenedor principal que centra la tarjeta
    <div className="login-page-container">
      {/* Tarjeta de Login */}
      <div className="login-card">
        {/* Panel Izquierdo (Rojo) */}
        <div className="login-left">
          {/* Formas de fondo abstractas */}
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>

          {/* Contenido del panel izquierdo */}
          <div className="login-left-content">
            <div className="login-logo">
              {/* Placeholder para el logo gráfico */}
              <div className="logo-placeholder">
                Logo
                <br />
                Aquí
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho (Blanco) */}
        <div className="login-right">
          {/* Badge "SIHRA" */}
          <div className="sihra-badge">SIHRA</div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-button">
              Iniciar sesion
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;