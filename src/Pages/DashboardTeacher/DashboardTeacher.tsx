import React, { JSX, useState } from "react";
import "./DashboardTeacher.css";
import ProfileSidebar from "../../Components/SideBarProfile/ProfileSideBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Interface para props de los módulos
interface ModuleProps {
  iconType: string;
  label: string;
  onClick?: () => void;
}

// Iconos SVG reutilizados
const ModuleIconSVG: React.FC<{ type: string }> = ({ type }) => {
  const iconMap: { [key: string]: JSX.Element } = {
    "Mi Información": (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    "Mis Grupos": (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    "Estudiantes": (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    "Horarios": (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    "Perfil": (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
  };
  return iconMap[type] || null;
};

// Sub-componente para cada módulo
const ModuleCard: React.FC<ModuleProps> = ({ iconType, label, onClick }) => (
  <div className="teacher-module-card" onClick={onClick}>
    <div className="teacher-module-icon">
      <ModuleIconSVG type={iconType} />
    </div>
    <span className="teacher-module-text">{label}</span>
  </div>
);

// --- DASHBOARD PRINCIPAL DEL PROFESOR ---
const DashboardTeacher: React.FC = () => {

  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const navigate = useNavigate();

  // Verificar autenticación al cargar el componente
  React.useEffect(() => {
    const token = sessionStorage.getItem('token');
    const userRole = sessionStorage.getItem('userRole');
    const userProfile = sessionStorage.getItem('userProfile');
    
    console.log("DashboardTeacher - Token:", token ? "Existe" : "No existe");
    console.log("DashboardTeacher - Rol:", userRole);
    console.log("DashboardTeacher - Profile:", userProfile);
    
    if (!token) {
      console.warn("No hay token, redirigiendo al login");
      navigate("/");
      return;
    }
    
    const normalizedRole = userRole?.toUpperCase().trim();
    if (normalizedRole !== 'TEACHER' && normalizedRole !== 'PROFESSOR') {
      console.warn("Rol no es TEACHER ni PROFESSOR, rol actual:", normalizedRole);
      navigate("/");
      return;
    }
  }, [navigate]);

  // --- Lógica de conexión directa con el backend ---

  // ✅ Módulo: Mi Información
  const handleMiInformacion = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const userProfile = JSON.parse(sessionStorage.getItem("userProfile") || "{}");
      const teacherId = userProfile.id;

      console.log("Obteniendo información del profesor:", teacherId);

      if (!teacherId) {
        console.error("teacherId no encontrado en el perfil:", userProfile);
        return;
      }

      const response = await axios.get(`http://localhost:8083/api/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Información del profesor:", response.data);
      navigate("/teacherInfo", { state: { teacherData: response.data } });
    } catch (error) {
      console.error("Error obteniendo información:", error);
      navigate("/teacherInfo");
    }
  };

  // ✅ Módulo: Mis Grupos
  const handleMisGrupos = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const userProfile = JSON.parse(sessionStorage.getItem("userProfile") || "{}");
      const teacherId = userProfile.id;

      console.log("Obteniendo grupos del profesor:", teacherId);

      if (!teacherId) {
        console.error("teacherId no encontrado en el perfil:", userProfile);
        return;
      }

      const response = await axios.get(`http://localhost:8083/api/teachers/${teacherId}/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Grupos del profesor:", response.data);
      navigate("/teacherGroups", { state: { groups: response.data } });
    } catch (error) {
      console.error("Error obteniendo grupos:", error);
      navigate("/teacherGroups");
    }
  };

  // ✅ Módulo: Estudiantes
  const handleEstudiantes = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const userProfile = JSON.parse(sessionStorage.getItem("userProfile") || "{}");
      const teacherId = userProfile.id;

      console.log("Obteniendo grupos para ver estudiantes:", teacherId);

      if (!teacherId) {
        console.error("teacherId no encontrado en el perfil:", userProfile);
        return;
      }

      // Primero obtenemos los grupos del profesor
      const groupsResponse = await axios.get(`http://localhost:8083/api/teachers/${teacherId}/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Grupos para estudiantes:", groupsResponse.data);
      navigate("/teacherStudents", { state: { groups: groupsResponse.data } });
    } catch (error) {
      console.error("Error obteniendo estudiantes:", error);
      navigate("/teacherStudents");
    }
  };

  // ✅ Módulo: Horarios
  const handleHorarios = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const userProfile = JSON.parse(sessionStorage.getItem("userProfile") || "{}");
      const teacherId = userProfile.id;

      console.log("Obteniendo grupos para ver horarios:", teacherId);

      if (!teacherId) {
        console.error("teacherId no encontrado en el perfil:", userProfile);
        return;
      }

      // Obtenemos los grupos del profesor
      const groupsResponse = await axios.get(`http://localhost:8083/api/teachers/${teacherId}/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Grupos para horarios:", groupsResponse.data);
      navigate("/teacherSchedules", { state: { groups: groupsResponse.data } });
    } catch (error) {
      console.error("Error obteniendo horarios:", error);
      navigate("/teacherSchedules");
    }
  };

  // --- Definición de módulos del dashboard ---
  const modules: ModuleProps[] = [
    { iconType: "Mi Información", label: "Mi Información", onClick: handleMiInformacion },
    { iconType: "Mis Grupos", label: "Mis Grupos", onClick: handleMisGrupos },
    { iconType: "Estudiantes", label: "Estudiantes", onClick: handleEstudiantes },
    { iconType: "Horarios", label: "Horarios", onClick: handleHorarios },
  ];

  return (
    <div className="teacher-dashboard-container">
      <header className="teacher-dashboard-header">
        <div className="teacher-dashboard-logo-container">
          ESCUELA COLOMBIANA DE INGENIERÍA
          <br />
          JULIO GARAVITO
        </div>

        <div className="teacher-header-right-tools">
          <div className="teacher-search-bar-container">
            <button className="teacher-search-button">Buscar</button>
            <input type="text" placeholder="Ingresa tu búsqueda" className="teacher-search-input" />
          </div>

          <button className="teacher-profile-icon-button" onClick={() => setShowProfileSidebar(true)}>
            <div className="teacher-profile-icon-svg">
              <ModuleIconSVG type="Perfil" />
            </div>
          </button>

          <ProfileSidebar open={showProfileSidebar} onClose={() => setShowProfileSidebar(false)} />
        </div>
      </header>

      <div className="teacher-dashboard-content">
        <div className="teacher-modules-grid">
          {modules.map((module, index) => (
            <ModuleCard key={index} iconType={module.iconType} label={module.label} onClick={module.onClick} />
          ))}
        </div>
      </div>

      <div className="teacher-dashboard-footer-wave-1"></div>
      <div className="teacher-dashboard-footer-wave-2"></div>
    </div>
  );
};

export default DashboardTeacher;
