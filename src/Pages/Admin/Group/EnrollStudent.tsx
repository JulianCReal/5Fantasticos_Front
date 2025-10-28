import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EnrollStudent.css";

const EnrollStudent: React.FC = () => {
  const [studentId, setStudentId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `http://localhost:8083/api/enrollments/students/${studentId}/groups/${groupId}`,
        {},
        {
          params: { semester },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Estudiante matriculado exitosamente en el grupo.");
      setTimeout(() => {
        navigate("/admin/group"); // Go back to groups panel after 2 seconds
      }, 2000);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Error al matricular al estudiante."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">
          MATRICULAR ESTUDIANTE EN UN GRUPO
        </div>
        <div className="admin-header-right-tools">
          <button
            className="admin-search-button"
            onClick={() => navigate("/admin/group")}
          >
            Volver
          </button>
        </div>
      </header>

      <div
        className="admin-dashboard-content"
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "100px",
          paddingBottom: "200px",
        }}
      >
        <form onSubmit={handleSubmit} className="admin-register-form">
          <div className="admin-register-title-section">
            <h2 className="admin-register-title">
              Matricular Estudiante en un Grupo
            </h2>
          </div>

          <div>
            <label htmlFor="studentId" className="admin-register-label">
              ID del Estudiante:
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="admin-register-input"
            />
          </div>

          <div>
            <label htmlFor="groupId" className="admin-register-label">
              ID del Grupo:
            </label>
            <input
              type="text"
              id="groupId"
              name="groupId"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              required
              className="admin-register-input"
            />
          </div>

          <div>
            <label htmlFor="semester" className="admin-register-label">
              Semestre Académico:
            </label>
            <input
              type="text"
              id="semester"
              name="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
              placeholder="Ej: 2025-1"
              className="admin-register-input"
            />
          </div>

          {success && <div className="admin-register-success">{success}</div>}

          {error && <div className="admin-register-error">{error}</div>}

          <div className="admin-register-buttons">
            <button
              type="button"
              onClick={() => navigate("/admin/group")}
              className="admin-register-button-volver"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={loading}
              className="admin-register-button-registrar"
            >
              {loading ? "Matriculando..." : "Matricular"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollStudent;
