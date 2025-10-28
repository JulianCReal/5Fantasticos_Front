import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeacherSchedules.css";

interface Session {
  day: string;
  startTime: string;
  endTime: string;
  classroom: string;
}

interface GroupSession extends Session {
  groupName: string;
  groupId: string;
}

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const TeacherSchedules: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<GroupSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const userProfile = JSON.parse(sessionStorage.getItem("userProfile") || "{}");
        const teacherId = userProfile.id;

        if (!token || !teacherId) {
          navigate("/");
          return;
        }

        console.log("Obteniendo grupos del profesor:", teacherId);

        // Obtener los grupos del profesor
        const groupsResponse = await axios.get(
          `http://localhost:8083/api/teachers/${teacherId}/groups`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Grupos response:", groupsResponse.data);

        const groupsData = Array.isArray(groupsResponse.data)
          ? groupsResponse.data
          : groupsResponse.data?.data || [];

        console.log("Grupos extraidos:", groupsData);

        // Obtener horarios de todos los grupos
        const allSessions: GroupSession[] = [];

        for (const group of groupsData) {
          try {
            console.log(`Pidiendo horario para grupo: ${group.id}`);

            const scheduleResponse = await axios.get(
              `http://localhost:8083/api/groups/${group.id}/schedule`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log(`Horario de ${group.id}:`, scheduleResponse.data);

            // Obtener las sesiones (puede ser array directo)
            const sessionsData = Array.isArray(scheduleResponse.data)
              ? scheduleResponse.data
              : scheduleResponse.data?.data || [];

            console.log(`Sesiones extraidas (${sessionsData.length}):`, sessionsData);

            // Agregar el nombre del grupo a cada sesión
            const groupSessions = sessionsData.map((session: Session) => ({
              ...session,
              groupName: group.subjectId || group.name || "Grupo",
              groupId: group.id,
            }));

            allSessions.push(...groupSessions);
            console.log(`Total sesiones acumuladas: ${allSessions.length}`);
          } catch (err) {
            console.error(`Error obteniendo horario de ${group.id}:`, err);
          }
        }

        console.log("Todas las sesiones finales:", allSessions);
        setSessions(allSessions);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Error al cargar los horarios");
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [navigate]);

  const handleGoBack = () => {
    navigate("/dashboardTeacher");
  };

  // Agrupar sesiones por día
  const sessionsByDay: { [key: string]: GroupSession[] } = {};
  days.forEach(day => {
    sessionsByDay[day] = sessions.filter(s => s.day === day);
  });

  if (loading) {
    return (
      <div className="teacher-schedules-container">
        <div className="loading">Cargando horarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-schedules-container">
        <div className="teacher-schedules-header">
          <h1>Horarios</h1>
          <button className="back-button" onClick={handleGoBack} title="Volver al Dashboard">
            ←
          </button>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleGoBack}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-schedules-container">
      <div className="teacher-schedules-header">
        <h1>Mis Horarios</h1>
        <button className="back-button" onClick={handleGoBack} title="Volver al Dashboard">
          ←
        </button>
      </div>

      <div className="teacher-schedules-content">
        {sessions.length === 0 ? (
          <div className="no-data">
            <p>No hay horarios disponibles</p>
            <button onClick={handleGoBack}>Volver</button>
          </div>
        ) : (
          <div className="schedule-by-day">
            {days.map(day => (
              <div key={day} className="day-section">
                <h2 className="day-title">{day}</h2>
                {sessionsByDay[day].length > 0 ? (
                  <div className="sessions-list">
                    {sessionsByDay[day].map((session, index) => (
                      <div key={`${day}-${index}`} className="session-card">
                        <div className="session-header">
                          <span className="session-time">
                            {session.startTime} - {session.endTime}
                          </span>
                          <span className="session-group">{session.groupName}</span>
                        </div>
                        <div className="session-info">
                          <div className="info-row">
                            <span className="label">Salón:</span>
                            <span className="value">{session.classroom}</span>
                          </div>
                          <div className="info-row">
                            <span className="label">Grupo ID:</span>
                            <span className="value">{session.groupId}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-sessions">
                    <p>Sin clases este día</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherSchedules;
