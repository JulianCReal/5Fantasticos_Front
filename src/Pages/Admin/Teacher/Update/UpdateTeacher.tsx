import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./UpdateTeacher.css";

interface TeacherData {
  id: string;
  name: string;
  lastName: string;
  document: string;
  department: string;
}

const UpdateTeacher: React.FC = () => {
  const [searchId, setSearchId] = useState("");
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [formData, setFormData] = useState<TeacherData>({
    id: "",
    name: "",
    lastName: "",
    document: "",
    department: "",
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

  const handleSearch = async (e: React.FormEvent | string) => {
    let searchValue: string;

    if (typeof e === "string") {
      // Called with ID directly
      searchValue = e;
    } else {
      // Called from form submit
      e.preventDefault();
      searchValue = searchId;
    }

    if (!searchValue.trim()) {
      setError("Por favor ingresa un ID válido");
      return;
    }
    setSearching(true);
    setError(null);
    setTeacher(null);
    setFormData({
      id: "",
      name: "",
      lastName: "",
      document: "",
      department: "",
    });

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

      console.log("UpdateTeacher API Response:", response);
      console.log("UpdateTeacher Response data:", response.data);

      let teacherData;
      if (response.data && response.data.data) {
        console.log(
          "UpdateTeacher Setting teacher from response.data.data:",
          response.data.data
        );
        teacherData = response.data.data;
      } else {
        console.log(
          "UpdateTeacher Setting teacher from response.data:",
          response.data
        );
        teacherData = response.data;
      }

      console.log("UpdateTeacher Teacher object to set:", teacherData);

      if (!teacherData || !teacherData.id) {
        console.warn(
          "UpdateTeacher Teacher object is empty or invalid:",
          teacherData
        );
        setError("El profesor encontrado no tiene datos válidos");
        return;
      }

      setTeacher(teacherData);
      setFormData(teacherData);
    } catch (err: any) {
      console.error("Error buscando profesor:", err);
      setError(err.response?.data?.message || "Profesor no encontrado");
    } finally {
      setSearching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `http://localhost:8083/api/admin/teachers/${teacher.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Profesor actualizado exitosamente");
      setTimeout(() => {
        navigate("/admin/teacher");
      }, 2000);
    } catch (err: any) {
      console.error("Error actualizando profesor:", err);
      setError(err.response?.data?.message || "Error al actualizar profesor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">
          ACTUALIZAR PROFESOR
        </div>
        <div className="admin-header-right-tools">
          <button
            className="admin-search-button"
            onClick={() => navigate("/admin/teacher")}
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
          <h2 className="admin-update-search-title">Buscar Profesor por ID</h2>
          <form onSubmit={handleSearch} className="admin-update-search-form">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingresa el ID del profesor"
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

        {error && !teacher && <div className="admin-update-error">{error}</div>}

        {/* Update Form */}
        {teacher && (
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
                <label htmlFor="department" className="admin-update-label">
                  Departamento:
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="admin-update-input"
                />
              </div>
            </div>

            {success && <div className="admin-update-success">{success}</div>}

            {error && <div className="admin-update-error">{error}</div>}

            <div className="admin-update-buttons">
              <button
                type="button"
                onClick={() => setTeacher(null)}
                className="admin-update-button-cancel"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="admin-update-button-update"
              >
                {loading ? "Actualizando..." : "Actualizar Profesor"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateTeacher;
