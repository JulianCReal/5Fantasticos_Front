import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./DeleteGroup.css";

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

const DeleteGroup: React.FC = () => {
  const [searchId, setSearchId] = useState<string>("");
  const [group, setGroup] = useState<Group | null>(null);
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
    setGroup(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8083/api/groups/${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let groupData;
      if (response.data && response.data.data) {
        groupData = response.data.data;
      } else {
        groupData = response.data;
      }

      if (!groupData || !groupData.id) {
        setError("El grupo encontrado no tiene datos válidos");
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
      if (err.response?.status === 404) {
        setError("Grupo no encontrado.");
      } else {
        setError("Error al buscar el grupo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!group) return;
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
        `http://localhost:8083/api/admin/groups/${group!.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Grupo eliminado exitosamente.");
      setGroup(null);
      setSearchId("");
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Grupo no encontrado.");
      } else {
        setError("Error al eliminar el grupo.");
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
        <div className="admin-dashboard-logo-container">BORRAR GRUPO</div>
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
        <div className="admin-delete-search-section">
          <h2 className="admin-delete-search-title">Buscar Grupo por ID</h2>
          <div className="admin-delete-search-form">
            <input
              type="text"
              placeholder="Ingrese ID del grupo"
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

        {group && (
          <div className="admin-delete-details">
            <h2 className="admin-delete-details-title">Detalles del Grupo</h2>
            <div className="admin-delete-info">
              <p>
                <strong>ID:</strong> {group.id}
              </p>
              <p>
                <strong>Código de Materia:</strong> {group.subjectId}
              </p>
              <p>
                <strong>Número del Grupo:</strong> {group.number}
              </p>
              <p>
                <strong>Capacidad:</strong> {group.capacity}
              </p>
              <p>
                <strong>Profesor:</strong> {group.teacherName} (
                {group.teacherId})
              </p>
              <p>
                <strong>Estudiantes Inscritos:</strong>{" "}
                {group.studentIds.length}
              </p>
              <p>
                <strong>Sesiones:</strong> {group.sessions.length}
              </p>
              <p>
                <strong>Estado:</strong> {group.active ? "Activo" : "Inactivo"}
              </p>
            </div>
            <div className="admin-delete-buttons">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="admin-delete-button-delete"
              >
                {loading ? "Eliminando..." : "Eliminar Grupo"}
              </button>
              <button
                onClick={() => navigate("/admin/group")}
                className="admin-delete-button-cancel"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="admin-delete-back-button">
          <button
            onClick={() => navigate("/admin/group")}
            className="admin-delete-button-back"
          >
            Volver al Panel de Grupos
          </button>
        </div>

        {/* Modal de Confirmación Personalizado */}
        {showConfirmDialog && group && (
          <div className="admin-delete-modal-overlay">
            <div className="admin-delete-modal">
              <h3 className="admin-delete-modal-title">
                Confirmar Eliminación
              </h3>
              <p className="admin-delete-modal-message">
                ¿Está seguro de que desea eliminar el grupo{" "}
                <strong>
                  "{group.subjectId} - Grupo {group.number}"
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

export default DeleteGroup;
