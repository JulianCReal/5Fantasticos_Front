import React, { useState, useCallback, useEffect } from "react";
import ProfileSidebar from "../../../Components/SideBarProfile/ProfileSideBar";
import { useNavigate } from "react-router-dom";
import "./RequestLeave.css"
import axios from "axios";

const showMessage = (message: string) => console.log(`[MESSAGE]: ${message}`);

interface ClassDetail {
    id: string;
    name: string;
    professor: string;
    schedule: string[];
}

interface RequestState {
    classId: string;
    motive: string;
    classDetails: ClassDetail | null;
    isLoading: boolean;
    error: string | null;
}

const fetchClassDetails = async (groupId: string): Promise<ClassDetail | null> => {
    if (!groupId) return null;

    try {
        
        // Petición directa al endpoint que devuelve un grupo por ID
        const token = sessionStorage.getItem('token');
        
        // Configurar headers con el token
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        
        const response = await axios.get(
            `http://localhost:8080/api/groups/${groupId}`,
            config
        );
        
        const data = response.data;

        if (!data) {
            console.warn(`Grupo ${groupId} no encontrado`);
            return null;
        }

        // Mapea la respuesta del backend (Group) a ClassDetail
        const mapped: ClassDetail = {
            id: data.id,
            name: data.subjectId ? `Materia ${data.subjectId} - Grupo ${data.number}` : `Grupo ${data.number}`,
            professor: data.teacher?.name ? `${data.teacher.name} ${data.teacher.lastName}` : "Sin profesor asignado",
            schedule: data.sessions?.length
                ? data.sessions.map(
                    (s: any) => `${s.day} / ${s.startTime} - ${s.endTime}${s.classroom ? ` (${s.classroom})` : ""}`
                )
                : ["Sin horario asignado"],
        };

        return mapped;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            console.warn(`Grupo ${groupId} no encontrado`);
        } else {
            console.error("Error al obtener detalles del grupo:", error);
        }
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
}

