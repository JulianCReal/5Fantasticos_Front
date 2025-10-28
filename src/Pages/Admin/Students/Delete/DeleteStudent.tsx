import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./DeleteStudent.css";

interface Student {
  id: number;
  name: string;
  lastName: string;
  document: string;
  career: string;
  semester: number;
}

const DeleteStudent: React.FC = () => {
  const [searchId, setSearchId] = useState<string>("");
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setSearchId(idFromUrl);
      // Auto-search if ID is provided in URL
      handleSearch(idFromUrl);
    }
  }, [searchParams]);

  const handleSearchClick = () => {
    handleSearch();
  };

  const handleSearch = async (idToSearch?: string) => {
    const searchValue = idToSearch || searchId;
    if (!searchValue.trim()) {
      setError("Por favor ingrese un ID válido.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setStudent(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8083/api/students/${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudent(response.data.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Estudiante no encontrado.");
      } else {
        setError("Error al buscar el estudiante.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!student) return;
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`http://localhost:8083/api/students/${student!.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Estudiante eliminado exitosamente.");
      setStudent(null);
      setSearchId("");
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Estudiante no encontrado.");
      } else {
        setError("Error al eliminar el estudiante.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">BORRAR ESTUDIANTE</div>
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
        <div className="admin-delete-search-section">
          <h2 className="admin-delete-search-title">
            Buscar Estudiante por ID
          </h2>
          <div className="admin-delete-search-form">
            <input
              type="text"
              placeholder="Ingrese ID del estudiante"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="admin-delete-search-input"
            />
            <button
              onClick={handleSearchClick}
              disabled={loading}
              className="admin-delete-search-button"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {error && <p className="admin-delete-error">{error}</p>}
        {success && <p className="admin-delete-success">{success}</p>}

        {student && (
          <div className="admin-delete-details">
            <h2 className="admin-delete-details-title">
              Detalles del Estudiante
            </h2>
            <div className="admin-delete-info">
              <p>
                <strong>ID:</strong> {student.id}
              </p>
              <p>
                <strong>Nombre:</strong> {student.name}
              </p>
              <p>
                <strong>Apellido:</strong> {student.lastName}
              </p>
              <p>
                <strong>Documento:</strong> {student.document}
              </p>
              <p>
                <strong>Carrera:</strong> {student.career}
              </p>
              <p>
                <strong>Semestre:</strong> {student.semester}
              </p>
            </div>
            <div className="admin-delete-buttons">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="admin-delete-button-delete"
              >
                {loading ? "Eliminando..." : "Eliminar Estudiante"}
              </button>
              <button
                onClick={() => navigate("/admin/students")}
                className="admin-delete-button-cancel"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="admin-delete-back-button">
          <button
            onClick={() => navigate("/admin/students")}
            className="admin-delete-button-back"
          >
            Volver al Panel de Estudiantes
          </button>
        </div>

        {/* Modal de Confirmación Personalizado */}
        {showConfirmDialog && student && (
          <div className="admin-delete-modal-overlay">
            <div className="admin-delete-modal">
              <h3 className="admin-delete-modal-title">
                Confirmar Eliminación
              </h3>
              <p className="admin-delete-modal-message">
                ¿Está seguro de que desea eliminar al estudiante{" "}
                <strong>
                  "{student.name} {student.lastName}"
                </strong>
                ?
              </p>
              <p className="admin-delete-modal-warning">
                Esta acción no se puede deshacer.
              </p>
              <div className="admin-delete-modal-buttons">
                <button
                  onClick={cancelDelete}
                  className="admin-delete-modal-cancel"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="admin-delete-modal-confirm"
                  disabled={loading}
                >
                  {loading ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteStudent;
