import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterDean.css";

interface DeanData {
  id: string;
  name: string;
  faculty: string;
}

const RegisterDean: React.FC = () => {
  const [formData, setFormData] = useState<DeanData>({
    id: "",
    name: "",
    faculty: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8083/api/deans",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Decano registrado exitosamente");
      setTimeout(() => {
        navigate("/admin/dean");
      }, 2000);
    } catch (err: any) {
      console.error("Error registrando decano:", err);
      setError(err.response?.data?.message || "Error al registrar decano");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">REGISTRAR DECANO</div>
        <div className="admin-header-right-tools">
          <button
            className="admin-search-button"
            onClick={() => navigate("/admin/dean")}
          >
            Volver
          </button>
        </div>
      </header>

      <div
        className="admin-dashboard-content"
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "100px",
          paddingBottom: "200px",
        }}
      >
        <form onSubmit={handleSubmit} className="admin-register-form">
          <div className="admin-register-title-section">
            <h2 className="admin-register-title">Registrar Nuevo Decano</h2>
          </div>

          <div className="admin-register-form-grid">
            <div>
              <label htmlFor="id" className="admin-register-label">
                ID:
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                className="admin-register-input"
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
              />
            </div>

            <div>
              <label htmlFor="faculty" className="admin-register-label">
                Facultad:
              </label>
              <input
                type="text"
                id="faculty"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                required
                className="admin-register-input"
              />
            </div>
          </div>

          {success && <div className="admin-register-success">{success}</div>}

          {error && <div className="admin-register-error">{error}</div>}

          <div className="admin-register-buttons">
            <button
              type="button"
              onClick={() => navigate("/admin/dean")}
              className="admin-register-button-volver"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={loading}
              className="admin-register-button-registrar"
            >
              {loading ? "Registrando..." : "Registrar Decano"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterDean;
