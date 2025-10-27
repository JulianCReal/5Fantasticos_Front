import React, { JSX, useState } from "react";
import "./RequestDashboard.css";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../../Components/SideBarProfile/ProfileSideBar";


const ModuleIconSVG: React.FC<{ type: string }> = ({ type }) => {
    // Definiciones de íconos SVG para cada módulo y acción
    const iconMap: { [key: string]: JSX.Element } = {
        "Perfil": (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        ),
        "Atrás": ( 
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        ),
        "Cambio de grupo": (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12V7a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h4"></path>
                <path d="M17 19l3 3m0 0l3-3"></path>
                <path d="M20 22v-6"></path>
            </svg>
        ),
        "Dar de baja una clase": (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        ),
        "Añadir una clase": (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        ),
        "Cancelar una materia": (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
        ),
        "Certificado académico": (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
                <rect x="7" y="13" width="10" height="8" rx="1" ry="1"></rect>
                <line x1="12" y1="17" x2="12" y2="17"></line>
                <line x1="10" y1="15" x2="14" y2="15"></line>
            </svg>
        ),
        "Certificado financiero": (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
        ),
    };
    return iconMap[type] || null;
};

interface RequestItemProps {
    iconType: string;
    label: string;
    position: 'left' | 'right'; 
    onClick?: () => void;
}

const RequestItem: React.FC<RequestItemProps> = ({ iconType, label, position, onClick}) => {
    return (
        <div className={`request-item request-item-${position}`} onClick={onClick} style={{ cursor: "pointer" }}>
            <div className="request-icon-container">
                <ModuleIconSVG type={iconType} />
            </div>
            <div className="request-text-content">
                <span className="request-label">{label}</span>
            </div>
        </div>
    );
};



interface RequestDashboardProps {
    onBack?: () => void; // Hacemos esta prop opcional para el componente aislado
}

const RequestDashboard: React.FC<RequestDashboardProps> = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
        navigate("/dashboard");
    };
    const groupChange = ()=>{
        navigate("/groupChangeRequest")
    }
    const groupJoin = ()=>{
        navigate("/groupJoinRequest")
    }
    const groupLeave = ()=>{
        navigate("/groupLeaveRequest")
    }

    const requestCategories = [
        { iconType: "Cambio de grupo", label: "Cambio de grupo", onClick: groupChange },
        { iconType: "Dar de baja una clase", label: "Dar de baja una clase", onClick: groupLeave},
        { iconType: "Añadir una clase", label: "Añadir una clase", onClick: groupJoin},
        { iconType: "Cancelar una materia", label: "Cancelar una materia", onClick: groupChange },
        { iconType: "Certificado académico", label: "Certificado académico", onClick: groupChange },
        { iconType: "Certificado financiero", label: "Certificado financiero", onClick: groupChange },
    ];

    const leftColumn = requestCategories.slice(0, 3).map(req => ({...req, position: 'left' as const}));
    const rightColumn = requestCategories.slice(3, 6).map(req => ({...req, position: 'right' as const}));

    const [showProfileSidebar, setShowProfileSidebar] = useState(false);

    return (
        <div className="request-page-container">
            {/* Header de la página de solicitudes */}
            <header className="request-page-header">
                <button className="back-button" onClick={handleBack} style={{ cursor: "pointer" }}>
                    <div className="back-icon-svg">
                        <ModuleIconSVG type="Atrás" />
                    </div>
                </button>
                <h1 className="request-page-title">Espacio para Solicitudes</h1>
                <button className="profile-icon-button" onClick={() => setShowProfileSidebar(true)}>
                    <div className="profile-icon-svg">
                        <ModuleIconSVG type="Perfil" />
                    </div>
                </button>
            </header>
            <ProfileSidebar open={showProfileSidebar} onClose={() => setShowProfileSidebar(false)} />


            <div className="request-page-content-wrapper">
                <h2 className="request-section-title">Tipos de solicitudes</h2>
                <div className="request-grid">
                    {/* Columna Izquierda */}
                    <div className="request-column">
                        {leftColumn.map((item, index) => (
                            <RequestItem key={index} {...item} />
                        ))}
                    </div>
                    
                    {/* Imagen Central */}
                    <div className="request-image-container">
                        <img 
                            src="https://placehold.co/300x200/5A5A5A/FFFFFF?text=Estudiantes+Colaborando"
                            alt="Estudiantes colaborando en un proyecto académico"
                            className="request-center-image"
                            onError={(e) => {
                                // Fallback para la imagen
                                e.currentTarget.src = "https://placehold.co/300x200/5A5A5A/FFFFFF?text=Imagen+No+Disponible";
                            }}
                        />
                    </div>

                    {/* Columna Derecha */}
                    <div className="request-column">
                        {rightColumn.map((item, index) => (
                            <RequestItem key={index} {...item} />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RequestDashboard;