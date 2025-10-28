import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../DashboardAdmin/Dashboardadmin.css";
import "./SearchSubject.css";

interface SubjectData {
  name: string;
  credits: number;
  semester: number;
  code: string;
  deparment: string;
}

const SearchSubject: React.FC = () => {
  const [code, setCode] = useState("");
  const [subject, setSubject] = useState<SubjectData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Por favor ingresa un código válido");
      return;
    }

    setLoading(true);
    setError(null);
    setSubject(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8083/api/subjects/${code}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("SearchSubject API Response:", response);
      console.log("SearchSubject Response data:", response.data);

      let subjectData;
      if (response.data && response.data.data) {
        subjectData = response.data.data;
      } else {
        subjectData = response.data;
      }

      if (!subjectData || !subjectData.code) {
        setError("La materia encontrada no tiene datos válidos");
        setSubject(null);
        return;
      }

      // Adaptar los datos recibidos al nuevo modelo
      const adaptedSubject = {
        name: subjectData.name || "",
        credits: subjectData.credits || 0,
        semester: subjectData.semester || 0,
        code: subjectData.code || "",
        deparment: subjectData.deparment || subjectData.department || "",
      };
      setSubject(adaptedSubject);
    } catch (err: any) {
      console.error("Error details:", err);
      setError(err.response?.data?.message || "Materia no encontrada");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">BUSCAR MATERIA</div>
        <div className="admin-header-right-tools">
          <button
            className="admin-search-button"
            onClick={() => navigate("/admin/subject")}
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
          <h2 className="admin-search-title">Buscar Materia por Código</h2>

          <div>
            <label htmlFor="searchCode" className="admin-search-label">
              Código de la Materia:
            </label>
            <input
              type="text"
              id="searchCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="admin-search-input"
              placeholder="Ej: MAT101, FIS201, etc."
            />
          </div>

          {error && <div className="admin-search-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="admin-search-button"
          >
            {loading ? "Buscando..." : "Buscar Materia"}
          </button>
        </form>

        {subject && (
          <div className="admin-subject-info">
            <h3 className="admin-subject-info-title">
              Información de la Materia
            </h3>
            <div className="admin-subject-info-card">
              <div className="admin-subject-info-item">
                <span className="admin-subject-info-label">Código:</span>
                <span className="admin-subject-info-value">{subject.code}</span>
              </div>
              <div className="admin-subject-info-item">
                <span className="admin-subject-info-label">Nombre:</span>
                <span className="admin-subject-info-value">{subject.name}</span>
              </div>
              <div className="admin-subject-info-item">
                <span className="admin-subject-info-label">Créditos:</span>
                <span className="admin-subject-info-value">
                  {subject.credits}
                </span>
              </div>
              <div className="admin-subject-info-item">
                <span className="admin-subject-info-label">Semestre:</span>
                <span className="admin-subject-info-value">
                  {subject.semester}
                </span>
              </div>
              <div className="admin-subject-info-item">
                <span className="admin-subject-info-label">Departamento:</span>
                <span className="admin-subject-info-value">
                  {subject.deparment}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSubject;
