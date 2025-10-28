import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./DeleteSubject.css";

interface SubjectData {
  name: string;
  credits: number;
  semester: number;
  code: string;
  deparment: string;
}

const DeleteSubject: React.FC = () => {
  const [searchCode, setSearchCode] = useState<string>("");
  const [subject, setSubject] = useState<SubjectData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setSearchCode(codeFromUrl);
      // Auto-search if code is provided in URL
      handleSearch(codeFromUrl);
    }
  }, [searchParams]);

  const handleSearchClick = () => {
    handleSearch();
  };

  const handleSearch = async (codeToSearch?: string) => {
    const searchValue = codeToSearch || searchCode;
    if (!searchValue.trim()) {
      setError("Por favor ingrese un código válido.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setSubject(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8083/api/subjects/${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let subjectData;
      if (response.data && response.data.data) {
        subjectData = response.data.data;
      } else {
        subjectData = response.data;
      }

      if (!subjectData || !subjectData.code) {
        setError("La materia encontrada no tiene datos válidos");
        return;
      }

      // Adaptar los datos recibidos al modelo
      const adaptedSubject = {
        name: subjectData.name || "",
        credits: subjectData.credits || 0,
        semester: subjectData.semester || 0,
        code: subjectData.code || "",
        deparment: subjectData.deparment || subjectData.department || "",
      };
      setSubject(adaptedSubject);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Materia no encontrada.");
      } else {
        setError("Error al buscar la materia.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!subject) return;
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(
        `http://localhost:8083/api/admin/subjects/${subject!.code}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Materia eliminada exitosamente.");
      setSubject(null);
      setSearchCode("");
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Materia no encontrada.");
      } else {
        setError("Error al eliminar la materia.");
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
        <div className="admin-dashboard-logo-container">BORRAR MATERIA</div>
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
        <div className="admin-delete-search-section">
          <h2 className="admin-delete-search-title">
            Buscar Materia por Código
          </h2>
          <div className="admin-delete-search-form">
            <input
              type="text"
              placeholder="Ingrese código de la materia"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
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

        {subject && (
          <div className="admin-delete-details">
            <h2 className="admin-delete-details-title">
              Detalles de la Materia
            </h2>
            <div className="admin-delete-info">
              <p>
                <strong>Código:</strong> {subject.code}
              </p>
              <p>
                <strong>Nombre:</strong> {subject.name}
              </p>
              <p>
                <strong>Créditos:</strong> {subject.credits}
              </p>
              <p>
                <strong>Semestre:</strong> {subject.semester}
              </p>
              <p>
                <strong>Departamento:</strong> {subject.deparment}
              </p>
            </div>
            <div className="admin-delete-buttons">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="admin-delete-button-delete"
              >
                {loading ? "Eliminando..." : "Eliminar Materia"}
              </button>
              <button
                onClick={() => navigate("/admin/subject")}
                className="admin-delete-button-cancel"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="admin-delete-back-button">
          <button
            onClick={() => navigate("/admin/subject")}
            className="admin-delete-button-back"
          >
            Volver al Panel de Materias
          </button>
        </div>

        {/* Modal de Confirmación Personalizado */}
        {showConfirmDialog && subject && (
          <div className="admin-delete-modal-overlay">
            <div className="admin-delete-modal">
              <h3 className="admin-delete-modal-title">
                Confirmar Eliminación
              </h3>
              <p className="admin-delete-modal-message">
                ¿Está seguro de que desea eliminar la materia{" "}
                <strong>
                  "{subject.name} ({subject.code})"
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

export default DeleteSubject;
