import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  // Estados para los valores de los inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password
      });
      
      sessionStorage.setItem('token', response.data.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error('Error:', error);
    }
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
                <img 
                  src="/logou.jpg" 
                  alt="Logo" 
                  className="logo-image"
                />
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
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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