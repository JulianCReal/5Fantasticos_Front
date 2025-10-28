import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../DashboardAdmin/Dashboardadmin.css";
import "./ListGroups.css";

interface Session {
  day: string;
  startTime: string;
  endTime: string;
  classroom: string;
}

interface Group {
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

const ListGroups: React.FC = () => {
  const [subjectCode, setSubjectCode] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectCode.trim()) {
      setError("Por favor ingresa un código de materia válido");
      return;
    }

    setLoading(true);
    setError(null);
    setGroups([]);
    setSearched(false);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8083/api/subjects/${subjectCode}/groups`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let groupsData;
      if (response.data && response.data.data) {
        groupsData = response.data.data;
      } else {
        groupsData = response.data;
      }

      // Robust: aceptar arrays, objetos o nombres alternativos
      const toArray = (val: any) => {
        if (Array.isArray(val)) return val;
        if (val && typeof val === "object") return Object.values(val);
        return [];
      };
      if (Array.isArray(groupsData)) {
        const safeGroups = groupsData.map((g: any) => {
          let sessions = toArray(g.sessions);
          if (sessions.length === 0) {
            sessions = toArray(g.sessionList);
            if (sessions.length === 0) sessions = toArray(g.sesiones);
          }
          let studentIds = toArray(g.studentIds);
          if (studentIds.length === 0) {
            studentIds = toArray(g.students);
            if (studentIds.length === 0) studentIds = toArray(g.estudiantes);
          }
          return {
            ...g,
            sessions,
            studentIds,
          };
        });
        setGroups(safeGroups);
      } else {
        setGroups([]);
        setError("La respuesta de la API no es un array válido");
      }
      setSearched(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Error al buscar los grupos de la materia"
      );
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/admin/subject");
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">
          LISTAR GRUPOS POR MATERIA
        </div>
        <div className="admin-header-right-tools">
          <button className="admin-search-button" onClick={handleGoBack}>
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
          <h2 className="admin-list-title">
            Buscar Grupos por Código de Materia
          </h2>

          <form onSubmit={handleSearch} className="admin-search-form">
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="subjectCode" className="admin-search-label">
                Código de Materia:
              </label>
              <input
                type="text"
                id="subjectCode"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                required
                className="admin-search-input"
                placeholder="Ej: MAT101, FIS201, etc."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="admin-search-button"
            >
              {loading ? "Buscando..." : "Buscar Grupos"}
            </button>
            {error && <div className="admin-search-error">{error}</div>}
          </form>

          {searched && (
            <>
              {loading && (
                <div className="admin-list-loading">Cargando grupos...</div>
              )}

              {!loading && !error && groups.length === 0 && (
                <div className="admin-list-empty">
                  No se encontraron grupos para la materia "{subjectCode}"
                </div>
              )}

              {!loading && !error && groups.length > 0 && (
                <div className="admin-groups-list">
                  <h3 className="groups-found-title">
                    Grupos encontrados para la materia "{subjectCode}":
                  </h3>
                  <div className="groups-grid">
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        className="admin-group-card"
                        style={{
                          padding: 20,
                          background: "#fff",
                          borderRadius: 12,
                          boxShadow: "0 2px 8px #0001",
                          marginBottom: 20,
                        }}
                      >
                        <div
                          style={{
                            marginBottom: 10,
                            borderBottom: "1px solid #eee",
                            paddingBottom: 8,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "bold",
                              fontSize: 18,
                              color: "#8b0000",
                            }}
                          >
                            Grupo {group.number}
                          </span>
                          <span style={{ float: "right", color: "#888" }}>
                            ID: {group.id}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 10,
                            marginBottom: 10,
                          }}
                        >
                          <div>
                            <b>Materia:</b> {group.subjectId}
                          </div>
                          <div>
                            <b>Profesor:</b> {group.teacherName}{" "}
                            <span style={{ color: "#888", fontSize: 12 }}>
                              (ID: {group.teacherId})
                            </span>
                          </div>
                          <div>
                            <b>Capacidad:</b> {group.capacity}
                          </div>
                          <div>
                            <b>Estado:</b>{" "}
                            <span
                              style={{
                                color: group.active ? "#28a745" : "#dc3545",
                                fontWeight: "bold",
                              }}
                            >
                              {group.active ? "Activo" : "Inactivo"}
                            </span>
                          </div>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <b>
                            Estudiantes inscritos ({group.studentIds.length}):
                          </b>
                          {group.studentIds.length === 0 ? (
                            <span style={{ marginLeft: 8, color: "#888" }}>
                              Ninguno
                            </span>
                          ) : (
                            <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
                              {group.studentIds.map((id, idx) => (
                                <li
                                  key={id + idx}
                                  style={{
                                    fontFamily: "monospace",
                                    fontSize: 13,
                                  }}
                                >
                                  {id}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div>
                          <b>Sesiones ({group.sessions.length}):</b>
                          {group.sessions.length === 0 ? (
                            <span style={{ marginLeft: 8, color: "#888" }}>
                              Ninguna
                            </span>
                          ) : (
                            <table
                              style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginTop: 6,
                                fontSize: 13,
                              }}
                            >
                              <thead>
                                <tr style={{ background: "#f5f5f5" }}>
                                  <th
                                    style={{
                                      padding: "4px 8px",
                                      border: "1px solid #eee",
                                    }}
                                  >
                                    Día
                                  </th>
                                  <th
                                    style={{
                                      padding: "4px 8px",
                                      border: "1px solid #eee",
                                    }}
                                  >
                                    Hora inicio
                                  </th>
                                  <th
                                    style={{
                                      padding: "4px 8px",
                                      border: "1px solid #eee",
                                    }}
                                  >
                                    Hora fin
                                  </th>
                                  <th
                                    style={{
                                      padding: "4px 8px",
                                      border: "1px solid #eee",
                                    }}
                                  >
                                    Aula
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.sessions.map((s, idx) => (
                                  <tr key={idx}>
                                    <td
                                      style={{
                                        padding: "4px 8px",
                                        border: "1px solid #eee",
                                      }}
                                    >
                                      {s.day}
                                    </td>
                                    <td
                                      style={{
                                        padding: "4px 8px",
                                        border: "1px solid #eee",
                                      }}
                                    >
                                      {s.startTime}
                                    </td>
                                    <td
                                      style={{
                                        padding: "4px 8px",
                                        border: "1px solid #eee",
                                      }}
                                    >
                                      {s.endTime}
                                    </td>
                                    <td
                                      style={{
                                        padding: "4px 8px",
                                        border: "1px solid #eee",
                                      }}
                                    >
                                      {s.classroom}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListGroups;
