// DeleteTeacher.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./DeleteTeacher.css";

interface Teacher {
  id: string;
  name: string;
  lastName: string;
  document: string;
  department: string;
}

const DeleteTeacher: React.FC = () => {
  const [searchId, setSearchId] = useState<string>("");
  const [teacher, setTeacher] = useState<Teacher | null>(null);
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
    setTeacher(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8083/api/teachers/${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DeleteTeacher API Response:", response);
      console.log("DeleteTeacher Response data:", response.data);

      let teacherData;
      if (response.data && response.data.data) {
        console.log("DeleteTeacher Setting teacher from response.data.data:", response.data.data);
        teacherData = response.data.data;
      } else {
        console.log("DeleteTeacher Setting teacher from response.data:", response.data);
        teacherData = response.data;
      }

      console.log("DeleteTeacher Teacher object to set:", teacherData);

      if (!teacherData || !teacherData.id) {
        console.warn("DeleteTeacher Teacher object is empty or invalid:", teacherData);
        setError("El profesor encontrado no tiene datos válidos");
        return;
      }

      setTeacher(teacherData);
    } catch (err: any) {
      console.error("DeleteTeacher Error details:", err);
      if (err.response?.status === 404) {
        setError("Profesor no encontrado.");
      } else {
        setError("Error al buscar el profesor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!teacher) return;
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
        `http://localhost:8083/api/admin/teachers/${teacher!.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Profesor eliminado exitosamente.");
      setTeacher(null);
      setSearchId("");
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Profesor no encontrado.");
      } else {
        setError("Error al eliminar el profesor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const handleBack = () => {
    navigate("/admin/teacher");
  };

  return (
    <div className="admin-delete-container">
      <h1 className="admin-delete-title">Eliminar Profesor</h1>

      <div className="admin-delete-search-section">
        <h2 className="admin-delete-search-title">Buscar Profesor por ID</h2>
        <div className="admin-delete-search-form">
          <input
            type="text"
            placeholder="Ingrese ID del profesor"
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

      {teacher && (
        <div className="admin-delete-details">
          <h2 className="admin-delete-details-title">Detalles del Profesor</h2>
          <div className="admin-delete-info">
            <p>
              <strong>ID:</strong> {teacher.id}
            </p>
            <p>
              <strong>Nombre:</strong> {teacher.name}
            </p>
            <p>
              <strong>Apellido:</strong> {teacher.lastName}
            </p>
            <p>
              <strong>Documento:</strong> {teacher.document}
            </p>
            <p>
              <strong>Departamento:</strong> {teacher.department}
            </p>
          </div>
          <div className="admin-delete-buttons">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="admin-delete-button-delete"
            >
              {loading ? "Eliminando..." : "Eliminar Profesor"}
            </button>
            <button onClick={handleBack} className="admin-delete-button-cancel">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="admin-delete-back-button">
        <button onClick={handleBack} className="admin-delete-button-back">
          Volver al Panel de Profesores
        </button>
      </div>

      {/* Modal de Confirmación Personalizado */}
      {showConfirmDialog && teacher && (
        <div className="admin-delete-modal-overlay">
          <div className="admin-delete-modal">
            <h3 className="admin-delete-modal-title">Confirmar Eliminación</h3>
            <p className="admin-delete-modal-message">
              ¿Está seguro de que desea eliminar al profesor{" "}
              <strong>"{teacher.name}"</strong>?
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
  );
};

export default DeleteTeacher;
