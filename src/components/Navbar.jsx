// admin-panel/src/components/Navbar.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './styles/Navbar.css';

export default function Navbar({ onMobileMenuToggle }) {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          {/* Mobile Hamburger Menu - Only visible on mobile */}
          <button 
            onClick={onMobileMenuToggle}
            className="mobile-menu-toggle"
            aria-label="Toggle mobile menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="navbar-brand">
            <div className="brand-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <div className="brand-text">
              <h1>Medical Admin</h1>
              <span>Management Panel</span>
            </div>
          </div>
        </div>

        <div className="navbar-right">
          <div className="admin-info">
            <div className="admin-avatar">
              <div className="avatar-inner">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            </div>
            <div className="admin-details">
              <span className="admin-name">{user?.name || 'Admin'}</span>
              <span className="admin-role">Administrator</span>
            </div>
          </div>
          
          <button 
            onClick={handleLogoutClick}
            className="logout-button"
            title="Logout"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={handleCancelLogout}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </div>
              <h2>Confirm Logout</h2>
              <button 
                onClick={handleCancelLogout}
                className="modal-close"
                aria-label="Close modal"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <p>Are you sure you want to logout from the admin panel?</p>
              <p className="modal-subtitle">You will need to login again to access the system.</p>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={handleCancelLogout}
                className="modal-btn cancel"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmLogout}
                className="modal-btn confirm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}