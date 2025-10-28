import React, { JSX, useState } from "react";
import "../DashboardStudent/DashboardStudent.css";
import ProfileSidebar from "../../Components/SideBarProfile/ProfileSideBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ModuleProps {
  iconType: string;
  label: string;
  onClick?: () => void;
}

const ModuleIconSVG: React.FC<{ type: string }> = ({ type }) => {
  // Definiciones de íconos (se mantienen)
  const iconMap: { [key: string]: JSX.Element } = {
    Estudiantes: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    Profesores: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
        <path d="M16 11l2 2 4-4"></path>
      </svg>
    ),
    Decanos: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21h18"></path>
        <path d="M5 21V7l8-4v18"></path>
        <path d="M19 21V11l-6-4"></path>
        <path d="M9 9h6"></path>
        <path d="M9 13h6"></path>
        <path d="M9 17h6"></path>
      </svg>
    ),

    Decanaturas: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21h18"></path>
        <path d="M5 21V7l8-4v18"></path>
        <path d="M19 21V11l-6-4"></path>
        <path d="M9 9h6"></path>
        <path d="M9 13h6"></path>
        <path d="M9 17h6"></path>
      </svg>
    ),
    Materias: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    ),
    Grupos: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    Perfil: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
  };
  return iconMap[type] || null;
};

// Sub-componente para cada módulo (icono + texto)
const ModuleCard: React.FC<ModuleProps> = ({ iconType, label, onClick }) => (
  <div
    className="student-module-card"
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    <div className="student-module-icon">
      {/* Si el tipo es 'Semáforo', usamos un ícono diferente al SVG original */}
      {iconType === "Semáforo" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="10" y="2" width="4" height="20" rx="2"></rect>
          <circle cx="12" cy="7" r="1.5" fill="red" stroke="none" />
          <circle cx="12" cy="12" r="1.5" fill="yellow" stroke="none" />
          <circle cx="12" cy="17" r="1.5" fill="green" stroke="none" />
        </svg>
      ) : (
        <ModuleIconSVG type={iconType} />
      )}
    </div>
    <span className="student-module-text">{label}</span>
  </div>
);

// --- COMPONENTE PRINCIPAL DASHBOARD ---
const DashboardAdmin: React.FC = () => {
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  const navigate = useNavigate();

  const handleEstudiantes = () => {
    navigate("/admin/students");
  };
  const handleProfesores = () => {
    navigate("/admin/teacher");
  };
  const handleDecanos = () => {
    navigate("/admin/dean");
  };
  const handleDecanaturas = () => {
    navigate("/admin/decanatures");
  };
  const handleMaterias = () => {
    navigate("/admin/subject");
  };
  const handleGrupos = () => {
    navigate("/admin/group");
  };

  const modules: ModuleProps[] = [
    {
      iconType: "Estudiantes",
      label: "Estudiantes",
      onClick: handleEstudiantes,
    },
    { iconType: "Profesores", label: "Profesores", onClick: handleProfesores },
    { iconType: "Decanos", label: "Decanos", onClick: handleDecanos },
    {
      iconType: "Decanaturas",
      label: "Decanaturas",
      onClick: handleDecanaturas,
    },
    { iconType: "Materias", label: "Materias", onClick: handleMaterias },
    { iconType: "Grupos", label: "Grupos", onClick: handleGrupos },
  ];

  return (
    <div className="student-dashboard-container">
      <header className="student-dashboard-header">
        <div className="student-dashboard-logo-container">
          ESCUELA COLOMBIANA DE INGENIERÍA
          <br />
          JULIO GARAVITO
        </div>

        {/* Contenedor Flex para la barra de búsqueda y el ícono de perfil */}
        <div className="student-header-right-tools">
          {/* Barra de Búsqueda UNIFICADA (Botón a la izquierda) */}
          <div className="student-search-bar-container">
            <button className="student-search-button">Buscar</button>
            <input
              type="text"
              placeholder="Ingresa tu búsqueda"
              className="student-search-input"
            />
          </div>

          {/* Nuevo Ícono de Perfil */}
          <button
            className="student-profile-icon-button"
            onClick={() => setShowProfileSidebar(true)}
          >
            <div className="student-profile-icon-svg">
              <ModuleIconSVG type="Perfil" />
            </div>
          </button>
          {/* Nota: ProfileSidebar requiere ser importado o simulado */}
          <ProfileSidebar
            open={showProfileSidebar}
            onClose={() => setShowProfileSidebar(false)}
          />
        </div>
      </header>

      <div className="student-dashboard-content">
        <div className="student-modules-grid">
          {modules.map((module, index) => (
            <ModuleCard
              key={index}
              iconType={module.iconType}
              label={module.label}
              onClick={module.onClick}
            />
          ))}
        </div>
      </div>

      <div className="student-dashboard-footer-wave-1"></div>
      <div className="student-dashboard-footer-wave-2"></div>
    </div>
  );
};

export default DashboardAdmin;
