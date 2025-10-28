import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./TeacherStudents.css";

interface Student {
  id: string;
  name: string;
  lastName: string;
  document: string;
  career: string;
  semester: number;
  email?: string;
}

interface Group {
  id: string;
  subjectId: string;
  number: number;
  capacity: number;
  studentIds: string[];
}

const TeacherStudents: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId } = location.state as { groupId: string };
  
  const [students, setStudents] = useState<Student[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupAndStudents = async () => {
      try {
        const token = sessionStorage.getItem("token");
        
        if (!token || !groupId) {
          navigate("/teacherGroups");
          return;
        }

        // Obtener información del grupo
        const groupResponse = await axios.get(
          `http://localhost:8083/api/groups/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const groupData = groupResponse.data.data || groupResponse.data;
        setGroup(groupData);

        // Obtener información de los estudiantes
        if (groupData.studentIds && groupData.studentIds.length > 0) {
          const studentsPromises = groupData.studentIds.map((studentId: string) =>
            axios.get(`http://localhost:8083/api/students/${studentId}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          );

          const studentsResponses = await Promise.all(studentsPromises);
          const studentsData = studentsResponses.map(
            (response) => response.data.data || response.data
          );
          
          setStudents(studentsData);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los estudiantes del grupo");
        setLoading(false);
      }
    };

    fetchGroupAndStudents();
  }, [groupId, navigate]);

  const handleGoBack = () => {
    navigate("/teacherGroups");
  };

  if (loading) {
    return (
      <div className="teacher-students-container">
        <div className="loading">Cargando estudiantes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-students-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleGoBack}>Volver a Mis Grupos</button>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-students-container">
      <header className="teacher-students-header">
        <div className="header-content">
          <h1>Estudiantes del Grupo</h1>
          {group && (
            <div className="group-info-header">
              <span className="group-title">{group.subjectId} - Grupo {group.number}</span>
              <span className="group-code-badge">{group.id}</span>
            </div>
          )}
        </div>
        <button className="back-button" onClick={handleGoBack} title="Volver a Mis Grupos">
          ←
        </button>
      </header>

      <div className="teacher-students-content">
        {group && (
          <div className="summary-card">
            <div className="summary-item">
              <span className="summary-label">Total de estudiantes:</span>
              <span className="summary-value">{students.length} / {group.capacity}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Capacidad disponible:</span>
              <span className="summary-value">{group.capacity - students.length} cupos</span>
            </div>
          </div>
        )}

        {students.length > 0 ? (
          <div className="students-list">
            <div className="students-table">
              <div className="table-header">
                <div className="table-cell">#</div>
                <div className="table-cell">ID</div>
                <div className="table-cell">Nombre Completo</div>
                <div className="table-cell">Carrera</div>
                <div className="table-cell">Semestre</div>
                <div className="table-cell">Correo Electrónico</div>
              </div>
              {students.map((student, index) => (
                <div key={student.id} className="table-row">
                  <div className="table-cell">{index + 1}</div>
                  <div className="table-cell">
                    <span className="student-code">{student.id}</span>
                  </div>
                  <div className="table-cell">
                    <span className="student-name">{`${student.name} ${student.lastName}`}</span>
                  </div>
                  <div className="table-cell">
                    <span className="student-career">{student.career}</span>
                  </div>
                  <div className="table-cell">
                    <span className="student-semester">{student.semester}°</span>
                  </div>
                  <div className="table-cell">
                    <span className="student-email">{student.email || `${student.id}@mail.escuelaing.edu.co`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-students">
            <div className="no-students-icon">👥</div>
            <p>No hay estudiantes inscritos en este grupo</p>
            {group && (
              <p className="no-students-subtitle">
                Capacidad disponible: {group.capacity} cupos
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherStudents;
