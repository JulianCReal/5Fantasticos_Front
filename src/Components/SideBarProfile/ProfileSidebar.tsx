import React, { useState, useEffect } from "react";
import "./ProfileSidebar.css";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  department?: string;
}

interface ProfileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile>({});

  useEffect(() => {
    const profileData = sessionStorage.getItem('userProfile');
    if (profileData) {
      setUserProfile(JSON.parse(profileData));
    }
  }, []);

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
          <div className="profile-info">
            <div className="profile-field">
              <strong>ID:</strong> {userProfile.id || 'N/A'}
            </div>
            <div className="profile-field">
              <strong>Nombre:</strong> {userProfile.name || 'N/A'}
            </div>
            <div className="profile-field">
              <strong>Departamento:</strong> {userProfile.department || 'N/A'}
            </div>
          </div>
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
