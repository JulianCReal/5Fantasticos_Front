import React, { useState, useMemo } from "react";
import "./AcademicTrafficLight.css";
import {
  Zap, Gauge, Star, Clock, CheckCircle, AlertTriangle, XCircle,
  ChevronDown, ChevronUp, BookOpen, Hash, GraduationCap, Calendar
} from "lucide-react";

// --- 1. Definición de Tipos y Datos ---
type AcademicStatus = 'ON_TRACK' | 'AT_RISK' | 'DELAYED';
type CourseStatusType = 'APPROVED' | 'PENDING' | 'REPROBATED' | 'IN_PROGRESS';

interface CourseStatus {
  id: number;
  code: string;
  name: string;
  credits: number;
  grade: number | null;
  status: CourseStatusType;
  prerequisites: string[];
  semester: number;
}

interface AcademicTrafficLightData {
  studentId: string;
  progressPercentage: number;
  cumulativeAverage: number;
  approvedCredits: number;
  totalCreditsAttempted: number;
  overallStatus: AcademicStatus;
  lastUpdated: string;
  careerName: string;
  currentSemester: number;
}

const mockData: AcademicTrafficLightData = {
  studentId: 'ST-2023001',
  progressPercentage: 55,
  cumulativeAverage: 3.5,
  approvedCredits: 10,
  totalCreditsAttempted: 18,
  overallStatus: 'AT_RISK',
  lastUpdated: new Date().toISOString(),
  careerName: 'Ingeniería de Sistemas (Plan 2025)',
  currentSemester: 2,
};

