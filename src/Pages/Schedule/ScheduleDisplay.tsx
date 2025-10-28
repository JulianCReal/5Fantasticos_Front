import React, { JSX, useMemo, useState } from "react";
import "./ScheduleDisplay.css";
import { useNavigate, useLocation } from "react-router-dom";
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

// Definición de las franjas horarias y días (7am a 7pm)
const timeSlots = [
    { label: "7:00 - 8:30 am", start: "07:00", end: "08:30" },
    { label: "8:30 - 10:00 am", start: "08:30", end: "10:00" },
    { label: "10:00 - 11:30 am", start: "10:00", end: "11:30" },
    { label: "11:30 - 1:00 pm", start: "11:30", end: "13:00" },
    { label: "1:00 - 2:30 pm", start: "13:00", end: "14:30" },
    { label: "2:30 - 4:00 pm", start: "14:30", end: "16:00" },
    { label: "4:00 - 5:30 pm", start: "16:00", end: "17:30" },
    { label: "5:30 - 7:00 pm", start: "17:30", end: "19:00" }
];


const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

// La altura base de cada celda de tiempo es fija (ej: 60px). 
// Esto permite calcular la altura de un bloque de clase dinámicamente.
const BASE_CELL_HEIGHT = 90; // 1 hora y media = 90px
const MINUTE_TO_PX = BASE_CELL_HEIGHT / 90; // 1px por minuto

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
    const location = useLocation();
    const scheduleData = location.state?.scheduleData;
    
    // Función para transformar los datos del backend al formato esperado
    const transformBackendData = (backendData: any): ScheduleItem[] => {
    if (!backendData || !backendData.classes || !Array.isArray(backendData.classes)) {
        return initialSchedule;
    }
    
    const convertTime = (time: string) => {
        if (!time) return "00:00";
        let [hour, min] = time.split(":").map(Number);
        if (hour < 7) hour += 12;
        const result = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        console.log("ConvertTime original:", time, "->", result);
        return result;
    };

    return backendData.classes.map((item: any, index: number) => ({
        id: index,
        code: item.subjectCode || 'N/A',
        timeStart: convertTime(item.startTime),
        timeEnd: convertTime(item.endTime),
        day: item.day as 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado'
    }));
};

    
    // Usar los datos del backend si están disponibles, sino usar datos de ejemplo
    const [schedule, setSchedule] = React.useState<ScheduleItem[]>(
        scheduleData ? transformBackendData(scheduleData) : initialSchedule
    );
    
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

    // Estilo simplificado para el contenedor de la tabla
    const tableStyle = {};
    
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
            navigate("/dashboardStudent");
    };
    
    const [showProfileSidebar, setShowProfileSidebar] = useState(false);

    const timeToMinutes = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    };


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
                <div className="schedule-table-container">
                    {/* Fila de cabecera: esquina vacía + días */}
                    <div className="schedule-header-cell"></div>
                    {days.map(day => (
                        <div key={day} className="schedule-header-cell">{day}</div>
                    ))}

                    {/* Filas de horas y celdas por día */}
                    {timeSlots.map((slot, slotIndex) => (
                        <React.Fragment key={slotIndex}>
                            {/* Etiqueta de la franja horaria en la primera columna */}
                            <div className="time-label-cell">{slot.label}</div>
                            {days.map((day, dayIndex) => (
                                <div key={`${slotIndex}-${dayIndex}`} className="schedule-day-cell">
                                    {schedule
                                        .filter(item => {
                                            const itemStart = timeToMinutes(item.timeStart);
                                            const slotStart = timeToMinutes(slot.start);
                                            const slotEnd = timeToMinutes(slot.end);
                                            // Si la clase comienza dentro del rango del slot
                                            return (
                                            day.localeCompare(item.day, "es", { sensitivity: "base" }) === 0 &&
                                            itemStart >= slotStart && itemStart < slotEnd
                                            );
                                        })
                                        .map(item => (
                                            <div
                                                key={item.id}
                                                className="class-block"
                                                style={getClassStyle(item)}
                                            >
                                                <span className="class-code">{item.code}</span>
                                                <span className="class-time">{`${item.timeStart} - ${item.timeEnd}`}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
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