import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./TeacherInfo.css";

interface TeacherData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  specialization?: string;
}

const TeacherInfo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const userProfile = JSON.parse(sessionStorage.getItem("userProfile") || "{}");
        const teacherId = userProfile.id;

        if (!token || !teacherId) {
          navigate("/");
          return;
        }

        const response = await axios.get(`http://localhost:8083/api/teachers/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTeacherData(response.data.data || response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching teacher info:", err);
        setError("Error al cargar la información del profesor");
        setLoading(false);
      }
    };

    fetchTeacherInfo();
  }, [navigate]);

  const handleGoBack = () => {
    navigate("/dashboardTeacher");
  };

  if (loading) {
    return (
      <div className="teacher-info-container">
        <div className="loading">Cargando información...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-info-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleGoBack}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-info-container">
      <header className="teacher-info-header">
        <h1>Mi Información</h1>
        <button className="back-button" onClick={handleGoBack} title="Volver al Dashboard">
          ←
        </button>
      </header>

      <div className="teacher-info-content">
        {teacherData ? (
          <div className="info-card">
            <div className="info-section">
              <h2>Datos Personales</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Nombre:</label>
                  <p>{teacherData.firstName} {teacherData.lastName}</p>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <p>{teacherData.email}</p>
                </div>
                {teacherData.phone && (
                  <div className="info-item">
                    <label>Teléfono:</label>
                    <p>{teacherData.phone}</p>
                  </div>
                )}
                {teacherData.department && (
                  <div className="info-item">
                    <label>Departamento:</label>
                    <p>{teacherData.department}</p>
                  </div>
                )}
                {teacherData.specialization && (
                  <div className="info-item">
                    <label>Especialidad:</label>
                    <p>{teacherData.specialization}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="no-data">No se encontró información del profesor</div>
        )}
      </div>
    </div>
  );
};

export default TeacherInfo;