const mockCourseData: CourseStatus[] = [
  // SEMESTRE 1
  { id: 1, code: 'CALD', name: 'Cálculo Diferencial', credits: 3, grade: 4.0, status: 'APPROVED', prerequisites: [], semester: 1 },
  { id: 2, code: 'IPRO', name: 'Introducción a la Programación', credits: 3, grade: 3.8, status: 'APPROVED', prerequisites: [], semester: 1 },
  { id: 3, code: 'FCO1', name: 'Fundamentos de la Comunicación 1', credits: 2, grade: 3.5, status: 'APPROVED', prerequisites: [], semester: 1 },
  { id: 4, code: 'PRI1IS', name: 'Proyecto Integrador 1 - Introducción a la Ingeniería de Sistemas', credits: 3, grade: 4.2, status: 'APPROVED', prerequisites: [], semester: 1 },
  { id: 5, code: 'LYMD', name: 'Lógica y Matemáticas Discretas', credits: 4, grade: 3.9, status: 'APPROVED', prerequisites: [], semester: 1 },

  // SEMESTRE 2 (Actual - en progreso)
  { id: 6, code: 'CALI', name: 'Cálculo Integral', credits: 3, grade: null, status: 'IN_PROGRESS', prerequisites: ['CALD'], semester: 2 },
  { id: 7, code: 'DDYA', name: 'Diseño de Datos y Algoritmos', credits: 4, grade: null, status: 'IN_PROGRESS', prerequisites: ['IPRO'], semester: 2 },
  { id: 8, code: 'MPIN', name: 'Matemáticas para Informática', credits: 3, grade: null, status: 'IN_PROGRESS', prerequisites: ['CALD'], semester: 2 },
  { id: 9, code: 'CIPP', name: 'Colombia: Realidad, Inst. Políticas y Paz', credits: 2, grade: null, status: 'IN_PROGRESS', prerequisites: [], semester: 2 },
  { id: 10, code: 'CLE1', name: 'Curso de Libre Elección 1', credits: 2, grade: null, status: 'IN_PROGRESS', prerequisites: [], semester: 2 },

  // SEMESTRE 3 (Pendientes)
  { id: 11, code: 'CALV', name: 'Cálculo Vectorial', credits: 3, grade: null, status: 'PENDING', prerequisites: ['CALI'], semester: 3 },
  { id: 12, code: 'ALLI', name: 'Álgebra Lineal', credits: 3, grade: null, status: 'PENDING', prerequisites: ['CALD'], semester: 3 },
  { id: 13, code: 'FIS1', name: 'Física 1', credits: 3, grade: null, status: 'PENDING', prerequisites: ['CALI'], semester: 3 },
  { id: 14, code: 'ODSC', name: 'Organización de los Sistemas de Cómputo', credits: 3, grade: null, status: 'PENDING', prerequisites: ['IPRO'], semester: 3 },
  { id: 15, code: 'CLE2', name: 'Curso de Libre Elección 2', credits: 3, grade: null, status: 'PENDING', prerequisites: [], semester: 3 },

  // SEMESTRE 4
  { id: 16, code: 'ECDI', name: 'Ecuaciones Diferenciales', credits: 3, grade: null, status: 'PENDING', prerequisites: ['CALI'], semester: 4 },
  { id: 17, code: 'FIS2', name: 'Física 2', credits: 3, grade: null, status: 'PENDING', prerequisites: ['FIS1'], semester: 4 },
  { id: 18, code: 'DOPO', name: 'Desarrollo Orientado por Objetos', credits: 4, grade: null, status: 'PENDING', prerequisites: ['DDYA'], semester: 4 },
  { id: 19, code: 'TPYC', name: 'Teoría de la Programación y la Computación', credits: 3, grade: null, status: 'PENDING', prerequisites: ['DDYA'], semester: 4 },
  { id: 20, code: 'CLE3', name: 'Curso de Libre Elección 3', credits: 2, grade: null, status: 'PENDING', prerequisites: [], semester: 4 },

  // SEMESTRE 5
  { id: 21, code: 'PTIA', name: 'Principios y Tecnologías IA', credits: 3, grade: null, status: 'PENDING', prerequisites: ['MPIN'], semester: 5 },
  { id: 22, code: 'MYSD', name: 'Modelos y Servicios de Datos', credits: 4, grade: null, status: 'PENDING', prerequisites: ['DDYA'], semester: 5 },
  { id: 23, code: 'PRI2IS', name: 'Proyecto Integrador 2 - Estrategia de Organizaciones y Procesos', credits: 3, grade: null, status: 'PENDING', prerequisites: ['PRI1IS'], semester: 5 },
  { id: 24, code: 'FUEC', name: 'Fundamentos Económicos', credits: 2, grade: null, status: 'PENDING', prerequisites: [], semester: 5 },
  { id: 25, code: 'CLE4', name: 'Curso de Libre Elección 4', credits: 3, grade: null, status: 'PENDING', prerequisites: [], semester: 5 },

  // SEMESTRE 6
  { id: 26, code: 'FDSI', name: 'Fundamentos de Seguridad de la Información', credits: 3, grade: null, status: 'PENDING', prerequisites: ['ODSC'], semester: 6 },
  { id: 27, code: 'DOSW', name: 'Desarrollo y Operaciones Software', credits: 4, grade: null, status: 'PENDING', prerequisites: ['DOPO'], semester: 6 },
  { id: 28, code: 'AYSR', name: 'Arquitectura y Servicios de Red', credits: 4, grade: null, status: 'PENDING', prerequisites: ['ODSC'], semester: 6 },
  { id: 29, code: 'ET01', name: 'Electiva Técnica 1', credits: 3, grade: null, status: 'PENDING', prerequisites: [], semester: 6 },
  { id: 30, code: 'CLE5', name: 'Curso de Libre Elección 5', credits: 2, grade: null, status: 'PENDING', prerequisites: [], semester: 6 },

  // SEMESTRE 7
  { id: 31, code: 'TDSE', name: 'Transformación Digital y Soluciones Empresariales', credits: 4, grade: null, status: 'PENDING', prerequisites: ['PRI2IS'], semester: 7 },
  { id: 32, code: 'ARSW', name: 'Arquitecturas de Software', credits: 4, grade: null, status: 'PENDING', prerequisites: ['DOSW'], semester: 7 },
  { id: 33, code: 'SWNT', name: 'Innovación Software Apoyada en Nuevas Tecnologías', credits: 4, grade: null, status: 'PENDING', prerequisites: ['DOSW'], semester: 7 },
  { id: 34, code: 'ET02', name: 'Electiva Técnica 2', credits: 3, grade: null, status: 'PENDING', prerequisites: [], semester: 7 },
  { id: 35, code: 'CLE6', name: 'Curso de Libre Elección 6', credits: 2, grade: null, status: 'PENDING', prerequisites: [], semester: 7 },

  // SEMESTRE 8
  { id: 36, code: 'PRYE', name: 'Probabilidad y Estadística', credits: 3, grade: null, status: 'PENDING', prerequisites: ['CALI'], semester: 8 },
  { id: 37, code: 'FUPR', name: 'Fundamentos de Proyectos', credits: 2, grade: null, status: 'PENDING', prerequisites: [], semester: 8 },
  { id: 38, code: 'ET03', name: 'Electiva Técnica 3', credits: 3, grade: null, status: 'PENDING', prerequisites: [], semester: 8 },
  { id: 39, code: 'CLE7', name: 'Curso de Libre Elección 7', credits: 3, grade: null, status: 'PENDING', prerequisites: [], semester: 8 },
  { id: 40, code: 'CLE8', name: 'Curso de Libre Elección 8', credits: 3, grade: null, status: 'PENDING', prerequisites: [], semester: 8 },

  // SEMESTRE 9 (Opción de Grado)
  { id: 41, code: 'SOGR', name: 'Seminario de Opción de Grado', credits: 2, grade: null, status: 'PENDING', prerequisites: [], semester: 9 },
  { id: 42, code: 'OGR1', name: 'Opción de Grado 1', credits: 3, grade: null, status: 'PENDING', prerequisites: [], semester: 9 },
  { id: 43, code: 'OGR2', name: 'Opción de Grado 2', credits: 3, grade: null, status: 'PENDING', prerequisites: [], semester: 9 },
  { id: 44, code: 'OGR3', name: 'Opción de Grado 3', credits: 3, grade: null, status: 'PENDING', prerequisites: [], semester: 9 },
  { id: 45, code: 'OGR4', name: 'Opción de Grado 4', credits: 3, grade: null, status: 'PENDING', prerequisites: [], semester: 9 },
  { id: 46, code: 'CLE9', name: 'Curso de Libre Elección 9', credits: 2, grade: null, status: 'PENDING', prerequisites: [], semester: 9 },
];

