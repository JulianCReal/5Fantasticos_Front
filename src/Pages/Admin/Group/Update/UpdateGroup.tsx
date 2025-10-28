import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../../../DashboardAdmin/Dashboardadmin.css";
import "./UpdateGroup.css";

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

const UpdateGroup: React.FC = () => {
  const [searchId, setSearchId] = useState("");
  const [group, setGroup] = useState<GroupData | null>(null);
  const [formData, setFormData] = useState<GroupData>({
    id: "",
    subjectId: "",
    number: 1,
    capacity: 30,
    active: true,
    teacherId: "",
    teacherName: "",
    studentIds: [],
    sessions: [],
  });
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setSearchId(idFromUrl);
      handleSearch(idFromUrl);
    }
  }, [searchParams]);

  const handleSearch = async (idToSearch?: string) => {
    const searchValue = idToSearch || searchId;
    if (!searchValue.trim()) {
      setError("Por favor ingrese un ID válido.");
      return;
    }

    setSearching(true);
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
      setFormData(adaptedGroup);
    } catch (err: any) {
      console.error("Error buscando grupo:", err);
      setError(err.response?.data?.message || "Grupo no encontrado");
    } finally {
      setSearching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `http://localhost:8083/api/admin/groups/${group.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Grupo actualizado exitosamente");
      setTimeout(() => {
        navigate("/admin/group");
      }, 2000);
    } catch (err: any) {
      console.error("Error actualizando grupo:", err);
      setError(err.response?.data?.message || "Error al actualizar el grupo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">ACTUALIZAR GRUPO</div>
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
        {/* Search Section */}
        <div className="admin-update-search-section">
          <h2 className="admin-update-search-title">Buscar Grupo por ID</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="admin-update-search-form"
          >
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingresa el ID del grupo"
              className="admin-update-search-input"
            />
            <button
              type="submit"
              disabled={searching}
              className="admin-update-search-button"
            >
              {searching ? "Buscando..." : "Buscar"}
            </button>
          </form>
        </div>

        {error && !group && <div className="admin-update-error">{error}</div>}

        {/* Update Form */}
        {group && (
          <form onSubmit={handleSubmit} className="admin-update-form">
            <h2 className="admin-update-form-title">Actualizar Información</h2>

            <div className="admin-update-form-grid">
              <div>
                <label htmlFor="id" className="admin-update-label">
                  ID del Grupo:
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  required
                  className="admin-update-input"
                />
              </div>

              <div>
                <label htmlFor="subjectId" className="admin-update-label">
                  Código de Materia:
                </label>
                <input
                  type="text"
                  id="subjectId"
                  name="subjectId"
                  value={formData.subjectId}
                  onChange={handleChange}
                  required
                  className="admin-update-input"
                />
              </div>

              <div>
                <label htmlFor="number" className="admin-update-label">
                  Número del Grupo:
                </label>
                <input
                  type="number"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  required
                  min="1"
                  className="admin-update-input"
                />
              </div>

              <div>
                <label htmlFor="capacity" className="admin-update-label">
                  Capacidad:
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="admin-update-input"
                />
              </div>

              <div>
                <label htmlFor="teacherId" className="admin-update-label">
                  ID del Profesor:
                </label>
                <input
                  type="text"
                  id="teacherId"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  required
                  className="admin-update-input"
                />
              </div>

              <div>
                <label htmlFor="teacherName" className="admin-update-label">
                  Nombre del Profesor:
                </label>
                <input
                  type="text"
                  id="teacherName"
                  name="teacherName"
                  value={formData.teacherName}
                  onChange={handleChange}
                  required
                  className="admin-update-input"
                />
              </div>

              <div className="checkbox-container">
                <label htmlFor="active" className="admin-update-checkbox-label">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="admin-update-checkbox"
                  />
                  Grupo activo
                </label>
              </div>
            </div>

            {success && <div className="admin-update-success">{success}</div>}
            {error && <div className="admin-update-error">{error}</div>}

            <div className="admin-update-buttons">
              <button
                type="button"
                onClick={() => setGroup(null)}
                className="admin-update-button-cancel"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="admin-update-button-update"
              >
                {loading ? "Actualizando..." : "Actualizar Grupo"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateGroup;
