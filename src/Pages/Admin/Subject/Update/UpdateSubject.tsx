import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../../../DashboardAdmin/Dashboardadmin.css";
import "./UpdateSubject.css";

interface SubjectData {
  name: string;
  credits: number;
  semester: number;
  code: string;
  deparment: string;
}

const UpdateSubject: React.FC = () => {
  const [searchCode, setSearchCode] = useState("");
  const [subject, setSubject] = useState<SubjectData | null>(null);
  const [formData, setFormData] = useState<SubjectData>({
    name: "",
    credits: 0,
    semester: 0,
    code: "",
    deparment: "",
  });
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setSearchCode(codeFromUrl);
      handleSearch(codeFromUrl);
    }
  }, [searchParams]);

  const handleSearch = async (codeToSearch?: string) => {
    const searchValue = codeToSearch || searchCode;
    if (!searchValue.trim()) {
      setError("Por favor ingrese un código válido.");
      return;
    }

    setSearching(true);
    setError("");
    setSuccess("");
    setSubject(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8083/api/subjects/${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("UpdateSubject API Response:", response);
      console.log("UpdateSubject Response data:", response.data);

      let subjectData;
      if (response.data && response.data.data) {
        subjectData = response.data.data;
      } else {
        subjectData = response.data;
      }

      if (!subjectData || !subjectData.code) {
        setError("La materia encontrada no tiene datos válidos");
        return;
      }

      // Adaptar los datos recibidos al nuevo modelo
      const adaptedSubject = {
        name: subjectData.name || "",
        credits: subjectData.credits || 0,
        semester: subjectData.semester || 0,
        code: subjectData.code || "",
        deparment: subjectData.deparment || subjectData.department || "",
      };
      setSubject(adaptedSubject);
      setFormData(adaptedSubject);
    } catch (err: any) {
      console.error("Error buscando materia:", err);
      setError(err.response?.data?.message || "Materia no encontrada");
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
    if (!subject) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `http://localhost:8083/api/admin/subjects/${subject.code}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Materia actualizada exitosamente");
      setTimeout(() => {
        navigate("/admin/subject");
      }, 2000);
    } catch (err: any) {
      console.error("Error actualizando materia:", err);
      setError(err.response?.data?.message || "Error al actualizar la materia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">ACTUALIZAR MATERIA</div>
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
        {/* Search Section */}
        <div className="admin-update-search-section">
          <h2 className="admin-update-search-title">
            Buscar Materia por Código
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="admin-update-search-form"
          >
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Ingresa el código de la materia"
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

        {error && !subject && <div className="admin-update-error">{error}</div>}

        {/* Update Form */}
        {subject && (
          <form onSubmit={handleSubmit} className="admin-update-form">
            <h2 className="admin-update-form-title">Actualizar Información</h2>

            <div className="admin-update-form-grid">
              <div>
                <label htmlFor="code" className="admin-update-label">
                  Código:
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
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
                <label htmlFor="credits" className="admin-update-label">
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
                  min="0"
                  className="admin-update-input"
                />
              </div>

              <div>
                <label htmlFor="deparment" className="admin-update-label">
                  Departamento:
                </label>
                <select
                  id="deparment"
                  name="deparment"
                  value={formData.deparment}
                  onChange={handleChange}
                  required
                  className="admin-update-select"
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

            {success && <div className="admin-update-success">{success}</div>}
            {error && <div className="admin-update-error">{error}</div>}

            <div className="admin-update-buttons">
              <button
                type="button"
                onClick={() => setSubject(null)}
                className="admin-update-button-cancel"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="admin-update-button-update"
              >
                {loading ? "Actualizando..." : "Actualizar Materia"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateSubject;