const groupCoursesBySemester = (courses: CourseStatus[]) =>
  courses.reduce((acc, course) => {
    (acc[course.semester] ||= []).push(course);
    return acc;
  }, {} as Record<number, CourseStatus[]>);

// --- 2. Componente del Semáforo ---
const TrafficLightIcon: React.FC<{ status: AcademicStatus }> = ({ status }) => {
  const config = useMemo(() => {
    switch (status) {
      case "ON_TRACK": return { class: "status-ontrack", label: "Óptimo (En Curso)", Icon: CheckCircle };
      case "AT_RISK": return { class: "status-atrisk", label: "En Riesgo", Icon: AlertTriangle };
      case "DELAYED": return { class: "status-delayed", label: "Crítico (Retrasado)", Icon: XCircle };
      default: return { class: "status-atrisk", label: "Sin Datos", Icon: Zap };
    }
  }, [status]);

  const Icon = config.Icon;
  return (
    <div className="traffic-light">
      <div className={`traffic-circle ${config.class}`}>
        <Icon size={40} />
      </div>
      <p>{config.label}</p>
    </div>
  );
};

// --- 3. Componente Principal ---
const AcademicTrafficLightApp: React.FC = () => {
  const [data, setData] = useState(mockData);
  const [showCourses, setShowCourses] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRecalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newStatus: AcademicStatus =
        data.overallStatus === "ON_TRACK" ? "AT_RISK" :
        data.overallStatus === "AT_RISK" ? "DELAYED" : "ON_TRACK";

      setData(prev => ({
        ...prev,
        overallStatus: newStatus,
        cumulativeAverage: newStatus === "ON_TRACK" ? 4.1 : newStatus === "AT_RISK" ? 3.3 : 2.7,
        progressPercentage: newStatus === "ON_TRACK" ? 80 : newStatus === "AT_RISK" ? 55 : 30,
        lastUpdated: new Date().toISOString(),
      }));
      setIsLoading(false);
    }, 1500);
  };

  const grouped = groupCoursesBySemester(mockCourseData);

  return (
    <div className="academic-container">
      <div className="academic-content">
        <header className="academic-header">
          <h1>Semáforo Académico</h1>
          <span>ID de Estudiante: {data.studentId}</span>
        </header>

        <div className="academic-card">
          <div className="career-title">
            <GraduationCap size={20} style={{ marginRight: 8 }} />
            <span>{data.careerName}</span>
          </div>

          <h2 style={{ textAlign: "center", marginBottom: 20 }}>Estado General del Plan de Estudios</h2>
          <TrafficLightIcon status={data.overallStatus} />

          <div className="metric-container">
            <div className="metric-card">
              <h3>Semestre Actual</h3>
              <p>{data.currentSemester}</p>
              <small>Estás cursando el semestre {data.currentSemester}</small>
            </div>
            <div className="metric-card">
              <h3>Promedio Acumulado</h3>
              <p>{data.cumulativeAverage.toFixed(2)}</p>
              <small>Basado en todas las asignaturas cursadas</small>
            </div>
            <div className="metric-card">
              <h3>Progreso del Plan</h3>
              <p>{data.progressPercentage}%</p>
              <small>Créditos: {data.approvedCredits}/{data.totalCreditsAttempted}</small>
            </div>
            <div className="metric-card">
              <h3>Créditos Aprobados</h3>
              <p>{data.approvedCredits}</p>
              <small>Total de créditos aprobados</small>
            </div>
          </div>

          <button
            className="toggle-btn"
            onClick={() => setShowCourses(!showCourses)}
          >
            Ver Detalle de Materias ({mockCourseData.length})
            {showCourses ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showCourses && (
            <table className="course-table">
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Créditos</th>
                  <th>Nota</th>
                  <th>Prerrequisitos</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(grouped).map((key) => (
                  <React.Fragment key={key}>
                    <tr className="semester-header">
                      <td colSpan={5}>SEMESTRE {key} {Number(key) === data.currentSemester && <span>(Actual)</span>}</td>
                    </tr>
                    {grouped[Number(key)].map(course => (
                      <tr key={course.id}>
                        <td>{course.name} <br /><small>{course.code}</small></td>
                        <td>{course.credits}</td>
                        <td>{course.grade ?? "-"}</td>
                        <td>{course.prerequisites.length ? course.prerequisites.join(", ") : "Ninguno"}</td>
                        <td>{course.status}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <footer className="academic-footer">
          <span>Última actualización: {new Date(data.lastUpdated).toLocaleString()}</span>
          <button
            onClick={handleRecalculate}
            className={`recalculate-btn ${isLoading ? 'disabled' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "Recalculando..." : "Recalcular Estado"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AcademicTrafficLightApp;