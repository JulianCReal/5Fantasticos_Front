import React, { JSX, useMemo, useState } from "react";
import "./ScheduleDisplay.css";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../../Components/SideBarProfile/ProfileSideBar";

interface ScheduleItem {
    id: number;
    code: string; // Ej: COMP, FUPR
    timeStart: string; // Ej: "08:30" (Formato 24h)
    timeEnd: string; // Ej: "10:00"
    day: 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado';
}

// =========================================================
// 3. DATOS DE EJEMPLO (Basado en la imagen)
// =========================================================

const initialSchedule: ScheduleItem[] = [
    { id: 1, code: "COMP", timeStart: "08:30", timeEnd: "10:00", day: "Lunes" },
    { id: 2, code: "FUPR", timeStart: "08:30", timeEnd: "10:00", day: "Jueves" },
    { id: 3, code: "DOSW", timeStart: "08:30", timeEnd: "10:00", day: "Sabado" },
    { id: 4, code: "AYSR", timeStart: "11:30", timeEnd: "14:30", day: "Miercoles" }, // Nota: 14:30 es 2:30 pm
    // Agregamos una clase adicional para demostrar la flexibilidad
    { id: 5, code: "MATH", timeStart: "16:00", timeEnd: "17:30", day: "Martes" }, // 4:00 pm - 5:30 pm
];

// Definición de las franjas horarias y días
const timeSlots = [
    { label: "7:30 - 8:30 am", start: "07:30", end: "08:30" },
    { label: "8:30 - 10:00 am", start: "08:30", end: "10:00" },
    { label: "10:30 - 11:30 am", start: "10:30", end: "11:30" },
    { label: "11:30 - 1:00 pm", start: "11:30", end: "13:00" },
    { label: "1:00 - 2:30 pm", start: "13:00", end: "14:30" },
    { label: "2:30 - 4:00 pm", start: "14:30", end: "16:00" },
    { label: "4:00 - 5:30 pm", start: "16:00", end: "17:30" },
    { label: "5:30 - 7:00 pm", start: "17:30", end: "19:00" },
];

const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

// La altura base de cada celda de tiempo es fija (ej: 60px). 
// Esto permite calcular la altura de un bloque de clase dinámicamente.
const BASE_CELL_HEIGHT = 60; // Altura en píxeles para una hora (ej. 60 minutos)
const MINUTE_TO_PX = BASE_CELL_HEIGHT / 60; // 1px por minuto (si la franja es de 60 minutos)

// =========================================================
// 4. COMPONENTE DE ICONOS
// Reutilizamos los iconos de la vista anterior
// =========================================================

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
    };
    return iconMap[type] || null;
};

// =========================================================
// 5. COMPONENTE PRINCIPAL: Horario
// =========================================================

interface HorarioProps {
    // En una aplicación real, se recibirían las clases del usuario 
    // y la función para navegar.
    onBack?: () => void; 
}

