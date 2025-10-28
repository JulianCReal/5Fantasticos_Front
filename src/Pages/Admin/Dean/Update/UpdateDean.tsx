import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./UpdateDean.css";

interface DeanData {
  id: string;
  name: string;
  faculty: string;
}

const UpdateDean: React.FC = () => {
  const [searchId, setSearchId] = useState("");
  const [dean, setDean] = useState<DeanData | null>(null);
  const [formData, setFormData] = useState<DeanData>({
    id: "",
    name: "",
    faculty: "",
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
    setDean(null);
    setFormData({
      id: "",
      name: "",
      faculty: "",
    });

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

      let deanData;
      if (response.data && response.data.data) {
        deanData = response.data.data;
      } else {
        deanData = response.data;
      }
      setDean(deanData);
      setFormData(deanData);
    } catch (err: any) {
      console.error("Error buscando decano:", err);
      setError(err.response?.data?.message || "Decano no encontrado");
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
    if (!dean) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = sessionStorage.getItem("token");
      await axios.put(
        `http://localhost:8083/api/admin/deans/${dean.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Decano actualizado exitosamente");
      setTimeout(() => {
        navigate("/admin/dean");
      }, 2000);
    } catch (err: any) {
      console.error("Error actualizando decano:", err);
      setError(err.response?.data?.message || "Error al actualizar decano");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">ACTUALIZAR DECANO</div>
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
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        {/* Search Section */}
        <div className="admin-update-search-section">
          <h2 className="admin-update-search-title">Buscar Decano por ID</h2>
          <form onSubmit={handleSearch} className="admin-update-search-form">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Ingresa el ID del decano"
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

        {error && !dean && <div className="admin-update-error">{error}</div>}

        {/* Update Form */}
        {dean && (
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
                <label htmlFor="faculty" className="admin-update-label">
                  Facultad:
                </label>
                <input
                  type="text"
                  id="faculty"
                  name="faculty"
                  value={formData.faculty}
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
                onClick={() => setDean(null)}
                className="admin-update-button-cancel"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="admin-update-button-update"
              >
                {loading ? "Actualizando..." : "Actualizar Decano"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateDean;
