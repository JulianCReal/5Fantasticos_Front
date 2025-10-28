import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterStudent.css";

interface StudentData {
  id: string;
  name: string;
  lastName: string;
  document: string;
  career: string;
  semester: number;
}

const RegisterStudent: React.FC = () => {
  const [formData, setFormData] = useState<StudentData>({
    id: "",
    name: "",
    lastName: "",
    document: "",
    career: "",
    semester: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "semester" ? parseInt(value) || 0 : value,
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
        "http://localhost:8083/api/students",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Estudiante registrado exitosamente");
      setTimeout(() => {
        navigate("/admin/students"); // Go back to students panel after 2 seconds
      }, 2000);
    } catch (err: any) {
      console.error("Error registrando estudiante:", err);
      setError(err.response?.data?.message || "Error al registrar estudiante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">
          REGISTRAR ESTUDIANTE
        </div>
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
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "100px",
          paddingBottom: "200px",
        }}
      >
        <form onSubmit={handleSubmit} className="admin-register-form">
          <div className="admin-register-title-section">
            <h2 className="admin-register-title">Registrar Nuevo Estudiante</h2>
          </div>

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
            <label htmlFor="lastName" className="admin-register-label">
              Apellido:
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="admin-register-input"
            />
          </div>

          <div>
            <label htmlFor="document" className="admin-register-label">
              Documento:
            </label>
            <input
              type="text"
              id="document"
              name="document"
              value={formData.document}
              onChange={handleChange}
              required
              className="admin-register-input"
            />
          </div>

          <div>
            <label htmlFor="career" className="admin-register-label">
              Carrera:
            </label>
            <input
              type="text"
              id="career"
              name="career"
              value={formData.career}
              onChange={handleChange}
              required
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
              min="1"
              className="admin-register-input"
            />
          </div>

          {success && <div className="admin-register-success">{success}</div>}

          {error && <div className="admin-register-error">{error}</div>}

          <div className="admin-register-buttons">
            <button
              type="button"
              onClick={() => navigate("/admin/students")}
              className="admin-register-button-volver"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={loading}
              className="admin-register-button-registrar"
            >
              {loading ? "Registrando..." : "Registrar Estudiante"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterStudent;
