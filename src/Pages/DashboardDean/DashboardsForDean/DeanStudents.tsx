import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DeanStudents.css";
import { useNavigate } from "react-router-dom";

const DeanStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [faculty, setFaculty] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const handleBack = () => navigate("/dashboardDean");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const userProfileString = sessionStorage.getItem("userProfile");
        if (!userProfileString) return;

        const userProfile = JSON.parse(userProfileString);
        const career = userProfile.career || userProfile.faculty;
        setFaculty(career);

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const resStudents = await axios.get(
          `http://localhost:8083/api/students/career/${career}`,
          config
        );

        console.log("🔥 Axios full response:", resStudents);
        console.log("📦 API JSON body:", resStudents.data);
        console.log("🎯 Array:", resStudents.data?.data);

        // ✅ Accede correctamente al arreglo de estudiantes
        const array = resStudents.data?.data;

        if (Array.isArray(array)) {
          setStudents(array);
        } else {
          console.error("Expected array, got:", array);
          setStudents([]); // evita romper el render
        }
      } catch (error) {
        console.error("❌ Error fetching students:", error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="solicitudes-main-bg">
      <div className="solicitudes-header-bar">
        <button className="sol-back-btn" onClick={handleBack}>
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="none"
            stroke="#8b0000"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1 className="solicitudes-title">Estudiantes en {faculty}</h1>
      </div>

      <div className="solicitudes-cards-container">
        {loading ? (
          <div className="solicitudes-loading">Cargando...</div>
        ) : Array.isArray(students) && students.length > 0 ? (
          // ✅ Mapeo seguro de estudiantes
          students.map((student) => (
            <div
              className="solicitud-card dean-student-card"
              key={student.studentId || student.id}
            >
              <div className="sol-card-row">
                <span className="sol-card-label">ID:</span>
                <span className="sol-card-type">
                  {student.studentId || student.id}
                </span>
              </div>
              <div className="sol-card-row">
                <span className="sol-card-label">Nombre:</span>
                <span className="sol-card-value">{student.name}</span>
              </div>
              {student.email && (
                <div className="sol-card-row">
                  <span className="sol-card-label">Email:</span>
                  <span className="sol-card-value">{student.email}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="solicitudes-empty">No hay estudiantes registrados.</div>
        )}
      </div>
    </div>
  );
};

export default DeanStudents;
