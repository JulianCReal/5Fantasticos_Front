import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../DashboardAdmin/Dashboardadmin.css";
import "./RegisterSubject.css";

interface SubjectData {
  name: string;
  credits: number;
  semester: number;
  code: string;
  deparment: string;
}

const RegisterSubject: React.FC = () => {
  const [formData, setFormData] = useState<SubjectData>({
    name: "",
    credits: 0,
    semester: 0,
    code: "",
    deparment: "",
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
      await axios.post("http://localhost:8083/api/admin/subjects", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccess("Materia registrada exitosamente");
      setTimeout(() => {
        navigate("/admin/subject");
      }, 2000);
    } catch (err: any) {
      console.error("Error registrando materia:", err);
      setError(err.response?.data?.message || "Error al registrar la materia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">REGISTRAR MATERIA</div>
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
        <form onSubmit={handleSubmit} className="admin-register-form">
          <h2 className="admin-register-form-title">Registrar Nueva Materia</h2>

          <div className="admin-register-form-grid">
            <div>
              <label htmlFor="code" className="admin-register-label">
                Código:
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="admin-register-input"
                placeholder="Ej: MAT101"
              />
            </div>

            <div>
              <label htmlFor="name" className="admin-register-label">
                Nombre:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="admin-register-input"
                placeholder="Nombre de la materia"
              />
            </div>

            <div>
              <label htmlFor="credits" className="admin-register-label">
                Créditos:
              </label>
              <input
                type="number"
                id="credits"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                required
                min="0"
                className="admin-register-input"
              />
            </div>

            <div>
              <label htmlFor="semester" className="admin-register-label">
                Semestre:
              </label>
              <input
                type="number"
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                min="0"
                className="admin-register-input"
              />
            </div>

            <div>
              <label htmlFor="deparment" className="admin-register-label">
                Departamento:
              </label>
              <select
                id="deparment"
                name="deparment"
                value={formData.deparment}
                onChange={handleChange}
                required
                className="admin-register-select"
              >
                <option value="">Seleccionar departamento</option>
                <option value="Ingeniería de Sistemas">
                  Ingeniería de Sistemas
                </option>
                <option value="Ingeniería Civil">Ingeniería Civil</option>
                <option value="Ingeniería Industrial">
                  Ingeniería Industrial
                </option>
                <option value="Ingeniería Electrónica">
                  Ingeniería Electrónica
                </option>
                <option value="Matemáticas">Matemáticas</option>
                <option value="Física">Física</option>
                <option value="Química">Química</option>
                <option value="Humanidades">Humanidades</option>
              </select>
            </div>
          </div>

          {success && <div className="admin-register-success">{success}</div>}
          {error && <div className="admin-register-error">{error}</div>}

          <div className="admin-register-buttons">
            <button
              type="button"
              onClick={() => navigate("/admin/subject")}
              className="admin-register-button-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="admin-register-button-register"
            >
              {loading ? "Registrando..." : "Registrar Materia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterSubject;
