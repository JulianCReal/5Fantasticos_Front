import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-red-800 text-white p-4 flex justify-between items-center shadow-md"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center space-x-2"
      >
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-red-800 font-bold text-sm">S</span>
        </div>
        <h1 className="text-2xl font-bold tracking-wide">SIHRA</h1>
      </motion.div>
      <div className="flex space-x-4">
        <Link to="/" className="hover:text-gray-200 transition-all duration-200">
          🏠 Inicio
        </Link>
        <Link to="/horario" className="hover:text-gray-200 transition-all duration-200">
          📅 Mi Horario
        </Link>
        <Link to="/solicitudes" className="hover:text-gray-200 transition-all duration-200">
          📋 Solicitudes
        </Link>
      </div>
    </motion.nav>
  );
}

function Home() {
  const items = [
    { 
      title: "Mi Horario", 
      path: "/horario", 
      icon: "📅",
      description: "Consulta y gestiona tu horario académico",
      color: "from-blue-500 to-blue-600"
    },
    { 
      title: "Solicitudes", 
      path: "/solicitudes", 
      icon: "📋",
      description: "Realiza y consulta tus solicitudes académicas", 
      color: "from-green-500 to-green-600"
    },
    { 
      title: "Semáforo Académico", 
      path: "/semaforo", 
      icon: "🚦",
      description: "Visualiza tu estado académico actual",
      color: "from-purple-500 to-purple-600"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 animate-fade-in"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-red-800">
            ¡Bienvenido al Portal SIHRA!
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu sistema integral para la gestión académica de la Escuela Colombiana de Ingeniería
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 gap-6"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-red-700 text-center group cursor-pointer"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-6">{item.description}</p>
              <Link
                to={item.path}
                className="inline-block bg-red-700 text-white py-2 px-6 rounded-lg hover:bg-red-800 transition-all duration-300 font-semibold"
              >
                Acceder →
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function Horario() {
  const clases = [
    { 
      hora: "08:00 - 10:00", 
      materia: "Matemáticas I", 
      profesor: "Dr. González",
      aula: "Aula 201",
      creditos: 3
    },
    { 
      hora: "10:00 - 12:00", 
      materia: "Programación", 
      profesor: "Ing. Rodríguez",
      aula: "Lab. 305",
      creditos: 4
    },
    { 
      hora: "14:00 - 16:00", 
      materia: "Redes", 
      profesor: "Dr. Martínez",
      aula: "Aula 102",
      creditos: 3
    },
  ];

  const totalCreditos = clases.reduce((sum, clase) => sum + clase.creditos, 0);

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-8 animate-fade-in"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-red-800">Mi Horario Académico</h2>
          <p className="text-lg text-gray-600">
            Período actual: 2025-1 | Total créditos: <span className="font-bold text-red-600">{totalCreditos}</span>
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-700 text-white">
                  <th className="p-4 text-left font-semibold">⏰ Horario</th>
                  <th className="p-4 text-left font-semibold">📚 Materia</th>
                  <th className="p-4 text-left font-semibold">👨‍🏫 Profesor</th>
                  <th className="p-4 text-left font-semibold">🏢 Aula</th>
                  <th className="p-4 text-left font-semibold">⭐ Créditos</th>
                </tr>
              </thead>
              <tbody>
                {clases.map((clase, i) => (
                  <motion.tr 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="border-b hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="p-4 font-medium text-gray-800">{clase.hora}</td>
                    <td className="p-4">
                      <span className="font-semibold text-red-700">{clase.materia}</span>
                    </td>
                    <td className="p-4 text-gray-600">{clase.profesor}</td>
                    <td className="p-4 text-gray-600">{clase.aula}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {clase.creditos}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-red-800 transition-all duration-300 font-semibold shadow-md"
          >
            📅 Planificar nuevo horario
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold shadow-md"
          >
            📄 Descargar PDF
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function Solicitudes() {
  const solicitudes = [
    { 
      id: 1, 
      tipo: "Cambio de grupo", 
      estado: "Pendiente",
      fecha: "15/10/2025",
      descripcion: "Solicitud de cambio al grupo 02 de Matemáticas I"
    },
    { 
      id: 2, 
      tipo: "Revisión de nota", 
      estado: "Aprobada",
      fecha: "12/10/2025",
      descripcion: "Revisión de calificación del parcial de Programación"
    },
    { 
      id: 3, 
      tipo: "Cancelación", 
      estado: "Rechazada",
      fecha: "10/10/2025",
      descripcion: "Cancelación de materia Redes por motivos personales"
    },
  ];

  const getEstadoColor = (estado) => {
    switch(estado) {
      case "Aprobada": return "bg-green-600";
      case "Rechazada": return "bg-red-600";
      case "Pendiente": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getEstadoIcon = (estado) => {
    switch(estado) {
      case "Aprobada": return "✅";
      case "Rechazada": return "❌";
      case "Pendiente": return "⏳";
      default: return "📋";
    }
  };

  return (
    <motion.div 
      initial={{ y: 30, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-8 animate-fade-in"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-red-800">Mis Solicitudes</h2>
          <p className="text-lg text-gray-600">
            Historial y estado de tus solicitudes académicas
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          {solicitudes.map((solicitud, i) => (
            <motion.div
              key={solicitud.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getEstadoIcon(solicitud.estado)}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Solicitud #{solicitud.id}: {solicitud.tipo}
                    </h3>
                    <p className="text-gray-600 text-sm">Fecha: {solicitud.fecha}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getEstadoColor(solicitud.estado)}`}>
                  {solicitud.estado}
                </span>
              </div>
              <p className="text-gray-700 mb-4">{solicitud.descripcion}</p>
              <div className="flex space-x-2">
                <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                  Ver detalles
                </button>
                {solicitud.estado === "Pendiente" && (
                  <button className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm hover:bg-red-200 transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-700 text-white px-8 py-4 rounded-lg hover:bg-red-800 transition-all duration-300 font-semibold shadow-lg text-lg"
          >
            ➕ Crear nueva solicitud
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/horario" element={<Horario />} />
            <Route path="/solicitudes" element={<Solicitudes />} />
          </Routes>
        </main>
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="bg-red-800 text-white text-center py-6"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-800 font-bold text-sm">ECI</span>
                </div>
                <span className="font-semibold">Sistema SIHRA</span>
              </div>
              <div className="text-sm opacity-90">
                <p>Escuela Colombiana de Ingeniería Julio Garavito © 2025</p>
                <p className="text-xs mt-1">Todos los derechos reservados</p>
              </div>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="hover:text-gray-200 transition-colors">Ayuda</a>
                <a href="#" className="hover:text-gray-200 transition-colors">Contacto</a>
                <a href="#" className="hover:text-gray-200 transition-colors">Términos</a>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </Router>
  );
}
