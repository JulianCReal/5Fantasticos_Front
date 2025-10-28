import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ListStudent.css";

interface StudentData {
  id: string;
  name: string;
  lastName: string;
  document: string;
  career: string;
  semester: number;
}

const ListStudent: React.FC = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("http://localhost:8083/api/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let studentData;
      if (response.data && response.data.data) {
        studentData = response.data.data;
      } else {
        studentData = response.data;
      }

      // Ensure studentData is an array
      if (Array.isArray(studentData)) {
        setStudents(studentData);
      } else {
        setStudents([]);
        setError("La respuesta de la API no es un array válido");
      }
    } catch (err: any) {
      console.error("Error obteniendo estudiantes:", err);
      setError(
        err.response?.data?.message ||
          "Error al obtener la lista de estudiantes"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">LISTAR ESTUDIANTES</div>
        <div className="admin-header-right-tools">
          <button
            className="admin-search-button"
            onClick={() => navigate("/admin/students")}
          >
            Volver
          </button>
        </div>
      </header>

      <div
        className="admin-dashboard-content"
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        <div className="admin-list-container">
          <h2 className="admin-list-title">Lista de Todos los Estudiantes</h2>

          {loading && (
            <div className="admin-list-loading">Cargando estudiantes...</div>
          )}

          {error && <div className="admin-list-error">{error}</div>}

          {!loading && !error && students.length === 0 && (
            <div className="admin-list-empty">
              No hay estudiantes registrados
            </div>
          )}

          {!loading && !error && students.length > 0 && (
            <div className="admin-students-list">
              {students.map((student) => (
                <div key={student.id} className="admin-student-card">
                  <div className="admin-student-info">
                    <div className="admin-student-info-item">
                      <span className="admin-student-info-label">ID:</span>
                      <span className="admin-student-info-value">
                        {student.id}
                      </span>
                    </div>
                    <div className="admin-student-info-item">
                      <span className="admin-student-info-label">Nombre:</span>
                      <span className="admin-student-info-value">
                        {student.name} {student.lastName}
                      </span>
                    </div>
                    <div className="admin-student-info-item">
                      <span className="admin-student-info-label">
                        Documento:
                      </span>
                      <span className="admin-student-info-value">
                        {student.document}
                      </span>
                    </div>
                    <div className="admin-student-info-item">
                      <span className="admin-student-info-label">Carrera:</span>
                      <span className="admin-student-info-value">
                        {student.career}
                      </span>
                    </div>
                    <div className="admin-student-info-item">
                      <span className="admin-student-info-label">
                        Semestre:
                      </span>
                      <span className="admin-student-info-value">
                        {student.semester}
                      </span>
                    </div>
                  </div>
                  <div className="admin-student-actions">
                    <button
                      onClick={() =>
                        navigate(`/admin/students/update?id=${student.id}`)
                      }
                      className="admin-student-edit-button"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/students/delete?id=${student.id}`)
                      }
                      className="admin-student-delete-button"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="admin-list-actions">
            <button
              onClick={fetchStudents}
              disabled={loading}
              className="admin-list-refresh-button"
            >
              {loading ? "Actualizando..." : "Actualizar Lista"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListStudent;
