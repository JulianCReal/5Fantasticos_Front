import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SearchDean.css";

interface DeanData {
  id: string;
  name: string;
  faculty: string;
}

const SearchDean: React.FC = () => {
  const [id, setId] = useState("");
  const [dean, setDean] = useState<DeanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim()) {
      setError("Por favor ingresa un ID válido");
      return;
    }

    setLoading(true);
    setError(null);
    setDean(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8083/api/deans/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setDean(response.data.data);
      } else {
        setDean(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Decano no encontrado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">BUSCAR DECANO</div>
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
        <form onSubmit={handleSubmit} className="admin-search-form">
          <h2 className="admin-search-title">Buscar Decano por ID</h2>

          <div>
            <label htmlFor="searchId" className="admin-search-label">
              ID del Decano:
            </label>
            <input
              type="text"
              id="searchId"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              className="admin-search-input"
            />
          </div>

          {error && <div className="admin-search-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="admin-search-button"
          >
            {loading ? "Buscando..." : "Buscar Decano"}
          </button>
        </form>

        {dean && (
          <div className="admin-dean-info">
            <h3 className="admin-dean-info-title">Información del Decano</h3>
            <div className="admin-dean-info-card">
              <div className="admin-dean-info-item">
                <span className="admin-dean-info-label">ID:</span>
                <span className="admin-dean-info-value">{dean.id}</span>
              </div>
              <div className="admin-dean-info-item">
                <span className="admin-dean-info-label">Nombre:</span>
                <span className="admin-dean-info-value">{dean.name}</span>
              </div>
              <div className="admin-dean-info-item">
                <span className="admin-dean-info-label">Facultad:</span>
                <span className="admin-dean-info-value">{dean.faculty}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDean;
