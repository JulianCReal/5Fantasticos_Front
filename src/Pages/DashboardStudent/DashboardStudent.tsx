import React, { JSX, useState } from "react";
import "./DashboardStudent.css";
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
        "Mi horario": (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M12 16h.01"></path>
                <path d="M8 16h.01"></path>
                <path d="M16 16h.01"></path>
            </svg>
        ),
        "Semáforo": (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="10" y="2" width="4" height="20" rx="2"></rect>
                {/* Ícono de lápiz en lugar de círculo para el semáforo como en la imagen */}
                <line x1="10" y1="2" x2="10" y2="22" stroke="none" /> 
                <line x1="14" y1="2" x2="14" y2="22" stroke="none" />
                <path d="M12 17v4m0-12V7M12 12h.01" />
                <path d="M16 3l-4 4-4-4" />
                <path d="M16 21l-4-4-4 4" />
                <path d="M18 10h-2v4h2z" />
                <path d="M6 10h-2v4h2z" />
            </svg>
        ),
        "Solicitudes": (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M12 14h.01"></path>
                <path d="M10 18h4"></path>
            </svg>
        ),
        "Calificaciones": (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M8 12h8"></path>
                <path d="M8 16h8"></path>
                <path d="M8 20h8"></path>
            </svg>
        ),
        "Registros Academicos": (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2"></path>
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

// Sub-componente para cada módulo (icono + texto)
const ModuleCard: React.FC<ModuleProps> = ({ iconType, label, onClick }) => (
    <div className="module-card" onClick={onClick} style={{ cursor: "pointer" }}>
        <div className="module-icon">
            {/* Si el tipo es 'Semáforo', usamos un ícono diferente al SVG original */}
            {iconType === "Semáforo" ? (
                 <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="10" y="2" width="4" height="20" rx="2"></rect>
                    <circle cx="12" cy="7" r="1.5" fill="red" stroke="none" />
                    <circle cx="12" cy="12" r="1.5" fill="yellow" stroke="none" />
                    <circle cx="12" cy="17" r="1.5" fill="green" stroke="none" />
                </svg>
            ) : (
                <ModuleIconSVG type={iconType} />
            )}
        </div>
        <span className="module-text">{label}</span>
    </div>
);

// --- COMPONENTE PRINCIPAL DASHBOARD ---
const DashboardStudent: React.FC = () => {
    
    
    const [showProfileSidebar, setShowProfileSidebar] = useState(false);

    const navigate = useNavigate();
    
    const handleRequestDashboard = () => {
        navigate("/requestDashboard");
    };
    const handleHorario = async () => {
        try {
            // Nota: Mantenemos la lógica original de autenticación y axios
            const token = sessionStorage.getItem('token');
            const userProfile = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
            const studentId = userProfile.studentId;
            
            const response = await axios.get(`http://localhost:8083/api/schedules/my-schedule/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            navigate("/scheduleDisplay", { state: { scheduleData: response.data } });
        } catch (error) {
            console.error('Error obteniendo horario:', error);
            navigate("/scheduleDisplay");
        }
    }
    const handleSemaforo = ()=>{
        navigate("/")
    }
    const handleCalificaciones = ()=>{
        navigate("/")
    }
    const handleRegistros = ()=>{
        navigate("/")
    }

    const modules: ModuleProps[] = [
        { iconType: "Mi horario", label: "Mi horario", onClick: handleHorario },
        { iconType: "Semáforo", label: "Semáforo", onClick: handleSemaforo },
        { iconType: "Solicitudes", label: "Solicitudes", onClick: handleRequestDashboard },
        { iconType: "Calificaciones", label: "Calificaciones", onClick: handleCalificaciones },
        { iconType: "Registros Academicos", label: "Registros Academicos", onClick: handleRegistros },
    ];

    return (
        <div className="dashboard-container">
            
            <header className="dashboard-header">
                <div className="dashboard-logo-container">
                    ESCUELA COLOMBIANA DE INGENIERÍA
                    <br/>
                    JULIO GARAVITO
                </div>
                
                {/* Contenedor Flex para la barra de búsqueda y el ícono de perfil */}
                <div className="header-right-tools">
                    {/* Barra de Búsqueda UNIFICADA (Botón a la izquierda) */}
                    <div className="search-bar-container">
                        <button className="search-button">Buscar</button> 
                        <input
                            type="text"
                            placeholder="Ingresa tu búsqueda"
                            className="search-input"
                        />
                    </div>
                    
                    {/* Nuevo Ícono de Perfil */}
                    <button className="profile-icon-button" onClick={() => setShowProfileSidebar(true)}>
                        <div className="profile-icon-svg">
                            <ModuleIconSVG type="Perfil" />
                        </div>
                    </button>
                    {/* Nota: ProfileSidebar requiere ser importado o simulado */}
                    <ProfileSidebar open={showProfileSidebar} onClose={() => setShowProfileSidebar(false)} />
                </div>
            </header>

            <div className="dashboard-content">
                <div className="modules-grid">
                    {modules.map((module, index) => (
                        <ModuleCard key={index} iconType={module.iconType} label={module.label} onClick={module.onClick}/>
                    ))}
                </div>
            </div>

            <div className="dashboard-footer-wave-1"></div>
            <div className="dashboard-footer-wave-2"></div>
        </div>
    );
};

export default DashboardStudent;