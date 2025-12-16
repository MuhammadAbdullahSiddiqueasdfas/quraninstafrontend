// admin-panel/src/components/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './styles/AdminLayout.css';

export default function AdminLayout() {
  // Separate states for desktop collapse and mobile open
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    if (!isDesktop) {
      setMobileSidebarOpen(false);
    }
  }, [location, isDesktop]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      
      if (desktop) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen && !isDesktop) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen, isDesktop]);

  const toggleSidebar = () => {
    if (isDesktop) {
      // On desktop, toggle collapsed state
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      // On mobile, toggle open state
      setMobileSidebarOpen(!mobileSidebarOpen);
    }
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      <Navbar onMobileMenuToggle={toggleSidebar} />
      
      <div className="admin-content">
        <Sidebar 
          collapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          isDesktop={isDesktop}
          onClose={closeMobileSidebar}
          onToggle={toggleSidebar}
        />
        
        <main className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <div className="main-content">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile/Tablet sidebar overlay */}
      {mobileSidebarOpen && !isDesktop && (
        <div 
          className="sidebar-overlay"
          onClick={closeMobileSidebar}
          aria-label="Close sidebar"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              closeMobileSidebar();
            }
          }}
        />
      )}
    </div>
  );
}