import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../DashboardAdmin/Dashboardadmin.css";
import "./RegisterGroup.css";

interface GroupData {
  id: string;
  subjectId: string;
  number: number;
  capacity: number;
  active: boolean;
  teacherId: string;
  teacherName: string;
}

const RegisterGroup: React.FC = () => {
  const [formData, setFormData] = useState<GroupData>({
    id: "",
    subjectId: "",
    number: 1,
    capacity: 30,
    active: true,
    teacherId: "",
    teacherName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

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
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = sessionStorage.getItem("token");
      await axios.post("http://localhost:8083/api/admin/groups", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccess("Grupo registrado exitosamente");
      setTimeout(() => {
        navigate("/admin/group");
      }, 2000);
    } catch (err: any) {
      console.error("Error registrando grupo:", err);
      setError(err.response?.data?.message || "Error al registrar el grupo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">REGISTRAR GRUPO</div>
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
        <form onSubmit={handleSubmit} className="admin-register-form">
          <h2 className="admin-register-form-title">Registrar Nuevo Grupo</h2>

          <div className="admin-register-form-grid">
            <div>
              <label htmlFor="id" className="admin-register-label">
                ID del Grupo:
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                className="admin-register-input"
                placeholder="Ej: G101"
              />
            </div>

            <div>
              <label htmlFor="subjectId" className="admin-register-label">
                Código de Materia:
              </label>
              <input
                type="text"
                id="subjectId"
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                required
                className="admin-register-input"
                placeholder="Ej: MAT101"
              />
            </div>

            <div>
              <label htmlFor="number" className="admin-register-label">
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
                className="admin-register-input"
              />
            </div>

            <div>
              <label htmlFor="capacity" className="admin-register-label">
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
                className="admin-register-input"
              />
            </div>

            <div>
              <label htmlFor="teacherId" className="admin-register-label">
                ID del Profesor:
              </label>
              <input
                type="text"
                id="teacherId"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                required
                className="admin-register-input"
                placeholder="Ej: T001"
              />
            </div>

            <div>
              <label htmlFor="teacherName" className="admin-register-label">
                Nombre del Profesor:
              </label>
              <input
                type="text"
                id="teacherName"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleChange}
                required
                className="admin-register-input"
                placeholder="Nombre completo del profesor"
              />
            </div>

            <div className="checkbox-container">
              <label htmlFor="active" className="admin-register-checkbox-label">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="admin-register-checkbox"
                />
                Grupo activo
              </label>
            </div>
          </div>

          {success && <div className="admin-register-success">{success}</div>}
          {error && <div className="admin-register-error">{error}</div>}

          <div className="admin-register-buttons">
            <button
              type="button"
              onClick={() => navigate("/admin/group")}
              className="admin-register-button-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="admin-register-button-register"
            >
              {loading ? "Registrando..." : "Registrar Grupo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterGroup;