const Horario: React.FC<HorarioProps> = ({ onBack = () => {} }) => {
    // Estado para las clases, permitiendo que sea modificable
    // En una app real, esto vendría de Firebase/Firestore
    const [schedule, setSchedule] = React.useState<ScheduleItem[]>(initialSchedule);
    
    // Mapeo de minutos del día para calcular posiciones y alturas
    const minuteMap = useMemo(() => {
        let totalMinutes = 0;
        const map = new Map<string, { startMinute: number, height: number }>();
        
        // Convertir horas del día a minutos desde el inicio (7:30 AM)
        const timeToMinutes = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        // El horario empieza a las 7:30
        const startOfDayMinutes = timeToMinutes(timeSlots[0].start);

        // Pre-calculamos la altura de cada franja horaria para el grid
        timeSlots.forEach(slot => {
            const startM = timeToMinutes(slot.start);
            const endM = timeToMinutes(slot.end);
            const durationM = endM - startM;

            // Altura de la fila en píxeles
            const height = durationM * MINUTE_TO_PX / 60; // 60 minutos = BASE_CELL_HEIGHT
            
            map.set(slot.start, { 
                startMinute: startM - startOfDayMinutes, 
                height: height 
            });
            totalMinutes += durationM;
        });

        return map;
    }, []);

    // Calcula la posición y altura de un bloque de clase
    const getClassStyle = (item: ScheduleItem) => {
        const timeToMinutes = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const startOfDayMinutes = timeToMinutes(timeSlots[0].start);
        
        const startM = timeToMinutes(item.timeStart);
        const endM = timeToMinutes(item.timeEnd);
        const durationM = endM - startM;

        // Posición inicial (top) relativa al contenedor de la tabla
        const topPosition = (startM - startOfDayMinutes) * MINUTE_TO_PX / 60;

        // Altura del bloque de clase
        const height = durationM * MINUTE_TO_PX / 60;

        return {
            top: `${topPosition}px`,
            height: `${height}px`,
            lineHeight: height > 60 ? 'normal' : '1.1', // Ajusta line-height si es muy corto
            display: height < 40 ? 'none' : 'flex', // Oculta si es muy corto
            flexDirection: 'column' as const,
            justifyContent: 'center',
            alignItems: 'center',
        };
    };

    // Estilo para el contenedor de la tabla (grid-template-rows)
    const tableStyle = useMemo(() => {
        // La primera fila es la cabecera (fixed height)
        const headerHeight = 65; 
        
        // Las siguientes filas son dinámicas
        const rowHeights = timeSlots.map(slot => {
            const slotData = minuteMap.get(slot.start);
            // Multiplicamos por 1px para tener la unidad css (ej: 60px)
            return `${slotData?.height || BASE_CELL_HEIGHT}px`;
        }).join(" ");

        return {
            gridTemplateRows: `${headerHeight}px ${rowHeights}`,
        };
    }, [minuteMap]);
    
    // Calcula la altura total de la zona de horarios
    const totalScheduleHeight = useMemo(() => {
        let height = 0;
        timeSlots.forEach(slot => {
            height += minuteMap.get(slot.start)?.height || BASE_CELL_HEIGHT;
        });
        return height;
    }, [minuteMap]);

    const navigate = useNavigate();
    const handleBack = () => {
            navigate("/dashboard");
    };
    
    const [showProfileSidebar, setShowProfileSidebar] = useState(false);

    return (
        <div className="schedule-page-container">
            {/* Header de la página de horario */}
            <header className="schedule-page-header">
                <button className="back-button" onClick={handleBack} style={{ cursor: "pointer" }}>
                    <div className="back-icon-svg">
                        <ModuleIconSVG type="Atrás" />
                    </div>
                </button>
                <h1 className="schedule-page-title">Horario</h1>
                <button className="profile-icon-button" onClick={() => setShowProfileSidebar(true)}>
                    <div className="profile-icon-svg">
                        <ModuleIconSVG type="Perfil" />
                    </div>
                </button>
            </header>
            <ProfileSidebar open={showProfileSidebar} onClose={() => setShowProfileSidebar(false)} />

            <div className="schedule-content-wrapper">
                <div className="schedule-table-container" style={tableStyle}>
                    {/* Fila de Cabecera (Días de la semana) */}
                    <div className="schedule-header-cell">{/* Esquina vacía */}</div>
                    {days.map(day => (
                        <div key={day} className="schedule-header-cell">{day}</div>
                    ))}

                    {/* Contenido de la Tabla (Horas y Clases) */}
                    {timeSlots.flatMap((slot, slotIndex) => {
                        // Creamos una franja de fila para cada slot de tiempo
                        const rowCells = [
                            // 1. Etiqueta de la hora (Fila 1, Columna 1)
                            <div 
                                key={`time-${slotIndex}`} 
                                className="time-label-cell" 
                                style={{ height: `${minuteMap.get(slot.start)?.height || BASE_CELL_HEIGHT}px` }}
                            >
                                {slot.label}
                            </div>,
                            
                            // 2. Celdas de los días (Fila 1, Columnas 2 a 7)
                            ...days.map((day, dayIndex) => {
                                // Buscamos clases que caigan en esta celda
                                const classesInSlot = schedule.filter(item => 
                                    item.day === day && 
                                    item.timeStart < slot.end && 
                                    item.timeEnd > slot.start
                                );
                                
                                // Filtrar las clases que empiezan O terminan dentro de esta franja de tiempo
                                const classesForDay = schedule.filter(item => item.day === day);

                                return (
                                    <div 
                                        key={`day-${slotIndex}-${dayIndex}`} 
                                        className="schedule-day-cell"
                                        style={{ height: `${minuteMap.get(slot.start)?.height || BASE_CELL_HEIGHT}px` }}
                                    >
                                        {/* Renderizamos solo las clases que caen en la primera franja de su duración */}
                                        {classesForDay
                                            .filter(item => {
                                                // Una clase debe empezar exactamente en el tiempo inicial de una franja, 
                                                // o al menos en el mismo minuto.
                                                const [itemH, itemM] = item.timeStart.split(':').map(Number);
                                                const [slotH, slotM] = slot.start.split(':').map(Number);

                                                return (itemH === slotH && itemM === slotM);
                                            })
                                            .map(item => (
                                                <div 
                                                    key={item.id}
                                                    className="class-block"
                                                    style={getClassStyle(item)}
                                                    onClick={() => console.log(`Clic en clase: ${item.code}`)}
                                                >
                                                    <span className="class-code">{item.code}</span>
                                                    <span className="class-time">{`${item.timeStart} - ${item.timeEnd}`}</span>
                                                </div>
                                            ))}
                                    </div>
                                );
                            })
                        ];
                        return rowCells;
                    })}
                </div>
            </div>
            
            {/* Footer de planificación */}
            <div className="planning-footer">
                <div className="planning-content">
                    <div className="planning-text">
                        <small>¿Estás listo?</small>
                        <h3>Planifica y arma tu horario para este nuevo semestre</h3>
                    </div>
                    <button className="go-button">Ir</button>
                </div>
            </div>
        </div>
    );
}

export default Horario;