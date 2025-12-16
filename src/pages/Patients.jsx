// admin-panel/src/pages/Patients.jsx
import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './styles/Patients.css';


export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPatients: 0,
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
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, [pagination.currentPage]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (pagination.currentPage !== 1) {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
      } else {
        fetchPatients();
      }
    }, 500);
    
    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [search]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
        search: search.trim()
      };
      
      const response = await adminAPI.getPatients(params);
      
      if (response.success) {
        setPatients(response.data.patients);
        setPagination(response.data.pagination);
        setError('');
      } else {
        setError(response.message || 'Failed to fetch patients');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (patient) => {
    setSelectedPatient(patient);
    setShowStatusModal(true);
  };

  const openDeleteModal = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowStatusModal(false);
    setShowDeleteModal(false);
    setSelectedPatient(null);
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedPatient) return;

    try {
      setActionLoading(selectedPatient._id);
      setShowStatusModal(false);
      
      const response = await adminAPI.toggleUserStatus(selectedPatient._id);
      
      if (response.success) {
        setPatients(prev => 
          prev.map(patient => 
            patient._id === selectedPatient._id 
              ? { ...patient, emailVerified: !selectedPatient.emailVerified }
              : patient
          )
        );
      } else {
        setError(response.message || 'Failed to update status');
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
      setSelectedPatient(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPatient) return;

    try {
      setActionLoading(selectedPatient._id);
      setShowDeleteModal(false);
      
      const response = await adminAPI.deleteUser(selectedPatient._id);
      
      if (response.success) {
        setPatients(prev => prev.filter(patient => patient._id !== selectedPatient._id));
        setPagination(prev => ({ 
          ...prev, 
          totalPatients: prev.totalPatients - 1 
        }));
      } else {
        setError(response.message || 'Failed to delete user');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
      setSelectedPatient(null);
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

  if (loading && patients.length === 0) {
    return <LoadingSpinner text="Loading patients..." />;
  }

  return (
    <>
      <div className="patients-page">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Patients Management</h1>
            <p className="page-subtitle">
              View and manage all registered patients ({pagination.totalPatients} total)
            </p>
          </div>
          <button onClick={fetchPatients} className="refresh-button" title="Refresh data">
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
              placeholder="Search patients by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient._id} className="table-row">
                    <td className="patient-info">
                      <div className="patient-avatar">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="patient-details">
                        <span className="patient-name">{patient.name}</span>
                      </div>
                    </td>
                    <td className="patient-email">{patient.email}</td>
                    <td className="patient-phone">
                      {patient.phone || <span className="no-data">Not provided</span>}
                    </td>
                    <td>
                      <span className={`status-badge ${patient.emailVerified ? 'verified' : 'unverified'}`}>
                        {patient.emailVerified ? (
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
                    <td className="join-date">{formatDate(patient.createdAt)}</td>
                    <td className="actions">
                      <div className="action-buttons">
                        <button
                          onClick={() => openStatusModal(patient)}
                          disabled={actionLoading === patient._id}
                          className={`action-btn ${patient.emailVerified ? 'deactivate' : 'activate'}`}
                          title={patient.emailVerified ? 'Deactivate patient' : 'Activate patient'}
                        >
                          {actionLoading === patient._id ? (
                            <span className="mini-spinner"></span>
                          ) : patient.emailVerified ? (
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
                          onClick={() => openDeleteModal(patient)}
                          disabled={actionLoading === patient._id}
                          className="action-btn delete"
                          title="Delete patient"
                        >
                          {actionLoading === patient._id ? (
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
                        <h3>No patients found</h3>
                        <p>No patients match your search "{search}"</p>
                      </div>
                    ) : (
                      <div className="empty-message">
                        <svg className="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <line x1="23" y1="11" x2="17" y2="11"></line>
                          <line x1="20" y1="8" x2="20" y2="14"></line>
                        </svg>
                        <h3>No patients yet</h3>
                        <p>No patients have registered in the system</p>
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
              <span className="pagination-total">({pagination.totalPatients} total patients)</span>
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
      {showStatusModal && selectedPatient && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className={`modal-icon ${selectedPatient.emailVerified ? 'warning' : 'success'}`}>
                {selectedPatient.emailVerified ? (
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
              <h2>{selectedPatient.emailVerified ? 'Deactivate Patient' : 'Activate Patient'}</h2>
              <button onClick={closeModals} className="modal-close" aria-label="Close modal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <p>
                Are you sure you want to {selectedPatient.emailVerified ? 'deactivate' : 'activate'} <strong>{selectedPatient.name}</strong>?
              </p>
              <p className="modal-subtitle">
                {selectedPatient.emailVerified 
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
                className={`modal-btn ${selectedPatient.emailVerified ? 'warning' : 'success'}`}
              >
                {selectedPatient.emailVerified ? (
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
      {showDeleteModal && selectedPatient && (
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
              <h2>Delete Patient</h2>
              <button onClick={closeModals} className="modal-close" aria-label="Close modal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <p>
                Are you sure you want to permanently delete <strong>{selectedPatient.name}</strong>?
              </p>
              <p className="modal-subtitle">
                This action cannot be undone. All patient data will be permanently removed from the system.
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
                Delete Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}