import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeacherSchedules.css";

// Interfaces
interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  groupId: string;
  groupName: string;
  room?: string;
  location?: string;
}

interface GroupSchedule {
  groupId: string;
  groupCode: string;
  groupName: string;
  course: string;
  timeSlots: TimeSlot[];
}

// Franjas horarias del día (7am a 7pm)
const timeSlots = [
  { label: "7:00 - 8:00", start: "07:00", end: "08:00" },
  { label: "8:00 - 9:00", start: "08:00", end: "09:00" },
  { label: "9:00 - 10:00", start: "09:00", end: "10:00" },
  { label: "10:00 - 11:00", start: "10:00", end: "11:00" },
  { label: "11:00 - 12:00", start: "11:00", end: "12:00" },
  { label: "12:00 - 1:00 PM", start: "12:00", end: "13:00" },
  { label: "1:00 - 2:00 PM", start: "13:00", end: "14:00" },
  { label: "2:00 - 3:00 PM", start: "14:00", end: "15:00" },
  { label: "3:00 - 4:00 PM", start: "15:00", end: "16:00" },
  { label: "4:00 - 5:00 PM", start: "16:00", end: "17:00" },
  { label: "5:00 - 6:00 PM", start: "17:00", end: "18:00" },
  { label: "6:00 - 7:00 PM", start: "18:00", end: "19:00" },
];

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const BASE_CELL_HEIGHT = 60; // Altura en píxeles para una hora
const MINUTE_TO_PX = BASE_CELL_HEIGHT / 60; // Conversión: minuto a píxeles

// Función para convertir hora a minutos
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + (minutes || 0);
};

// Función para normalizar día al formato esperado
const normalizeDayName = (day: string): string => {
  const dayLower = day.toLowerCase().trim();
  if (dayLower.includes("mon")) return "Lunes";
  if (dayLower.includes("tue")) return "Martes";
  if (dayLower.includes("wed") || dayLower.includes("miér")) return "Miércoles";
  if (dayLower.includes("thu")) return "Jueves";
  if (dayLower.includes("fri")) return "Viernes";
  if (dayLower.includes("sat") || dayLower.includes("sáb")) return "Sábado";
  if (dayLower === "lunes") return "Lunes";
  if (dayLower === "martes") return "Martes";
  if (dayLower === "miércoles" || dayLower === "miercoles") return "Miércoles";
  if (dayLower === "jueves") return "Jueves";
  if (dayLower === "viernes") return "Viernes";
  if (dayLower === "sábado" || dayLower === "sabado") return "Sábado";
  return day;
};

