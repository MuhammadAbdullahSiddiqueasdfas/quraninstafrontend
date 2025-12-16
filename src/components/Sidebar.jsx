// // admin-panel/src/components/Sidebar.jsx
// import { NavLink } from 'react-router-dom';
// import './styles/Sidebar.css';

// export default function Sidebar({ collapsed, mobileOpen, isDesktop, onClose, onToggle }) {
//   const menuItems = [
//     {
//       path: '/dashboard',
//       icon: (
//         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <rect x="3" y="3" width="7" height="7"></rect>
//           <rect x="14" y="3" width="7" height="7"></rect>
//           <rect x="14" y="14" width="7" height="7"></rect>
//           <rect x="3" y="14" width="7" height="7"></rect>
//         </svg>
//       ),
//       label: 'Dashboard',
//       description: 'Overview & Statistics'
//     },
//     {
//       path: '/patients',
//       icon: (
//         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
//           <circle cx="8.5" cy="7" r="4"></circle>
//           <line x1="23" y1="11" x2="17" y2="11"></line>
//           <line x1="20" y1="8" x2="20" y2="14"></line>
//         </svg>
//       ),
//       label: 'Patients',
//       description: 'Manage Patients'
//     },
//     {
//       path: '/doctors',
//       icon: (
//         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
//           <circle cx="9" cy="7" r="4"></circle>
//           <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
//           <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
//         </svg>
//       ),
//       label: 'Doctors',
//       description: 'Manage Doctors'
//     }
//   ];

//   const sidebarClasses = `sidebar 
//     ${isDesktop && collapsed ? 'sidebar-collapsed' : ''} 
//     ${!isDesktop && mobileOpen ? 'sidebar-mobile-open' : ''}`;

//   return (
//     <aside className={sidebarClasses}>
//       <div className="sidebar-content">
//         <nav className="sidebar-nav">
//           <div className="nav-section">
//             {!collapsed && <h3 className="nav-section-title">Main Menu</h3>}
//             <ul className="nav-list">
//               {menuItems.map((item) => (
//                 <li key={item.path} className="nav-item">
//                   <NavLink
//                     to={item.path}
//                     className={({ isActive }) => 
//                       `nav-link ${isActive ? 'nav-link-active' : ''}`
//                     }
//                     onClick={onClose}
//                     title={collapsed ? item.label : ''}
//                   >
//                     <span className="nav-icon">{item.icon}</span>
//                     {!collapsed && (
//                       <div className="nav-text">
//                         <span className="nav-label">{item.label}</span>
//                         <span className="nav-description">{item.description}</span>
//                       </div>
//                     )}
//                   </NavLink>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </nav>

//         {/* Toggle Button at Bottom - Only on Desktop */}
//         {isDesktop && (
//           <div className="sidebar-footer">
//             <button 
//               onClick={onToggle}
//               className={`sidebar-toggle-btn ${collapsed ? 'collapsed' : ''}`}
//               aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//               title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
//             >
//               <span className="toggle-icon">
//                 {collapsed ? (
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <polyline points="9 18 15 12 9 6"></polyline>
//                   </svg>
//                 ) : (
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <polyline points="15 18 9 12 15 6"></polyline>
//                   </svg>
//                 )}
//               </span>
//               {!collapsed && <span className="toggle-text">Collapse</span>}
//             </button>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }

// admin-panel/src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import './styles/Sidebar.css';

export default function Sidebar({ collapsed, mobileOpen, isDesktop, onClose, onToggle }) {
  const menuItems = [
    {
      path: '/dashboard',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
      label: 'Dashboard',
      description: 'Overview & Statistics'
    },
    {
      path: '/patients',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="23" y1="11" x2="17" y2="11"></line>
          <line x1="20" y1="8" x2="20" y2="14"></line>
        </svg>
      ),
      label: 'Patients',
      description: 'Manage Patients'
    },
    {
      path: '/doctors',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      label: 'Doctors',
      description: 'Manage Doctors'
    },
    {
      path: '/appointments',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      label: 'Appointments',
      description: 'View All Appointments'
    }
  ];

  const sidebarClasses = `sidebar 
    ${isDesktop && collapsed ? 'sidebar-collapsed' : ''} 
    ${!isDesktop && mobileOpen ? 'sidebar-mobile-open' : ''}`;

  return (
    <aside className={sidebarClasses}>
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <div className="nav-section">
            {!collapsed && <h3 className="nav-section-title">Main Menu</h3>}
            <ul className="nav-list">
              {menuItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'nav-link-active' : ''}`
                    }
                    onClick={onClose}
                    title={collapsed ? item.label : ''}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!collapsed && (
                      <div className="nav-text">
                        <span className="nav-label">{item.label}</span>
                        <span className="nav-description">{item.description}</span>
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {isDesktop && (
          <div className="sidebar-footer">
            <button 
              onClick={onToggle}
              className={`sidebar-toggle-btn ${collapsed ? 'collapsed' : ''}`}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span className="toggle-icon">
                {collapsed ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                )}
              </span>
              {!collapsed && <span className="toggle-text">Collapse</span>}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}