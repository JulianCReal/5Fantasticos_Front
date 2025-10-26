import React from "react";
import "./ProfileSidebar.css";
import { useNavigate } from "react-router-dom";


interface ProfileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ open, onClose }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/");
    };

  return (
    <div className={`profile-sidebar-overlay${open ? " open" : ""}`}>
      <div className="profile-sidebar">
        <button className="close-btn" onClick={onClose}>
          <span>&#10005;</span>
        </button>
        <div className="profile-options">
          <div className="profile-option">Configuración</div>
          <div className="profile-option">Mi historial de clases</div>
        </div>
        <div className="profile-logout" onClick={handleLogout} style={{ cursor: "pointer" }}>
          <svg width="28" height="28" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M17 16l4-4-4-4"/>
            <path d="M21 12H9"/>
            <rect x="3" y="5" width="6" height="14" rx="2"/>
          </svg>
          <span>Cerrar Sesión</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
