import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./TeacherGroups.css";

interface Group {
  id: string;
  groupCode: string;
  name: string;
  course: string;
  semester: string;
  year: number;
  schedule?: string;
  studentsCount?: number;
}

const TeacherGroups: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const userProfile = JSON.parse(sessionStorage.getItem("userProfile") || "{}");
        const teacherId = userProfile.id;

        if (!token || !teacherId) {
          navigate("/");
          return;
        }

        const response = await axios.get(`http://localhost:8083/api/teachers/${teacherId}/groups`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Maneja ambas estructuras de respuesta posibles
        const groupsData = Array.isArray(response.data) 
          ? response.data 
          : response.data.data || [];
        
        setGroups(groupsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching groups:", err);
        setError("Error al cargar los grupos");
        setLoading(false);
      }
    };

    fetchGroups();
  }, [navigate]);

  const handleGoBack = () => {
    navigate("/dashboardTeacher");
  };

  const handleViewStudents = (groupId: string) => {
    navigate("/teacherStudents", { state: { groupId } });
  };

  const handleViewSchedule = (groupId: string) => {
    navigate("/teacherSchedules", { state: { groupId } });
  };

  if (loading) {
    return (
      <div className="teacher-groups-container">
        <div className="loading">Cargando grupos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-groups-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleGoBack}>Volver al Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-groups-container">
      <header className="teacher-groups-header">
        <h1>Mis Grupos</h1>
        <button className="back-button" onClick={handleGoBack} title="Volver al Dashboard">
          ←
        </button>
      </header>

      <div className="teacher-groups-content">
        {groups && groups.length > 0 ? (
          <div className="groups-grid">
            {groups.map((group) => (
              <div key={group.id} className="group-card">
                <div className="group-header">
                  <h3>{group.name}</h3>
                  <span className="group-code">{group.groupCode}</span>
                </div>

                <div className="group-info">
                  <div className="info-row">
                    <span className="label">Curso:</span>
                    <span className="value">{group.course}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Semestre:</span>
                    <span className="value">{group.semester}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Año:</span>
                    <span className="value">{group.year}</span>
                  </div>
                  {group.studentsCount && (
                    <div className="info-row">
                      <span className="label">Estudiantes:</span>
                      <span className="value">{group.studentsCount}</span>
                    </div>
                  )}
                  {group.schedule && (
                    <div className="info-row">
                      <span className="label">Horario:</span>
                      <span className="value">{group.schedule}</span>
                    </div>
                  )}
                </div>

                <div className="group-actions">
                  <button 
                    className="action-button students-button"
                    onClick={() => handleViewStudents(group.id)}
                  >
                    Ver Estudiantes
                  </button>
                  <button 
                    className="action-button schedule-button"
                    onClick={() => handleViewSchedule(group.id)}
                  >
                    Ver Horario
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <p>No tienes grupos asignados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherGroups;
