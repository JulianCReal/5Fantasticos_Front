import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ListDean.css";

interface DeanData {
  id: string;
  name: string;
  faculty: string;
}

const ListDean: React.FC = () => {
  const [deans, setDeans] = useState<DeanData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeans();
  }, []);

  const fetchDeans = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get("http://localhost:8083/api/deans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let deanData;
      if (response.data && response.data.data) {
        deanData = response.data.data;
      } else {
        deanData = response.data;
      }

      // Ensure deanData is an array
      if (Array.isArray(deanData)) {
        setDeans(deanData);
      } else {
        setDeans([]);
        setError("La respuesta de la API no es un array válido");
      }
    } catch (err: any) {
      console.error("Error obteniendo decanos:", err);
      setError(
        err.response?.data?.message || "Error al obtener la lista de decanos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="admin-dashboard-logo-container">LISTAR DECANOS</div>
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
        <div className="admin-list-container">
          <h2 className="admin-list-title">Lista de Todos los Decanos</h2>

          {loading && (
            <div className="admin-list-loading">Cargando decanos...</div>
          )}

          {error && <div className="admin-list-error">{error}</div>}

          {!loading && !error && deans.length === 0 && (
            <div className="admin-list-empty">No hay decanos registrados</div>
          )}

          {!loading && !error && deans.length > 0 && (
            <div className="admin-deans-list">
              {deans.map((dean) => (
                <div key={dean.id} className="admin-dean-card">
                  <div className="admin-dean-info">
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
                      <span className="admin-dean-info-value">
                        {dean.faculty}
                      </span>
                    </div>
                  </div>
                  <div className="admin-dean-actions">
                    <button
                      onClick={() =>
                        navigate(`/admin/dean/update?id=${dean.id}`)
                      }
                      className="admin-dean-edit-button"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/dean/delete?id=${dean.id}`)
                      }
                      className="admin-dean-delete-button"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="admin-list-actions">
            <button
              onClick={fetchDeans}
              disabled={loading}
              className="admin-list-refresh-button"
            >
              {loading ? "Actualizando..." : "Actualizar Lista"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListDean;
