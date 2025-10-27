import React, { useState, useCallback, useEffect } from "react";
import "./RequestChange.css";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../../../Components/SideBarProfile/ProfileSideBar";

const showMessage = (message: string) => console.log(`[MESSAGE]: ${message}`);


// =========================================================
// 1. TIPOS DE DATOS (MODELOS)
// =========================================================

interface ClassDetail {
    id: string;
    name: string;
    professor: string;
    schedule: string[];
}

interface RequestState {
    currentClassId: string;
    newClassId: string;
    motive: string;
    currentClassDetails: ClassDetail | null;
    newClassDetails: ClassDetail | null;
    isLoadingCurrent: boolean;
    isLoadingNew: boolean;
    error: string | null;
}


const API_BASE_URL = "http://localhost:8080/api/groups"; // Ajusta el dominio si usas despliegue

const fetchClassDetails = async (classId: string): Promise<ClassDetail | null> => {
    if (!classId) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/${classId}`);

        if (!response.ok) {
            console.warn(`Grupo ${classId} no encontrado (${response.status})`);
            return null;
        }

        const data = await response.json();

        // Mapea la respuesta del backend (GroupResponseDTO) a tu interfaz ClassDetail
        const mapped: ClassDetail = {
            id: data.id,
            name: data.subject?.name
                ? `${data.subject.name} - Grupo ${data.groupNumber || ''}`
                : `Grupo ${data.groupNumber || ''}`,
            professor: data.teacher?.name || "Sin profesor asignado",
            schedule: data.sessions?.length
                ? data.sessions.map(
                    (s: any) =>
                        `${s.day} / ${s.startTime} - ${s.endTime}${s.room ? ` (${s.room})` : ""}`
                )
                : ["Sin horario asignado"],
        };

        return mapped;
    } catch (error) {
        console.error("Error al obtener detalles del grupo:", error);
        return null;
    }
};
const BackIconSVG: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

const ProfileIconSVG: React.FC = React.memo(() => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
));

interface ClassDetailsCardProps {
    classDetails: ClassDetail | null;
    className: string;
    title: string;
    idInput: string;
    onIdChange: (id: string) => void;
    isLoading: boolean;
    error: string | null;
}

const ClassDetailsCard: React.FC<ClassDetailsCardProps> = ({
    classDetails,
    className,
    title,
    idInput,
    onIdChange,
    isLoading,
    error,
}) => {
    const isNewCard = className.includes('card-new');
    const inputStyle = { 
        backgroundColor: isNewCard ? 'rgba(255, 255, 255, 0.1)' : 'white', 
        color: isNewCard ? 'white' : 'black',
    } as React.CSSProperties;

    return (
        <div className={`card-class ${className}`}>
            <h2 className="card-title">{title}</h2>
            
            {/* Input para el ID de la clase */}
            <div className="input-group">
                <label htmlFor={`${title}-id`} className="input-label">Código de la clase:</label>
                <input
                    id={`${title}-id`}
                    type="text"
                    value={idInput}
                    onChange={(e) => onIdChange(e.target.value)}
                    placeholder="Ej. 10101"
                    className="input-field"
                    style={inputStyle}
                />
            </div>

            {isLoading && (
                <div className="loading-spinner"></div>
            )}

            {/* Mostrar detalles si están cargados */}
            {!isLoading && classDetails && (
                <>
                    <p>
                        <span className="detail-label">Materia:</span>
                        <span className="detail-value">{classDetails.name}</span>
                    </p>
                    <p>
                        <span className="detail-label">Profesor:</span>
                        <span className="detail-value">{classDetails.professor}</span>
                    </p>
                    <span className="detail-label" style={{marginBottom: 0}}>Horario:</span>
                    <ul className="schedule-list">
                        {classDetails.schedule.map((item, index) => (
                            <li key={index} className="schedule-item">{item}</li>
                        ))}
                    </ul>
                </>
            )}
            
            {/* Mensaje si no se encuentra la clase */}
            {!isLoading && !classDetails && idInput && !error && (
                <p style={{ color: isNewCard ? 'rgba(255, 255, 255, 0.8)' : '#8b0000', marginTop: '10px' }}>
                    Clase con código **{idInput}** no encontrada.
                </p>
            )}

            {/* Mensaje de error */}
            {error && (
                <p style={{ color: isNewCard ? 'yellow' : 'red', marginTop: '10px' }}>
                    {error}
                </p>
            )}
        </div>
    );
};



// =========================================================
// 5. COMPONENTE PRINCIPAL: RequestChange
// =========================================================

const RequestChange: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
        navigate("/requestDashboard");
    };
    
    const [state, setState] = useState<RequestState>({
        currentClassId: "10101",
        newClassId: "10102",
        motive: "Tengo un cruce de horarios que no puedo resolver y necesito cambiarme al Grupo 2 para evitar perder la materia.",
        currentClassDetails: null,
        newClassDetails: null,
        isLoadingCurrent: false,
        isLoadingNew: false,
        error: null,
    });

    const today = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const [showProfileSidebar, setShowProfileSidebar] = useState(false);


    // Función genérica para manejar la carga de detalles de la clase
    const loadClassDetails = useCallback(async (classId: string, type: 'current' | 'new') => {
        const loadingKey = type === 'current' ? 'isLoadingCurrent' : 'isLoadingNew';
        const detailsKey = type === 'current' ? 'currentClassDetails' : 'newClassDetails';

        if (!classId) {
            setState(prev => ({ ...prev, [detailsKey]: null }));
            return;
        }

        setState(prev => ({ ...prev, [loadingKey]: true, error: null }));

        try {
            const details = await fetchClassDetails(classId);
            setState(prev => ({
                ...prev,
                [detailsKey]: details,
                [loadingKey]: false,
            }));
        } catch (err) {
            console.error(`Error fetching ${type} class details:`, err);
            setState(prev => ({
                ...prev,
                [loadingKey]: false,
                error: `Error al cargar la clase ${type === 'current' ? 'actual' : 'nueva'}.`,
            }));
        }
    }, []);

    // Effect para cargar los detalles de ambas clases al cambiar los IDs
    useEffect(() => {
        loadClassDetails(state.currentClassId, 'current');
    }, [state.currentClassId, loadClassDetails]);
    
    useEffect(() => {
        loadClassDetails(state.newClassId, 'new');
    }, [state.newClassId, loadClassDetails]);
    
    
    // Handlers para inputs
    const handleCurrentIdChange = (id: string) => {
        setState(prev => ({ ...prev, currentClassId: id.trim() }));
    };

    const handleNewIdChange = (id: string) => {
        setState(prev => ({ ...prev, newClassId: id.trim() }));
    };

    const handleMotiveChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setState(prev => ({ ...prev, motive: e.target.value }));
    };
    
    // Handler para el envío del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!state.currentClassDetails || !state.newClassDetails || !state.motive) {
            showMessage("Por favor, ingrese códigos de clase válidos y el motivo de la solicitud.");
            return;
        }

        if (state.currentClassId === state.newClassId) {
            showMessage("El código de la clase actual y la clase nueva deben ser diferentes.");
            return;
        }
        
        const requestData = {
            currentClassId: state.currentClassId,
            newClassId: state.newClassId,
            motive: state.motive,
            timestamp: new Date().toISOString(),
        };
        
        console.log("Enviando Solicitud de Cambio:", requestData);
        // Aquí se haría la llamada real al backend
        showMessage("¡Solicitud de cambio enviada con éxito! Revisa la consola para ver el payload.");
    };

    return (
        <div className="request-page-container">
            
            {/* Bar/Header (Simulando la estructura de la app) */}
            <div className="header-bar-wrapper">
                <div className="header-bar">
                    <button className="icon-btn" onClick={handleBack}>
                        <BackIconSVG />
                    </button>
                    <button className="icon-btn" onClick={() => setShowProfileSidebar(true)}>
                        <ProfileIconSVG />
                    </button>
                </div>
            </div>
            <ProfileSidebar open={showProfileSidebar} onClose={() => setShowProfileSidebar(false)} />
            
            {/* Información General */}
            <h1 className="main-title">Solicitud Nueva</h1>
            <p className="date-info">
                Tipo: **Cambio de grupo** <br />
                Fecha: {today}
            </p>

            {/* Formulario Principal */}
            <form onSubmit={handleSubmit}>
                <div className="form-grid-container">
                    
                    {/* COLUMNA 1: Clase Actual (Blanca) */}
                    <ClassDetailsCard
                        title="Clase Actual:"
                        className="card-class card-current"
                        idInput={state.currentClassId}
                        onIdChange={handleCurrentIdChange}
                        classDetails={state.currentClassDetails}
                        isLoading={state.isLoadingCurrent}
                        error={state.error}
                    />
                    
                    {/* COLUMNA 2: Clase Nueva (Roja) */}
                    <ClassDetailsCard
                        title="Clase Nueva (a ingresar):"
                        className="card-class card-new"
                        idInput={state.newClassId}
                        onIdChange={handleNewIdChange}
                        classDetails={state.newClassDetails}
                        isLoading={state.isLoadingNew}
                        error={state.error}
                    />
                    
                    {/* FILA 2: Motivo del Cambio (Ocupa ambas columnas - FIX) */}
                    <div className="grid-span-two" style={{marginTop: '0px'}}>
                        <div className="input-group">
                            <label htmlFor="motive" className="input-label">Motivo de la solicitud:</label>
                            <textarea
                                id="motive"
                                value={state.motive}
                                onChange={handleMotiveChange}
                                placeholder="Describa brevemente la razón por la que solicita el cambio de grupo..."
                                className="input-field motive-textarea"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Botones de acción (Fuera del grid-container, pero centrado con él) */}
                <div className="button-container">
                    <button type="button" className="btn btn-cancel" onClick={() => console.log("Solicitud Cancelada")}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-submit" disabled={state.isLoadingCurrent || state.isLoadingNew}>
                        {state.isLoadingCurrent || state.isLoadingNew ? 'Cargando...' : 'Enviar Solicitud'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RequestChange;