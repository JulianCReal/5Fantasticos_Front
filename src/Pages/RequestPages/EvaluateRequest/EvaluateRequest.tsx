import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EvaluateRequest.css";
import { useNavigate } from "react-router-dom";

const showMessage = (message: string) => console.log(`[MESSAGE]: ${message}`);

const EvaluateRequest: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [deanOffice, setDeanOffice] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  const navigate = useNavigate();
  const handleBack = () => navigate("/dashboardDean");

  useEffect(() => {
    const fetchRequests = async () => {
      const token = sessionStorage.getItem('token');
      const userProfileString = sessionStorage.getItem('userProfile');
      if (!userProfileString) return;
      const userProfile = JSON.parse(userProfileString);
      const faculty = userProfile.career || userProfile.faculty;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      setDeanOffice(faculty);

      const resRequests = await axios.get(
        `http://localhost:8083/api/requests/deanOffice/${faculty}`, config
      );
      setRequests(resRequests.data || []);
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleShowDetail = (req: any) => setSelected(req);
  const handleCloseDetail = () => setSelected(null);

  const handleEvaluate = async (requestId: string, decision: "APPROVED" | "REJECTED") => {
    try {
      const token = sessionStorage.getItem("token");
      const userProfileString = sessionStorage.getItem('userProfile');
      if (!userProfileString) {
        showMessage("Error: No se encontró el perfil del usuario. Por favor, inicie sesión nuevamente.");
        return;
      }
      const userProfile = JSON.parse(userProfileString);
      const userId = userProfile.studentId || userProfile.id || userProfile.profileId;

      await axios.patch(
        `http://localhost:8083/api/deans/${userId}/requests/${requestId}/resolve`,
        null, // <--- nada en el body
        {
            params: {
            responseMessage: "Solicitud evaluada", 
            status: decision === "APPROVED"
            },
            headers: { Authorization: `Bearer ${token}` }
        }
      );
      setRequests(prev => prev.map(r => r.requestId === requestId ? { ...r, requestStateName: decision } : r));
      setSelected(null);
    } catch (error) {
      alert("Error evaluando solicitud");
    }
  };

  return (
    <div className="solicitudes-main-bg">
      <div className="solicitudes-header-bar">
        <button className="sol-back-btn" onClick={handleBack}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#8b0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1 className="solicitudes-title">Solicitudes en {deanOffice}</h1>
      </div>
      <div className="solicitudes-cards-container">
        {loading ? (
          <div className="solicitudes-loading">Cargando...</div>
        ) : (
          requests.length === 0 ? (
            <div className="solicitudes-empty">No hay solicitudes pendientes.</div>
          ) : (
            requests.map(r => (
              <div className="solicitud-card" key={r.requestId}>
                <div className="sol-card-row">
                  <span className="sol-card-label">Tipo:</span>
                  <span className="sol-card-type">{r.requestType}</span>
                </div>
                <div className="sol-card-row">
                  <span className="sol-card-label">Estado:</span>
                  <span className={"sol-card-state " + r.requestStateName.toLowerCase()}>{r.requestStateName}</span>
                </div>
                <div className="sol-card-row">
                  <span className="sol-card-label">Autor:</span>
                  <span className="sol-card-value">{r.userId}</span>
                </div>
                <div className="sol-card-row">
                  <span className="sol-card-label">Fecha Últ. Resp.:</span>
                  <span className="sol-card-value">
                    {r.historyResponses && Object.keys(r.historyResponses).length
                      ? new Date(Object.keys(r.historyResponses).pop()!).toLocaleString()
                      : "-"}
                  </span>
                </div>
                <div className="sol-card-actions">
                  <button className="sol-btn-primary" onClick={() => handleShowDetail(r)}>Más info</button>
                </div>
              </div>
            ))
          )
        )}
      </div>
      {/* Modal Detalle */}
      {selected && (
        <div className="sol-modal-backdrop">
          <div className="sol-modal-content">
            <h3>Detalle de Solicitud</h3>
            <div className="sol-modal-field"><b>Tipo:</b> {selected.requestType}</div>
            <div className="sol-modal-field"><b>Estado:</b> {selected.requestStateName}</div>
            <div className="sol-modal-field"><b>Autor:</b> {selected.userId}</div>
            <div className="sol-modal-field"><b>Decanatura:</b> {selected.deanOffice}</div>
            <div className="sol-modal-field"><b>Observaciones:</b> {selected.observations || "-"}</div>
            <div className="sol-modal-field"><b>Histórico de Respuestas:</b>
              <ul>
                {selected.historyResponses && Object.entries(selected.historyResponses).map(([date, msg]) => (
                  <li key={date}>
                    {new Date(date).toLocaleString()}: {(msg as string)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="sol-modal-actions">
              <button className="sol-btn-secondary" onClick={handleCloseDetail}>Cerrar</button>
              <button className="sol-btn-green" onClick={() => handleEvaluate(selected.requestId, "APPROVED")}>Aprobar</button>
              <button className="sol-btn-red" onClick={() => handleEvaluate(selected.requestId, "REJECTED")}>Rechazar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EvaluateRequest;
