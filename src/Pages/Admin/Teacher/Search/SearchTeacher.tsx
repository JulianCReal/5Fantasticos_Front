import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SearchTeacher.css";

interface TeacherData {
  id: string;
  name: string;
  lastName: string;
  document: string;
  department: string;
}

const SearchTeacher: React.FC = () => {
  const [id, setId] = useState("");
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim()) {
      setError("Por favor ingresa un ID válido");
      return;
    }

    setLoading(true);
    setError(null);
    setTeacher(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8083/api/teachers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response);
      console.log("Response data:", response.data);

      if (response.data && response.data.data) {
        console.log(
          "Setting teacher from response.data.data:",
          response.data.data
        );
        setTeacher(response.data.data);
      } else {
        console.log("Setting teacher from response.data:", response.data);
        setTeacher(response.data);
      }

      // Verificar que el profesor tenga datos válidos
      const teacherToSet =
        response.data && response.data.data
          ? response.data.data
          : response.data;
      console.log("Teacher object to set:", teacherToSet);

      if (!teacherToSet || !teacherToSet.id) {
        console.warn("Teacher object is empty or invalid:", teacherToSet);
        setError("El profesor encontrado no tiene datos válidos");
        setTeacher(null);
        return;
      }
    } catch (err: any) {
      console.error("Error details:", err);
      setError(err.response?.data?.message || "Profesor no encontrado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">BUSCAR PROFESOR</div>
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
        <form onSubmit={handleSubmit} className="admin-search-form">
          <h2 className="admin-search-title">Buscar Profesor por ID</h2>

          <div>
            <label htmlFor="searchId" className="admin-search-label">
              ID del Profesor:
            </label>
            <input
              type="text"
              id="searchId"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="admin-search-input"
            />
          </div>

          {error && <div className="admin-search-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="admin-search-button"
          >
            {loading ? "Buscando..." : "Buscar Profesor"}
          </button>
        </form>

        {teacher && (
          <div className="admin-teacher-info">
            <h3 className="admin-teacher-info-title">
              Información del Profesor
            </h3>
            <div className="admin-teacher-info-card">
              <div className="admin-teacher-info-item">
                <span className="admin-teacher-info-label">ID:</span>
                <span className="admin-teacher-info-value">{teacher.id}</span>
              </div>
              <div className="admin-teacher-info-item">
                <span className="admin-teacher-info-label">Nombre:</span>
                <span className="admin-teacher-info-value">{teacher.name}</span>
              </div>
              <div className="admin-teacher-info-item">
                <span className="admin-teacher-info-label">Apellido:</span>
                <span className="admin-teacher-info-value">
                  {teacher.lastName}
                </span>
              </div>
              <div className="admin-teacher-info-item">
                <span className="admin-teacher-info-label">Documento:</span>
                <span className="admin-teacher-info-value">
                  {teacher.document}
                </span>
              </div>
              <div className="admin-teacher-info-item">
                <span className="admin-teacher-info-label">Departamento:</span>
                <span className="admin-teacher-info-value">
                  {teacher.department}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTeacher;