const ClassDetailsCard: React.FC<ClassDetailsCardProps> = ({
    classDetails,
    className,
    title,
    idInput,
    onIdChange,
    isLoading,
}) => {
    // Determine si está en modo "rojo" para ajustar estilos internos
    const isNewCard = className.includes('card-new');
    const inputStyle = { 
        backgroundColor: isNewCard ? 'rgba(255, 255, 255, 0.1)' : 'white', 
        color: isNewCard ? 'white' : 'black',
        '--placeholder-color': isNewCard ? 'rgba(255, 255, 255, 0.6)' : '#999' 
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
                    placeholder="Ej. 12345"
                    className="input-field"
                    style={inputStyle}
                />
            </div>

            {isLoading && (
                <div className="loading-spinner" style={{
                    borderTopColor: isNewCard ? 'white' : '#8b0000', 
                    borderColor: isNewCard ? 'rgba(255, 255, 255, 0.3)' : 'rgba(139, 0, 0, 0.3)'
                }}></div>
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
            {!isLoading && !classDetails && idInput && (
                <p style={{ color: isNewCard ? 'rgba(255, 255, 255, 0.8)' : '#8b0000' }}>
                    Clase con código **{idInput}** no encontrada.
                </p>
            )}
        </div>
    );
};


// =========================================================
// 5. COMPONENTE PRINCIPAL: RequestLeave
// =========================================================

const RequestLeave: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
        navigate("/requestDashboard");
    };
    
    const [state, setState] = useState<RequestState>({
        classId: "12345", // ID inicial (Clase a retirarse)
        motive: "Tengo un cruce de horarios que no puedo resolver y necesito retirarme del grupo para no perder el semestre.",
        classDetails: null,
        isLoading: false,
        error: null,
    });

    const today = new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit' });
    const [showProfileSidebar, setShowProfileSidebar] = useState(false);


    // Función genérica para manejar la carga de detalles de la clase
    const loadClassDetails = useCallback(async (groupId: string) => {
        if (!groupId) {
            setState(prev => ({ ...prev, classDetails: null }));
            return;
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const details = await fetchClassDetails(groupId);
            setState(prev => ({
                ...prev,
                classDetails: details,
                isLoading: false,
            }));
        } catch (err) {
            console.error("Error fetching class details:", err);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: "Error al cargar la clase.",
            }));
        }
    }, []);

    // Effect para cargar los detalles de la clase al iniciar y al cambiar el ID
    useEffect(() => {
        loadClassDetails(state.classId);
    }, [state.classId, loadClassDetails]);
    
    
    // Handlers para inputs
    const handleIdChange = (id: string) => {
        setState(prev => ({ ...prev, classId: id.trim() }));
    };

    const handleMotiveChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setState(prev => ({ ...prev, motive: e.target.value }));
    };
    
    // Handler para el envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validaciones
        if (!state.classDetails || !state.motive) {
            showMessage("Por favor, ingrese un código de clase válido y el motivo de la solicitud.");
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            const userProfileString = sessionStorage.getItem('userProfile');
            
            if (!userProfileString) {
                showMessage("Error: No se encontró el perfil del usuario. Por favor, inicie sesión nuevamente.");
                return;
            }
            
            const userProfile = JSON.parse(userProfileString);
            const userId = userProfile.id;
            
            console.log("🔍 userProfile:", userProfile);
            console.log("✅ userId:", userId);
            
            if (!userId) {
                showMessage("Error: No se encontró el ID del usuario.");
                return;
            }

            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };

            console.log("🔄 Obteniendo información completa del grupo...");

            // Obtener el grupo completo (solo sourceGroup para LEAVE)
            const sourceGroupResponse = await axios.get(
                `http://localhost:8080/api/groups/${state.classId}`,
                config
            );

            const requestDTO = {
                userId: userId,
                requestType: "LEAVE_GROUP", // ⭐ Tipo de solicitud
                details: {
                    sourceGroup: sourceGroupResponse.data // ⭐ Solo sourceGroup
                },
                observations: state.motive,
                deanOffice: sourceGroupResponse.data.subjectId // Ajusta según tu lógica
            };

            console.log("📤 Enviando requestDTO:", requestDTO);

            const response = await axios.post(
                'http://localhost:8080/api/requests',
                requestDTO,
                config
            );

            console.log("✅ Respuesta del servidor:", response.data);
            showMessage("¡Solicitud de retiro enviada exitosamente!");
            
            setTimeout(() => navigate("/requestDashboard"), 2000);

        } catch (error: any) {
            console.error("❌ Error:", error);
            console.error("❌ Detalles del error:", error.response?.data);
            
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    showMessage(`Error 400: ${error.response?.data?.message || "Datos inválidos"}`);
                } else if (error.response?.status === 403) {
                    showMessage("Error 403: No tiene permisos para realizar esta acción");
                } else if (error.response?.status === 404) {
                    showMessage("Error 404: El grupo no fue encontrado");
                } else {
                    showMessage(error.response?.data?.message || "Error al enviar la solicitud");
                }
            } else {
                showMessage("Error desconocido al enviar la solicitud.");
            }
        }
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
                Tipo: **Retiro de clase** <br />
                Fecha: {today}
            </p>

            {/* Formulario Principal */}
            <form onSubmit={handleSubmit}>
                <div className="form-grid-container">
                    
                    {/* Tarjeta de Clase a Retirar (Ocupa el 100% y usa el estilo rojo) */}
                    <ClassDetailsCard
                        title="Clase a Retirar:"
                        className="card-new"
                        idInput={state.classId}
                        onIdChange={handleIdChange}
                        classDetails={state.classDetails}
                        isLoading={state.isLoading}
                    />
                    
                    {/* Motivo del Retiro (Se coloca debajo de la tarjeta) */}
                    <div className="input-group" style={{marginTop: '-20px'}}>
                        <label htmlFor="motive" className="input-label">Motivo del retiro:</label>
                        <textarea
                            id="motive"
                            value={state.motive}
                            onChange={handleMotiveChange}
                            placeholder="Describa brevemente la razón de su solicitud de retiro..."
                            className="input-field motive-textarea"
                            required
                            // Estilo para que coincida con el fondo de la página, no con la tarjeta
                            style={{ backgroundColor: 'white', color: 'black' }} 
                        />
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="button-container">
                    <button type="button" className="btn btn-cancel" onClick={() => console.log("Solicitud Cancelada")}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-submit">
                        Enviar Solicitud
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RequestLeave;