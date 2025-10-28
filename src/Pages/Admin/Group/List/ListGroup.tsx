import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ListGroup.css";

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

const ListGroup: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("http://localhost:8083/api/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    } catch (err: any) {
      console.error("Error obteniendo grupos:", err);
      setError(
        err.response?.data?.message || "Error al obtener la lista de grupos"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (groupId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este grupo?")) {
      try {
        const token = sessionStorage.getItem("token");
        await axios.delete(`http://localhost:8083/api/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Refresh the list after deletion
        fetchGroups();
      } catch (err: any) {
        console.error("Error eliminando grupo:", err);
        setError(err.response?.data?.message || "Error al eliminar el grupo");
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          backgroundColor: "#8b0000",
          color: "white",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
          LISTAR GRUPOS
        </div>
        <div>
          <button
            onClick={() => navigate("/admin/group")}
            style={{
              padding: "10px 20px",
              backgroundColor: "white",
              color: "#8b0000",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Volver
          </button>
        </div>
      </header>

      <div
        style={{
          padding: "50px 20px",
          backgroundColor: "#f0f2f5",
          flexGrow: "1",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              color: "#8b0000",
              textAlign: "center",
              marginBottom: "30px",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Lista de Todos los Grupos
          </h2>

          {loading && (
            <div
              style={{ textAlign: "center", color: "#8b0000", padding: "20px" }}
            >
              Cargando grupos...
            </div>
          )}

          {error && (
            <div
              style={{
                color: "red",
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#ffe6e6",
                borderRadius: "5px",
                margin: "20px 0",
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && groups.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#666",
                padding: "40px",
                border: "2px dashed #ddd",
                borderRadius: "5px",
              }}
            >
              No hay grupos registrados
            </div>
          )}

          {!loading && !error && groups.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
                gap: "20px",
              }}
            >
              {groups.map((group) => (
                <div
                  key={group.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    border: "1px solid #e9ecef",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ padding: "25px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid #f1f3f4",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#495057",
                          minWidth: "120px",
                          fontSize: "13px",
                          textTransform: "uppercase",
                        }}
                      >
                        ID:
                      </span>
                      <span
                        style={{
                          color: "#212529",
                          fontSize: "14px",
                          fontWeight: "500",
                          marginLeft: "15px",
                          flex: "1",
                        }}
                      >
                        {group.id}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid #f1f3f4",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#495057",
                          minWidth: "120px",
                          fontSize: "13px",
                          textTransform: "uppercase",
                        }}
                      >
                        Materia:
                      </span>
                      <span
                        style={{
                          color: "#212529",
                          fontSize: "14px",
                          fontWeight: "500",
                          marginLeft: "15px",
                          flex: "1",
                        }}
                      >
                        {group.subjectId}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid #f1f3f4",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#495057",
                          minWidth: "120px",
                          fontSize: "13px",
                          textTransform: "uppercase",
                        }}
                      >
                        Número:
                      </span>
                      <span
                        style={{
                          color: "#212529",
                          fontSize: "14px",
                          fontWeight: "500",
                          marginLeft: "15px",
                          flex: "1",
                        }}
                      >
                        {group.number}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid #f1f3f4",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#495057",
                          minWidth: "120px",
                          fontSize: "13px",
                          textTransform: "uppercase",
                        }}
                      >
                        Capacidad:
                      </span>
                      <span
                        style={{
                          color: "#212529",
                          fontSize: "14px",
                          fontWeight: "500",
                          marginLeft: "15px",
                          flex: "1",
                        }}
                      >
                        {group.capacity}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid #f1f3f4",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#495057",
                          minWidth: "120px",
                          fontSize: "13px",
                          textTransform: "uppercase",
                        }}
                      >
                        Estado:
                      </span>
                      <span
                        style={{
                          color: "#212529",
                          fontSize: "14px",
                          fontWeight: "500",
                          marginLeft: "15px",
                          flex: "1",
                        }}
                      >
                        {group.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid #f1f3f4",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#495057",
                          minWidth: "120px",
                          fontSize: "13px",
                          textTransform: "uppercase",
                        }}
                      >
                        Profesor:
                      </span>
                      <span
                        style={{
                          color: "#212529",
                          fontSize: "14px",
                          fontWeight: "500",
                          marginLeft: "15px",
                          flex: "1",
                        }}
                      >
                        {group.teacherName} (ID: {group.teacherId})
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 0",
                        borderBottom: "1px solid #f1f3f4",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#495057",
                          minWidth: "120px",
                          fontSize: "13px",
                          textTransform: "uppercase",
                        }}
                      >
                        Estudiantes:
                      </span>
                      <span
                        style={{
                          color: "#212529",
                          fontSize: "14px",
                          fontWeight: "500",
                          marginLeft: "15px",
                          flex: "1",
                        }}
                      >
                        {group.studentIds.length} inscritos
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 0",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#495057",
                          minWidth: "120px",
                          fontSize: "13px",
                          textTransform: "uppercase",
                        }}
                      >
                        Sesiones:
                      </span>
                      <span
                        style={{
                          color: "#212529",
                          fontSize: "14px",
                          fontWeight: "500",
                          marginLeft: "15px",
                          flex: "1",
                        }}
                      >
                        {group.sessions.length} por semana
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                      padding: "15px 25px",
                      borderTop: "1px solid #f1f3f4",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <button
                      onClick={() =>
                        navigate(`/admin/group/update?id=${group.id}`)
                      }
                      style={{
                        flex: "1",
                        padding: "8px 12px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/group/delete?id=${group.id}`)
                      }
                      style={{
                        flex: "1",
                        padding: "8px 12px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "20px",
              borderTop: "1px solid #e9ecef",
              marginTop: "20px",
            }}
          >
            <button
              onClick={fetchGroups}
              disabled={loading}
              style={{
                padding: "12px 24px",
                backgroundColor: "#8b0000",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {loading ? "Actualizando..." : "Actualizar Lista"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListGroup;
