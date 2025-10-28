import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ListTeacher.css";

interface TeacherData {
  id: string;
  name: string;
  lastName: string;
  document: string;
  department: string;
}

const ListTeacher: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("http://localhost:8083/api/teachers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let teacherData;
      if (response.data && response.data.data) {
        teacherData = response.data.data;
      } else {
        teacherData = response.data;
      }

      // Ensure teacherData is an array
      if (Array.isArray(teacherData)) {
        setTeachers(teacherData);
      } else {
        setTeachers([]);
        setError("La respuesta de la API no es un array válido");
      }
    } catch (err: any) {
      console.error("Error obteniendo profesores:", err);
      setError(
        err.response?.data?.message || "Error al obtener la lista de profesores"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">LISTAR PROFESORES</div>
        <div className="admin-header-right-tools">
          <button
            className="admin-search-button"
            onClick={() => navigate("/admin/teacher")}
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
          <h2 className="admin-list-title">Lista de Todos los Profesores</h2>

          {loading && (
            <div className="admin-list-loading">Cargando profesores...</div>
          )}

          {error && <div className="admin-list-error">{error}</div>}

          {!loading && !error && teachers.length === 0 && (
            <div className="admin-list-empty">
              No hay profesores registrados
            </div>
          )}

          {!loading && !error && teachers.length > 0 && (
            <div className="admin-teachers-list">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="admin-teacher-card">
                  <div className="admin-teacher-info">
                    <div className="admin-teacher-info-item">
                      <span className="admin-teacher-info-label">ID:</span>
                      <span className="admin-teacher-info-value">
                        {teacher.id}
                      </span>
                    </div>
                    <div className="admin-teacher-info-item">
                      <span className="admin-teacher-info-label">Nombre:</span>
                      <span className="admin-teacher-info-value">
                        {teacher.name}
                      </span>
                    </div>
                    <div className="admin-teacher-info-item">
                      <span className="admin-teacher-info-label">
                        Apellido:
                      </span>
                      <span className="admin-teacher-info-value">
                        {teacher.lastName}
                      </span>
                    </div>
                    <div className="admin-teacher-info-item">
                      <span className="admin-teacher-info-label">
                        Documento:
                      </span>
                      <span className="admin-teacher-info-value">
                        {teacher.document}
                      </span>
                    </div>
                    <div className="admin-teacher-info-item">
                      <span className="admin-teacher-info-label">
                        Departamento:
                      </span>
                      <span className="admin-teacher-info-value">
                        {teacher.department}
                      </span>
                    </div>
                  </div>
                  <div className="admin-teacher-actions">
                    <button
                      onClick={() =>
                        navigate(`/admin/teacher/update?id=${teacher.id}`)
                      }
                      className="admin-teacher-edit-button"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/teacher/delete?id=${teacher.id}`)
                      }
                      className="admin-teacher-delete-button"
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
              onClick={fetchTeachers}
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

export default ListTeacher;
