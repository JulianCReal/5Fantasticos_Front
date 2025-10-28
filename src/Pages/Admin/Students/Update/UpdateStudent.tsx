import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./UpdateStudent.css";

interface StudentData {
  id: string;
  name: string;
  lastName: string;
  document: string;
  career: string;
  semester: number;
}

const UpdateStudent: React.FC = () => {
  const [searchId, setSearchId] = useState("");
  const [student, setStudent] = useState<StudentData | null>(null);
  const [formData, setFormData] = useState<StudentData>({
    id: "",
    name: "",
    lastName: "",
    document: "",
    career: "",
    semester: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
      setError("Por favor ingresa un ID válido");
      return;
    }
    setSearching(true);
    setError(null);
    setStudent(null);
    setFormData({
      id: "",
      name: "",
      lastName: "",
      document: "",
      career: "",
      semester: 0,
    });

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

      const studentData = response.data.data;
      setStudent(studentData);
      setFormData(studentData);
    } catch (err: any) {
      console.error("Error buscando estudiante:", err);
      setError(err.response?.data?.message || "Estudiante no encontrado");
    } finally {
      setSearching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "semester" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `http://localhost:8083/api/admin/students/${student.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Estudiante actualizado exitosamente");
      setTimeout(() => {
        navigate("/admin/students");
      }, 2000);
    } catch (err: any) {
      console.error("Error actualizando estudiante:", err);
      setError(err.response?.data?.message || "Error al actualizar estudiante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">
          ACTUALIZAR ESTUDIANTE
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
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        {/* Search Section */}
        <div className="admin-update-search-section">
          <h2 className="admin-update-search-title">
            Buscar Estudiante por ID
          </h2>
          <div className="admin-update-search-form">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingresa el ID del estudiante"
              className="admin-update-search-input"
            />
            <button
              onClick={handleSearchClick}
              disabled={searching}
              className="admin-update-search-button"
            >
              {searching ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {error && !student && <div className="admin-update-error">{error}</div>}

        {/* Update Form */}
        {student && (
          <form onSubmit={handleSubmit} className="admin-update-form">
            <h2 className="admin-update-form-title">Actualizar Información</h2>

            <div className="admin-update-form-grid">
              <div>
                <label htmlFor="id" className="admin-update-label">
                  ID:
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
                <label htmlFor="name" className="admin-update-label">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="admin-update-input"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="admin-update-label">
                  Apellido:
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="admin-update-input"
                />
              </div>

              <div>
                <label htmlFor="document" className="admin-update-label">
                  Documento:
                </label>
                <input
                  type="text"
                  id="document"
                  name="document"
                  value={formData.document}
                  onChange={handleChange}
                  required
                  className="admin-update-input"
                />
              </div>

              <div>
                <label htmlFor="career" className="admin-update-label">
                  Carrera:
                </label>
                <input
                  type="text"
                  id="career"
                  name="career"
                  value={formData.career}
                  onChange={handleChange}
                  required
                  className="admin-update-input"
                />
              </div>

              <div>
                <label htmlFor="semester" className="admin-update-label">
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
                  className="admin-update-input"
                />
              </div>
            </div>

            {success && <div className="admin-update-success">{success}</div>}

            {error && <div className="admin-update-error">{error}</div>}

            <div className="admin-update-buttons">
              <button
                type="button"
                onClick={() => setStudent(null)}
                className="admin-update-button-cancel"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="admin-update-button-update"
              >
                {loading ? "Actualizando..." : "Actualizar Estudiante"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateStudent;
