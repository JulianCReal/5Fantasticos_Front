import React, { useState } from "react";
import "./Login.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Usuario:", username);
    console.log("Contraseña:", password);
    alert(`Inicio de sesión de ${username}`);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">
          <h3>ESCUELA COLOMBIANA DE INGENIERÍA JULIO GARAVITO</h3>
          <h4>UNIVERSIDAD</h4>
          <div className="login-logo-icon"></div> {/* Placeholder for the logo icon */}
        </div>
        <span className="login-title">SIHRA</span>
      </div>
      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              placeholder="Pepito.perez-p"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;