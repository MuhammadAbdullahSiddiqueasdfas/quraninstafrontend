// admin-panel/src/pages/Doctors.jsx
import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './styles/Patients.css'; // Shared styles with Patients

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDoctors: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, [pagination.currentPage]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (pagination.currentPage !== 1) {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
      } else {
        fetchDoctors();
      }
    }, 500);
    
    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [search]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
        search: search.trim()
      };
      
      const response = await adminAPI.getDoctors(params);
      
      if (response.success) {
        setDoctors(response.data.doctors);
        setPagination(response.data.pagination);
        setError('');
      } else {
        setError(response.message || 'Failed to fetch doctors');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowStatusModal(true);
  };

  const openDeleteModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowStatusModal(false);
    setShowDeleteModal(false);
    setSelectedDoctor(null);
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedDoctor) return;

    try {
      setActionLoading(selectedDoctor._id);
      setShowStatusModal(false);
      
      const response = await adminAPI.toggleUserStatus(selectedDoctor._id);
      
      if (response.success) {
        setDoctors(prev => 
          prev.map(doctor => 
            doctor._id === selectedDoctor._id 
              ? { ...doctor, emailVerified: !selectedDoctor.emailVerified }
              : doctor
          )
        );
      } else {
        setError(response.message || 'Failed to update status');
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
      setSelectedDoctor(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoctor) return;

    try {
      setActionLoading(selectedDoctor._id);
      setShowDeleteModal(false);
      
      const response = await adminAPI.deleteUser(selectedDoctor._id);
      
      if (response.success) {
        setDoctors(prev => prev.filter(doctor => doctor._id !== selectedDoctor._id));
        setPagination(prev => ({ 
          ...prev, 
          totalDoctors: prev.totalDoctors - 1 
        }));
      } else {
        setError(response.message || 'Failed to delete user');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
      setSelectedDoctor(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && doctors.length === 0) {
    return <LoadingSpinner text="Loading doctors..." />;
  }

  return (
    <>
      <div className="doctors-page">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Doctors Management</h1>
            <p className="page-subtitle">
              View and manage all registered doctors ({pagination.totalDoctors} total)
            </p>
          </div>
          <button onClick={fetchDoctors} className="refresh-button" title="Refresh data">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
        </div>

        {error && (
          <div className="error-alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
            <button onClick={() => setError('')} className="error-close">×</button>
          </div>
        )}

        <div className="table-controls">
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search doctors by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="table-container">
          <table className="doctors-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <tr key={doctor._id} className="table-row">
                    <td className="doctor-info">
                      <div className="doctor-avatar">
                        {doctor.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="doctor-details">
                        <span className="doctor-name">Dr. {doctor.name}</span>
                      </div>
                    </td>
                    <td className="doctor-email">{doctor.email}</td>
                    <td className="doctor-phone">
                      {doctor.phone || <span className="no-data">Not provided</span>}
                    </td>
                    <td>
                      <span className={`status-badge ${doctor.emailVerified ? 'verified' : 'unverified'}`}>
                        {doctor.emailVerified ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Verified
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            Unverified
                          </>
                        )}
                      </span>
                    </td>
                    <td className="join-date">{formatDate(doctor.createdAt)}</td>
                    <td className="actions">
                      <div className="action-buttons">
                        <button
                          onClick={() => openStatusModal(doctor)}
                          disabled={actionLoading === doctor._id}
                          className={`action-btn ${doctor.emailVerified ? 'deactivate' : 'activate'}`}
                          title={doctor.emailVerified ? 'Deactivate doctor' : 'Activate doctor'}
                        >
                          {actionLoading === doctor._id ? (
                            <span className="mini-spinner"></span>
                          ) : doctor.emailVerified ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => openDeleteModal(doctor)}
                          disabled={actionLoading === doctor._id}
                          className="action-btn delete"
                          title="Delete doctor"
                        >
                          {actionLoading === doctor._id ? (
                            <span className="mini-spinner"></span>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-state">
                    {search ? (
                      <div className="empty-message">
                        <svg className="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <h3>No doctors found</h3>
                        <p>No doctors match your search "{search}"</p>
                      </div>
                    ) : (
                      <div className="empty-message">
                        <svg className="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                        <h3>No doctors yet</h3>
                        <p>No doctors have registered in the system</p>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev || loading}
              className="pagination-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Previous
            </button>
            
            <div className="pagination-info">
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
              <span className="pagination-total">({pagination.totalDoctors} total doctors)</span>
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext || loading}
              className="pagination-btn"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Status Toggle Confirmation Modal */}
      {showStatusModal && selectedDoctor && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className={`modal-icon ${selectedDoctor.emailVerified ? 'warning' : 'success'}`}>
                {selectedDoctor.emailVerified ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <h2>{selectedDoctor.emailVerified ? 'Deactivate Doctor' : 'Activate Doctor'}</h2>
              <button onClick={closeModals} className="modal-close" aria-label="Close modal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <p>
                Are you sure you want to {selectedDoctor.emailVerified ? 'deactivate' : 'activate'} <strong>Dr. {selectedDoctor.name}</strong>?
              </p>
              <p className="modal-subtitle">
                {selectedDoctor.emailVerified 
                  ? 'This will mark their account as unverified and may restrict their access.'
                  : 'This will verify their account and grant them full access to the system.'}
              </p>
            </div>
            
            <div className="modal-footer">
              <button onClick={closeModals} className="modal-btn cancel">
                Cancel
              </button>
              <button 
                onClick={handleConfirmToggleStatus}
                className={`modal-btn ${selectedDoctor.emailVerified ? 'warning' : 'success'}`}
              >
                {selectedDoctor.emailVerified ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                    </svg>
                    Deactivate
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Activate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDoctor && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon danger">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </div>
              <h2>Delete Doctor</h2>
              <button onClick={closeModals} className="modal-close" aria-label="Close modal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <p>
                Are you sure you want to permanently delete <strong>Dr. {selectedDoctor.name}</strong>?
              </p>
              <p className="modal-subtitle">
                This action cannot be undone. All doctor data will be permanently removed from the system.
              </p>
            </div>
            
            <div className="modal-footer">
              <button onClick={closeModals} className="modal-btn cancel">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="modal-btn danger">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                Delete Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}