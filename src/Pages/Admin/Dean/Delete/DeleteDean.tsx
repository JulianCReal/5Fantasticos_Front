// DeleteDean.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./DeleteDean.css";

interface Dean {
  id: string;
  name: string;
  faculty: string;
}

const DeleteDean: React.FC = () => {
  const [searchId, setSearchId] = useState<string>("");
  const [dean, setDean] = useState<Dean | null>(null);
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
    setDean(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8083/api/deans/${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDean(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Decano no encontrado.");
      } else {
        setError("Error al buscar el decano.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!dean) return;
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = sessionStorage.getItem("token");
      await axios.delete(`http://localhost:8083/api/admin/deans/${dean!.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Decano eliminado exitosamente.");
      setDean(null);
      setSearchId("");
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Decano no encontrado.");
      } else {
        setError("Error al eliminar el decano.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const handleBack = () => {
    navigate("/admin/dean");
  };

  return (
    <div className="admin-delete-container">
      <h1 className="admin-delete-title">Eliminar Decano</h1>

      <div className="admin-delete-search-section">
        <h2 className="admin-delete-search-title">Buscar Decano por ID</h2>
        <div className="admin-delete-search-form">
          <input
            type="text"
            placeholder="Ingrese ID del decano"
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

      {dean && (
        <div className="admin-delete-details">
          <h2 className="admin-delete-details-title">Detalles del Decano</h2>
          <div className="admin-delete-info">
            <p>
              <strong>ID:</strong> {dean.id}
            </p>
            <p>
              <strong>Nombre:</strong> {dean.name}
            </p>
            <p>
              <strong>Facultad:</strong> {dean.faculty}
            </p>
          </div>
          <div className="admin-delete-buttons">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="admin-delete-button-delete"
            >
              {loading ? "Eliminando..." : "Eliminar Decano"}
            </button>
            <button onClick={handleBack} className="admin-delete-button-cancel">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="admin-delete-back-button">
        <button onClick={handleBack} className="admin-delete-button-back">
          Volver al Panel de Decanos
        </button>
      </div>

      {/* Modal de Confirmación Personalizado */}
      {showConfirmDialog && dean && (
        <div className="admin-delete-modal-overlay">
          <div className="admin-delete-modal">
            <h3 className="admin-delete-modal-title">Confirmar Eliminación</h3>
            <p className="admin-delete-modal-message">
              ¿Está seguro de que desea eliminar al decano{" "}
              <strong>"{dean.name}"</strong>?
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

export default DeleteDean;
