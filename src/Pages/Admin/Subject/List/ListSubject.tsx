import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ListSubject.css";

interface SubjectData {
  name: string;
  credits: number;
  semester: number;
  code: string;
  deparment: string;
}

const ListSubject: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      "Estado del componente - Loading:",
      loading,
      "Error:",
      error,
      "Subjects length:",
      subjects.length
    );
  }, [loading, error, subjects]);

  const handleDelete = async (subjectId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta materia?")) {
      try {
        const token = sessionStorage.getItem("token");
        await axios.delete(`http://localhost:8083/api/subjects/${subjectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Refresh the list after deletion
        fetchSubjects();
      } catch (err: any) {
        console.error("Error eliminando materia:", err);
        setError(err.response?.data?.message || "Error al eliminar la materia");
      }
    }
  };

  const fetchSubjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("http://localhost:8083/api/subjects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let subjectsData;
      if (response.data && response.data.data) {
        subjectsData = response.data.data;
      } else {
        subjectsData = response.data;
      }

      // Ensure subjectsData is an array
      if (Array.isArray(subjectsData)) {
        setSubjects(subjectsData);
      } else {
        setSubjects([]);
        setError("La respuesta de la API no es un array válido");
      }
    } catch (err: any) {
      console.error("Error obteniendo materias:", err);
      setError(
        err.response?.data?.message || "Error al obtener la lista de materias"
      );
    } finally {
      setLoading(false);
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
          LISTAR MATERIAS
        </div>
        <div>
          <button
            onClick={() => navigate("/admin/subject")}
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
            Lista de Todas las Materias
          </h2>

          {loading && (
            <div
              style={{ textAlign: "center", color: "#8b0000", padding: "20px" }}
            >
              Cargando materias...
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

          {!loading && !error && subjects.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#666",
                padding: "40px",
                border: "2px dashed #ddd",
                borderRadius: "5px",
              }}
            >
              No hay materias registradas
            </div>
          )}

          {!loading && !error && subjects.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
                gap: "20px",
              }}
            >
              {subjects.map((subject) => (
                <div
                  key={subject.code}
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
                        Código:
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
                        {subject.code}
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
                        Nombre:
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
                        {subject.name || "Sin nombre"}
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
                        Semestre:
                      </span>
                      <span
                        style={{
                          color: "#212529",
                          fontSize: "14px",
                          fontWeight: "500",
                          marginLeft: "15px",
                          flex: "1",
                          wordBreak: "break-word",
                        }}
                      >
                        {subject.semester || "N/A"}
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
                        Créditos:
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
                        {subject.credits !== undefined
                          ? subject.credits
                          : "N/A"}
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
                        Departamento:
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
                        {subject.deparment || "Sin departamento"}
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
                        navigate(`/admin/subject/update?code=${subject.code}`)
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
                        navigate(`/admin/subject/delete?code=${subject.code}`)
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
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/subject/listGroups?subjectCode=${subject.code}`
                        )
                      }
                      style={{
                        flex: "1",
                        padding: "8px 12px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Ver Grupos
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
              onClick={fetchSubjects}
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

export default ListSubject;
