import React, { JSX, useState } from "react";
import "../../DashboardStudent/DashboardStudent.css";
import ProfileSidebar from "../../../Components/SideBarProfile/ProfileSideBar";
import { useNavigate } from "react-router-dom";

interface ModuleProps {
  iconType: string;
  label: string;
  onClick?: () => void;
}

const ModuleIconSVG: React.FC<{ type: string }> = ({ type }) => {
  // Definiciones de íconos (se mantienen)
  const iconMap: { [key: string]: JSX.Element } = {
    "Registrar Grupo": (
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
        <path d="M23 11h-6"></path>
        <path d="M20 8v6"></path>
      </svg>
    ),
    "Actualizar Grupo": (
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
    "Borrar Grupo": (
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
        <path d="M17 8l5 5"></path>
        <path d="M22 8l-5 5"></path>
      </svg>
    ),
    "Buscar Grupo": (
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
    "Matricular Estudiante": (
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
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
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
      <ModuleIconSVG type={iconType} />
    </div>
    <span className="student-module-text">{label}</span>
  </div>
);

// --- COMPONENTE PRINCIPAL DASHBOARD ---
const Group: React.FC = () => {
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  const navigate = useNavigate();

  const handleRegistrar = () => {
    navigate("/admin/group/register");
  };
  const handleActualizar = () => {
    navigate("/admin/group/update");
  };
  const handleBorrar = () => {
    navigate("/admin/group/delete");
  };
  const handleBuscar = () => {
    navigate("/admin/group/search");
  };
  const handleMatricular = () => {
    navigate("/admin/group/enroll");
  };

  const modules: ModuleProps[] = [
    {
      iconType: "Registrar Grupo",
      label: "Registrar Grupo",
      onClick: handleRegistrar,
    },
    {
      iconType: "Actualizar Grupo",
      label: "Actualizar Grupo",
      onClick: handleActualizar,
    },
    {
      iconType: "Borrar Grupo",
      label: "Borrar Grupo",
      onClick: handleBorrar,
    },
    {
      iconType: "Buscar Grupo",
      label: "Buscar Grupo",
      onClick: handleBuscar,
    },
    {
      iconType: "Matricular Estudiante",
      label: "Matricular Estudiante",
      onClick: handleMatricular,
    },
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
          {/* Botón de Volver */}
          <button
            className="student-search-button"
            onClick={() => navigate("/dashboardAdmin")}
            style={{ borderRadius: "8px" }}
          >
            Volver
          </button>

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

export default Group;
