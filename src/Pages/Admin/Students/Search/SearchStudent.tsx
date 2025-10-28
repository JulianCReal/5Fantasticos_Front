import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SearchStudent.css";

interface StudentData {
  id: string;
  name: string;
  lastName: string;
  document: string;
  career: string;
  semester: number;
}

const SearchStudent: React.FC = () => {
  const [id, setId] = useState("");
  const [student, setStudent] = useState<StudentData | null>(null);
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
    setStudent(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8083/api/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudent(response.data.data);
    } catch (err: any) {
      console.error("Error buscando estudiante:", err);
      setError(err.response?.data?.message || "Estudiante no encontrado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">BUSCAR ESTUDIANTE</div>
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
        <form onSubmit={handleSubmit} className="admin-search-form">
          <h2 className="admin-search-title">Buscar Estudiante por ID</h2>

          <div>
            <label htmlFor="searchId" className="admin-search-label">
              ID del Estudiante:
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
            {loading ? "Buscando..." : "Buscar Estudiante"}
          </button>
        </form>

        {student && (
          <div className="admin-student-info">
            <h3 className="admin-student-info-title">
              Información del Estudiante
            </h3>
            <div className="admin-student-info-grid">
              <div>
                <strong>ID:</strong> {student.id}
              </div>
              <div>
                <strong>Nombre:</strong> {student.name}
              </div>
              <div>
                <strong>Apellido:</strong> {student.lastName}
              </div>
              <div>
                <strong>Documento:</strong> {student.document}
              </div>
              <div>
                <strong>Carrera:</strong> {student.career}
              </div>
              <div>
                <strong>Semestre:</strong> {student.semester}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchStudent;
