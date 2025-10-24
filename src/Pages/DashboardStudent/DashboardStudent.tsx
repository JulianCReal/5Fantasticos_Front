import React, { JSX, useState } from "react";
import "./Dashboard.css";

interface ModuleProps {
    iconType: string;
    label: string;
}

const ModuleIconSVG: React.FC<{ type: string }> = ({ type }) => {
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
                <circle cx="12" cy="7" r="1.5" fill="red" stroke="none" />
                <circle cx="12" cy="12" r="1.5" fill="yellow" stroke="none" />
                <circle cx="12" cy="17" r="1.5" fill="green" stroke="none" />
                <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1"/>
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
    };
    return iconMap[type] || null;
};

// Sub-componente para cada módulo (icono + texto)
const ModuleCard: React.FC<ModuleProps> = ({ iconType, label }) => (
    <div className="module-card" onClick={() => console.log(`Navegar a ${label}`)}>
        <div className="module-icon">
            <ModuleIconSVG type={iconType} />
        </div>
        <span className="module-text">{label}</span>
    </div>
);

// --- COMPONENTE PRINCIPAL DASHBOARD ---
const Dashboard: React.FC = () => {
    // Definición de los módulos
    const modules = [
        { iconType: "Mi horario", label: "Mi horario" },
        { iconType: "Semáforo", label: "Semáforo" },
        { iconType: "Solicitudes", label: "Solicitudes" }, 
        { iconType: "Calificaciones", label: "Calificaciones" },
        { iconType: "Registros Academicos", label: "Registros Academicos" },
    ];

    return (
        <div className="dashboard-container">
            {/* El header ahora está fuera del dashboard-content para que no se centre */}
            <header className="dashboard-header">
                <div className="dashboard-logo-container">
                    ESCUELA COLOMBIANA DE INGENIERÍA
                    <br/>
                    JULIO GARAVITO
                </div>
                
                {/* Barra de Búsqueda UNIFICADA (Botón a la izquierda) */}
                <div className="search-bar-container">
                    <button className="search-button">Buscar</button> 
                    <input
                        type="text"
                        placeholder="Ingresa tu búsqueda"
                        className="search-input"
                    />
                </div>
            </header>

            <div className="dashboard-content">
                {/* Contenedor de Módulos Centrales (Ahora sí centrado verticalmente, pero movido hacia arriba) */}
                <div className="modules-grid">
                    {modules.map((module, index) => (
                        <ModuleCard key={index} iconType={module.iconType} label={module.label} />
                    ))}
                </div>
            </div>

            {/* Formas de onda roja en el footer, con varias curvas y capas suaves */}
            <div className="dashboard-footer-wave-1"></div>
            <div className="dashboard-footer-wave-2"></div>
        </div>
    );
};

export default Dashboard;
