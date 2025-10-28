import React, { JSX, useState } from "react";
import "../../DashboardAdmin/DashboardAdmin.css"; // Reuse the CSS
import ProfileSidebar from "../../../Components/SideBarProfile/ProfileSideBar";
import { useNavigate } from "react-router-dom";

interface ModuleProps {
  iconType: string;
  label: string;
  onClick?: () => void;
}

const ModuleIconSVG: React.FC<{ type: string }> = ({ type }) => {
  const iconMap: { [key: string]: JSX.Element } = {
    "Registrar Profesor": (
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
        <path d="M19 8v6"></path>
        <path d="M22 11h-6"></path>
      </svg>
    ),
    "Actualizar Profesor": (
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
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    ),
    "Borrar Profesor": (
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
        <path d="M17 8l5 5"></path>
        <path d="M22 8l-5 5"></path>
      </svg>
    ),
    "Buscar Profesor": (
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
        <circle cx="11" cy="11" r="8"></circle>
        <path d="M21 21l-4.35-4.35"></path>
      </svg>
    ),
    "Listar Profesores": (
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
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
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

const ModuleCard: React.FC<ModuleProps> = ({ iconType, label, onClick }) => (
  <div
    className="admin-module-card"
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    <div className="admin-module-icon">
      <ModuleIconSVG type={iconType} />
    </div>
    <span className="admin-module-text">{label}</span>
  </div>
);

const Teacher: React.FC = () => {
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  const navigate = useNavigate();

  const handleRegistrar = () => {
    navigate("/admin/teacher/register");
  };
  const handleActualizar = () => {
    navigate("/admin/teacher/update");
  };
  const handleBorrar = () => {
    navigate("/admin/teacher/delete");
  };
  const handleBuscar = () => {
    navigate("/admin/teacher/search");
  };
  const handleListar = () => {
    navigate("/admin/teacher/list");
  };

  const modules: ModuleProps[] = [
    {
      iconType: "Registrar Profesor",
      label: "Registrar Profesor",
      onClick: handleRegistrar,
    },
    {
      iconType: "Actualizar Profesor",
      label: "Actualizar Profesor",
      onClick: handleActualizar,
    },
    {
      iconType: "Borrar Profesor",
      label: "Borrar Profesor",
      onClick: handleBorrar,
    },
    {
      iconType: "Buscar Profesor",
      label: "Buscar Profesor",
      onClick: handleBuscar,
    },
    {
      iconType: "Listar Profesores",
      label: "Listar Profesores",
      onClick: handleListar,
    },
  ];

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">
          PANEL DE PROFESORES
        </div>

        <div className="admin-header-right-tools">
          <button
            className="admin-search-button"
            onClick={() => navigate("/dashboardAdmin")}
            style={{ marginRight: "10px" }}
          >
            Volver
          </button>

          <div className="admin-search-bar-container">
            <button className="admin-search-button">Buscar</button>
            <input
              type="text"
              placeholder="Ingresa tu búsqueda"
              className="admin-search-input"
            />
          </div>

          <button
            className="admin-profile-icon-button"
            onClick={() => setShowProfileSidebar(true)}
          >
            <div className="admin-profile-icon-svg">
              <ModuleIconSVG type="Perfil" />
            </div>
          </button>
          <ProfileSidebar
            open={showProfileSidebar}
            onClose={() => setShowProfileSidebar(false)}
          />
        </div>
      </header>

      <div className="admin-dashboard-content">
        <div className="admin-modules-grid">
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

      <div className="admin-dashboard-footer-wave-1"></div>
      <div className="admin-dashboard-footer-wave-2"></div>
    </div>
  );
};

export default Teacher;