const TeacherSchedules: React.FC = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<GroupSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allTimeSlots, setAllTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userProfile = sessionStorage.getItem("userProfile");

    if (!token || !userProfile) {
      setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    fetchSchedules(token);
  }, []);

  const fetchSchedules = async (token: string) => {
    try {
      const userProfile = JSON.parse(sessionStorage.getItem("userProfile") || "{}");
      const teacherId = userProfile.id;

      if (!teacherId) {
        setError("No se pudo obtener la información del profesor.");
        setLoading(false);
        return;
      }

      console.log("Obteniendo horarios del profesor:", teacherId);

      // Obtener los grupos del profesor
      const groupsResponse = await axios.get(
        `http://localhost:8083/api/teachers/${teacherId}/groups`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const groupsData = Array.isArray(groupsResponse.data)
        ? groupsResponse.data
        : groupsResponse.data?.data || [];

      console.log("Grupos obtenidos:", groupsData);

      // Obtener los horarios de cada grupo
      const schedulesData: GroupSchedule[] = [];
      const allSlots: TimeSlot[] = [];

      for (const group of groupsData) {
        try {
          const scheduleResponse = await axios.get(
            `http://localhost:8083/api/groups/${group.id}/schedule`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log(`Horario del grupo ${group.id}:`, scheduleResponse.data);

          // Procesar respuesta
          let timeSlotsList: TimeSlot[] = [];

          if (Array.isArray(scheduleResponse.data)) {
            timeSlotsList = scheduleResponse.data;
          } else if (scheduleResponse.data?.data && Array.isArray(scheduleResponse.data.data)) {
            timeSlotsList = scheduleResponse.data.data;
          } else if (scheduleResponse.data?.timeSlots && Array.isArray(scheduleResponse.data.timeSlots)) {
            timeSlotsList = scheduleResponse.data.timeSlots;
          }

          // Solo agregar si hay horarios
          if (timeSlotsList.length > 0) {
            // Normalizar nombres de días
            const normalizedSlots = timeSlotsList.map(slot => ({
              ...slot,
              day: normalizeDayName(slot.day || "")
            }));

            schedulesData.push({
              groupId: group.id,
              groupCode: group.groupCode || "",
              groupName: group.name || "",
              course: group.course || "",
              timeSlots: normalizedSlots,
            });

            allSlots.push(...normalizedSlots);
          }
        } catch (error) {
          console.warn(`Error obteniendo horario del grupo ${group.id}:`, error);
        }
      }

      if (schedulesData.length === 0) {
        setError("No hay horarios disponibles para tus grupos.");
      } else {
        setSchedules(schedulesData);
        setAllTimeSlots(allSlots);
        setError(null);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error obteniendo horarios:", error);
      setError("Error al cargar los horarios. Por favor, intenta más tarde.");
      setLoading(false);
    }
  };

  // Calcular altura y posición de un bloque de clase
  const getClassStyle = (slot: TimeSlot) => {
    const startM = timeToMinutes(slot.startTime);
    const endM = timeToMinutes(slot.endTime);
    const durationM = endM - startM;

    const startOfDayMinutes = timeToMinutes(timeSlots[0].start);
    const topPosition = (startM - startOfDayMinutes) * MINUTE_TO_PX / 60;
    const height = durationM * MINUTE_TO_PX / 60;

    return {
      top: `${topPosition}px`,
      height: `${height}px`,
      display: height < 40 ? "none" : "flex",
    };
  };

  // Calcular altura total del grid
  const totalScheduleHeight = useMemo(() => {
    let height = 0;
    timeSlots.forEach(() => {
      height += BASE_CELL_HEIGHT;
    });
    return height;
  }, []);

  const handleRetry = () => {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    if (token) {
      fetchSchedules(token);
    }
  };

  const handleBack = () => {
    navigate("/dashboardTeacher");
  };

  if (loading) {
    return (
      <div className="teacher-schedules-container">
        <div className="loading">
          <p>Cargando horarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-schedules-container">
        <div className="teacher-schedules-header">
          <h1>Horarios</h1>
          <button className="back-button" onClick={handleBack} title="Volver al Dashboard">
            ←
          </button>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleRetry}>Intentar de nuevo</button>
          <button onClick={handleBack} className="back-btn">Volver</button>
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="teacher-schedules-container">
        <div className="teacher-schedules-header">
          <h1>Horarios</h1>
          <button className="back-button" onClick={handleBack} title="Volver al Dashboard">
            ←
          </button>
        </div>
        <div className="no-data">
          <p>No hay horarios disponibles en este momento.</p>
          <button onClick={handleBack}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-schedules-container">
      <div className="teacher-schedules-header">
        <h1>Mis Horarios</h1>
        <button className="back-button" onClick={handleBack} title="Volver al Dashboard">
          ←
        </button>
      </div>

      <div className="teacher-schedules-content">
        {/* Grid de horarios */}
        <div className="schedule-grid-wrapper">
          {/* Header con días */}
          <div className="schedule-header">
            <div className="schedule-time-label">Hora</div>
            {days.map(day => (
              <div key={day} className="schedule-day-header">
                {day}
              </div>
            ))}
          </div>

          {/* Grid de horarios */}
          <div className="schedule-grid" style={{ height: `${totalScheduleHeight}px` }}>
            {/* Franjas horarias (filas) */}
            {timeSlots.map(slot => (
              <div
                key={slot.start}
                className="schedule-time-row"
                style={{ height: `${BASE_CELL_HEIGHT}px` }}
              >
                <div className="schedule-time-cell">{slot.label}</div>
                {days.map(day => (
                  <div key={`${day}-${slot.start}`} className="schedule-day-cell">
                    {/* Classes dentro de esta franja */}
                    {allTimeSlots
                      .filter(t => t.day === day && timeToMinutes(t.startTime) >= timeToMinutes(slot.start) && timeToMinutes(t.startTime) < timeToMinutes(slot.end))
                      .map(timeSlot => (
                        <div
                          key={timeSlot.id}
                          className="class-block"
                          style={{
                            ...getClassStyle(timeSlot),
                            position: "absolute",
                          }}
                          title={`${timeSlot.groupName} - ${timeSlot.room || "Sin aula"}`}
                        >
                          <div className="class-code">{timeSlot.groupName}</div>
                          <div className="class-time">
                            {timeSlot.startTime} - {timeSlot.endTime}
                          </div>
                          <div className="class-room">{timeSlot.room || "Sin aula"}</div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Info de grupos */}
        <div className="schedule-groups-info">
          <h2>Información de Grupos</h2>
          <div className="groups-list">
            {schedules.map(group => (
              <div key={group.groupId} className="group-info-card">
                <div className="group-info-header">
                  <h3>{group.groupName}</h3>
                  <span className="group-code-label">{group.groupCode}</span>
                </div>
                <p className="group-course">{group.course}</p>
                <p className="group-sessions">
                  {group.timeSlots.length} sesión{group.timeSlots.length !== 1 ? "es" : ""} por semana
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSchedules;
