import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../DashboardAdmin/Dashboardadmin.css";
import "./SearchGroup.css";

interface Session {
  day: string;
  startTime: string;
  endTime: string;
  classroom: string;
}

interface GroupData {
  id: string;
  subjectId: string;
  number: number;
  capacity: number;
  active: boolean;
  teacherId: string;
  teacherName: string;
  studentIds: string[];
  sessions: Session[];
}

const SearchGroup: React.FC = () => {
  const [id, setId] = useState("");
  const [group, setGroup] = useState<GroupData | null>(null);
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
    setGroup(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8083/api/groups/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("SearchGroup API Response:", response);
      console.log("SearchGroup Response data:", response.data);

      let groupData;
      if (response.data && response.data.data) {
        groupData = response.data.data;
      } else {
        groupData = response.data;
      }

      if (!groupData || !groupData.id) {
        setError("El grupo encontrado no tiene datos válidos");
        setGroup(null);
        return;
      }

      // Adaptar los datos recibidos al modelo
      const toArray = (val: any) => {
        if (Array.isArray(val)) return val;
        if (val && typeof val === "object") return Object.values(val);
        return [];
      };
      const adaptedGroup = {
        ...groupData,
        sessions: toArray(groupData.sessions),
        studentIds: toArray(groupData.studentIds),
      };
      setGroup(adaptedGroup);
    } catch (err: any) {
      console.error("Error details:", err);
      setError(err.response?.data?.message || "Grupo no encontrado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">BUSCAR GRUPO</div>
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
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        <form onSubmit={handleSubmit} className="admin-search-form">
          <h2 className="admin-search-title">Buscar Grupo por ID</h2>

          <div>
            <label htmlFor="searchId" className="admin-search-label">
              ID del Grupo:
            </label>
            <input
              type="text"
              id="searchId"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="admin-search-input"
              placeholder="Ej: G001, G002, etc."
            />
          </div>

          {error && <div className="admin-search-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="admin-search-button"
          >
            {loading ? "Buscando..." : "Buscar Grupo"}
          </button>
        </form>

        {group && (
          <div className="admin-group-info">
            <h3 className="admin-group-info-title">Información del Grupo</h3>
            <div className="admin-group-info-card">
              <div className="admin-group-info-item">
                <span className="admin-group-info-label">ID:</span>
                <span className="admin-group-info-value">{group.id}</span>
              </div>
              <div className="admin-group-info-item">
                <span className="admin-group-info-label">
                  Código de Materia:
                </span>
                <span className="admin-group-info-value">
                  {group.subjectId}
                </span>
              </div>
              <div className="admin-group-info-item">
                <span className="admin-group-info-label">
                  Número del Grupo:
                </span>
                <span className="admin-group-info-value">{group.number}</span>
              </div>
              <div className="admin-group-info-item">
                <span className="admin-group-info-label">Capacidad:</span>
                <span className="admin-group-info-value">{group.capacity}</span>
              </div>
              <div className="admin-group-info-item">
                <span className="admin-group-info-label">Profesor:</span>
                <span className="admin-group-info-value">
                  {group.teacherName} ({group.teacherId})
                </span>
              </div>
              <div className="admin-group-info-item">
                <span className="admin-group-info-label">
                  Estudiantes Inscritos:
                </span>
                <span className="admin-group-info-value">
                  {group.studentIds.length}
                </span>
              </div>
              <div className="admin-group-info-item">
                <span className="admin-group-info-label">Sesiones:</span>
                <span className="admin-group-info-value">
                  {group.sessions.length}
                </span>
              </div>
              <div className="admin-group-info-item">
                <span className="admin-group-info-label">Estado:</span>
                <span className="admin-group-info-value">
                  {group.active ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchGroup;
