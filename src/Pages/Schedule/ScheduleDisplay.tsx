import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ScheduleDisplay.css";

interface Session {
  day: string;
  startTime: string;
  endTime: string;
  classroom: string;
}

interface GroupWithSessions {
  id: string;
  subjectId: string;
  teacherName: string;
  sessions: Session[];
}

interface StudentGroupSession extends Session {
  groupId: string;
  groupName: string;
}

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const Horario: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<StudentGroupSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const userProfile = JSON.parse(sessionStorage.getItem("userProfile") || "{}");
        const studentId = userProfile.studentId;

       if (!token || !studentId) {
          navigate("/");
          return;
        }

        const response = await axios.get(
          `http://localhost:8083/api/students/${studentId}/groups`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Response completa:", response);
        console.log("Response.data:", response.data);
        console.log("Response.data.data:", response.data.data);

        const groupsData: GroupWithSessions[] =
          Array.isArray(response.data.data) ? response.data.data : [];
        
        console.log("groupsData:", groupsData);

        const allSessions: StudentGroupSession[] = [];

        groupsData.forEach(group => {
          console.log("Procesando grupo:", group);
          if (Array.isArray(group.sessions)) {
            console.log("Sesiones del grupo:", group.sessions);
            group.sessions.forEach(session => {
              allSessions.push({
                ...session,
                groupId: group.id,
                groupName: group.subjectId || group.id
              });
            });
          } else {
            console.log("No hay sesiones o no es array:", group.sessions);
          }
        });

        console.log("allSessions final:", allSessions);
        setSessions(allSessions);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los horarios del estudiante");
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [navigate]);

  const handleGoBack = () => navigate("/dashboardStudent");

  const sessionsByDay: { [key: string]: StudentGroupSession[] } = {};
  days.forEach(day => {
    sessionsByDay[day] = sessions.filter(s => s.day === day);
  });

  if (loading) {
    return (
      <div className="student-schedules-container">
        <div className="loading">Cargando horarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-schedules-container">
        <div className="student-schedules-header">
          <h1>Mis Horarios</h1>
          <button className="back-button" onClick={handleGoBack}>
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
    <div className="student-schedules-container">
      <div className="student-schedules-header">
        <h1>Mis Horarios</h1>
        <button className="back-button" onClick={handleGoBack}>
          ←
        </button>
      </div>

      <div className="student-schedules-content">
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
                          <span className="session-group">
                            {session.groupName}
                          </span>
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
                  <div className="no-sessions">Sin clases este día</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Horario;