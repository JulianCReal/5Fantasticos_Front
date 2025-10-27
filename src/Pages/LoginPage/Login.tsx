import React, { useState } from "react";
import "./Login.css";
import Popup from "../../Components/Popuperror/Popup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login: React.FC = () => {
  // Estados para los valores de los inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [popup, setPopup] = useState<{ title: string; message: string } | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        email,
        password
      });
      
      sessionStorage.setItem('token', response.data.data.token);
      sessionStorage.setItem('userProfile', JSON.stringify(response.data.data.profile));
      navigate("/dashboard");
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Ocurrió un error al iniciar sesión.";

        if (status === 404) {
          // Usuario no encontrado
          setPopup({
            title: "Usuario no encontrado",
            message,
          });
        } else if (status === 401) {
          setPopup({
            title: "Credenciales inválidas",
            message: "Correo o contraseña incorrectos.",
          });
        } else {
          setPopup({
            title: "Error del servidor",
            message: "Intenta de nuevo más tarde.",
          });
        }
      } else {
        setPopup({
          title: "Error de conexión",
          message: "No se pudo conectar con el servidor.",
        });
      }
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
      {popup && (<Popup title={popup.title} message={popup.message} onClose={() => setPopup(null)}/>)}
    </div>
  );
};

export default Login;