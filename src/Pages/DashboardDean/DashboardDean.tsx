import React, { JSX, useState } from "react";
import "./DashboardDean.css";
import ProfileSidebar from "../../Components/SideBarProfile/ProfileSideBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface ModuleProps {
    iconType: string;
    label: string;
    onClick?: () => void;
}

// Iconos personalizados y relevantes para el Decano (usando Lucide Icons)
const ModuleIconSVG: React.FC<{ type: string }> = ({ type }) => {
    const iconMap: { [key: string]: JSX.Element } = {
        "Panel": ( // Dashboard de rendimiento general
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                <rect x="3" y="16" width="7" height="5" rx="1"></rect>
                <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                <rect x="14" y="12" width="7" height="9" rx="1"></rect>
            </svg>
        ),
        "Solicitudes": ( // Gestión de peticiones (traslados, cancelaciones)
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M12 18h.01"></path>
                <path d="M10 14h4"></path>
            </svg>
        ),
        "Reportes": ( // Generación de reportes académicos
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="10" y1="12" x2="14" y2="12"></line>
                <line x1="12" y1="10" x2="12" y2="14"></line>
                <path d="M16 17H8"></path>
            </svg>
        ),
        "Planificación": ( // Gestión de horarios y recursos
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M12 16h.01"></path>
            </svg>
        ),
        "Docentes": ( // Gestión del personal docente
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        ),
        "Admisión": ( // Revisión de procesos de admisión o transferencia
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5"></path>
                <path d="M5 12l7-7 7 7"></path>
                <path d="M19 19H5"></path>
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
    <div className="dean-module-card" onClick={onClick} style={{ cursor: "pointer" }}>
        <div className="dean-module-icon">
            <ModuleIconSVG type={iconType} />
        </div>
        <span className="dean-module-text">{label}</span>
    </div>
);

// =========================================================
// 3. COMPONENTE PRINCIPAL DASHBOARD DECANO
// =========================================================

const DashboardDean: React.FC = () => {
    
    const [showProfileSidebar, setShowProfileSidebar] = useState(false);
    const [studentPerformance, setStudentPerformance] = useState({ average: 0, pendingActions: 0 });

    const navigate = useNavigate();
    
    // Simulación de carga de datos iniciales para el Panel de Control
    React.useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Simulación: Cargar datos clave del rendimiento estudiantil
                const response = await axios.get("http://localhost:8083/api/dean/student-performance");
                setStudentPerformance(response.data);
            } catch (error) {
                console.error("Error cargando datos del decano:", error);
                setStudentPerformance({ average: 3.5, pendingActions: 3 }); // Fallback data
            }
        };
        loadInitialData();
    }, []);

    // Handlers de Navegación (simulados)
    const handlePanel = () => { navigate("/dean/analytics"); };
    const handleRequests = () => { navigate("/dean/requests"); };
    const handleReports = () => { navigate("/dean/reports"); };
    const handlePlanning = () => { navigate("/dean/planning"); };
    const handleFaculty = () => { navigate("/dean/faculty-management"); };
    const handleAdmission = () => { navigate("/dean/admission-review"); };

    const modules: ModuleProps[] = [
        { iconType: "Panel", label: "Panel de Rendimiento", onClick: handlePanel },
        { iconType: "Solicitudes", label: "Gestión de Solicitudes", onClick: handleRequests },
        { iconType: "Reportes", label: "Generación de Reportes", onClick: handleReports },
        { iconType: "Planificación", label: "Planificación Académica", onClick: handlePlanning },
        { iconType: "Docentes", label: "Gestión del Personal", onClick: handleFaculty },
        { iconType: "Admisión", label: "Revisión de Admisión", onClick: handleAdmission },
    ];

    return (
        <div className="dean-dashboard-container">
            
            <header className="dean-dashboard-header">
                <div className="dean-dashboard-logo-container">
                    DECANATO DE INGENIERÍA
                    <br/>
                    ESCUELA COLOMBIANA
                </div>

                <div className="dean-header-right-tools">
                    <div className="dean-search-bar-container">
                        <button className="dean-search-button">Buscar</button>
                        <input
                            type="text"
                            placeholder="Buscar estudiantes, clases..."
                            className="search-input"
                        />
                    </div>

                    <button className="dean-profile-icon-button" onClick={() => setShowProfileSidebar(true)}>
                        <div className="dean-profile-icon-svg">
                            <ModuleIconSVG type="Perfil" />
                        </div>
                    </button>
                    <ProfileSidebar open={showProfileSidebar} onClose={() => setShowProfileSidebar(false)} />
                </div>
            </header>

            <div className="dean-dashboard-content">
                <h1 className="dean-welcome-title">
                    Bienvenido, Decano
                </h1>
                
                {/* Indicadores Clave (Métricas de alto nivel para el Decano) */}
                <div className="dean-modules-grid" style={{marginBottom: '40px'}}>
                    <div className="dean-module-card" style={{borderTopColor: '#006400'}}> {/* Dark Green */}
                        <span className="dean-module-text" style={{fontSize: '2rem', fontWeight: 900, color: '#006400'}}>
                            {studentPerformance.average.toFixed(2)}
                        </span>
                        <span className="dean-module-text" style={{fontSize: '0.9rem', color: '#555', fontWeight: 600}}>
                            Promedio General
                        </span>
                    </div>
                    
                    <div className="dean-module-card" style={{borderTopColor: '#ff8c00'}}> {/* Dark Orange */}
                        <span className="dean-module-text" style={{fontSize: '2rem', fontWeight: 900, color: '#ff8c00'}}>
                            {studentPerformance.pendingActions}
                        </span>
                        <span className="dean-module-text" style={{fontSize: '0.9rem', color: '#555', fontWeight: 600}}>
                            Solicitudes Pendientes
                        </span>
                    </div>

                    <div className="dean-module-card" style={{borderTopColor: '#8b0000'}}> {/* Red */}
                        <span className="dean-module-text" style={{fontSize: '2rem', fontWeight: 900, color: '#8b0000'}}>
                            4
                        </span>
                        <span className="dean-module-text" style={{fontSize: '0.9rem', color: '#555', fontWeight: 600}}>
                            Reportes en Borrador
                        </span>
                    </div>

                    <div className="dean-module-card" style={{borderTopColor: '#1e90ff'}}> {/* Dodger Blue */}
                        <span className="dean-module-text" style={{fontSize: '2rem', fontWeight: 900, color: '#1e90ff'}}>
                            25
                        </span>
                        <span className="dean-module-text" style={{fontSize: '0.9rem', color: '#555', fontWeight: 600}}>
                            Docentes Activos
                        </span>
                    </div>
                </div>


                {/* Módulos de Acciones (Grid de Módulos) */}
                <div className="dean-modules-grid">
                    {modules.map((module, index) => (
                        <ModuleCard key={index} iconType={module.iconType} label={module.label} onClick={module.onClick}/>
                    ))}
                </div>
            </div>

            <div className="dean-dashboard-footer-wave-1"></div>
            <div className="dean-dashboard-footer-wave-2"></div>
        </div>
    );
};

export default DashboardDean;
