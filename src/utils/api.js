// // admin-panel/src/utils/api.js
// import axios from 'axios';

// // Use proxy in development, direct URL in production
// const API_BASE_URL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_URL || 'https://localhost:4000/api');

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   ...(import.meta.env.DEV && {
//     httpsAgent: false,
//     timeout: 10000
//   })
// });

// // Add request interceptor to include auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('admin_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => {
//     return response.data; // This returns the actual data from backend
//   },
//   (error) => {
//     if (!error.response) {
//       console.error('Network Error:', error.message);
//       return Promise.reject(new Error('Network error - please check your connection'));
//     }
    
//     if (error.response?.status === 401) {
//       localStorage.removeItem('admin_token');
//       localStorage.removeItem('admin_user');
//       window.location.href = '/login';
//     }
    
//     const message = error.response?.data?.message || error.message || 'An error occurred';
//     return Promise.reject(new Error(message));
//   }
// );

// // Auth API - Simplified to match your working client-side
// export const authAPI = {
//   login: async (email, password) => {
//     // This will return: { message: "Login successful.", token: "...", user: {...} }
//     const response = await api.post('/auth/login', { email, password });
//     return response;
//   },
  
//   getCurrentUser: async () => {
//     // This will return: { user: {...} }
//     const response = await api.get('/auth/me');
//     return response;
//   }
// };

// // Admin API - Updated to match backend format
// export const adminAPI = {
//   getDashboardStats: async () => {
//     const response = await api.get('/admin/dashboard-stats');
//     return response;
//   },
  
//   getPatients: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const response = await api.get(`/admin/patients?${queryString}`);
//     return response;
//   },
  
//   getDoctors: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const response = await api.get(`/admin/doctors?${queryString}`);
//     return response;
//   },
  
//   toggleUserStatus: async (userId) => {
//     const response = await api.put(`/admin/users/${userId}/toggle-status`);
//     return response;
//   },
  
//   deleteUser: async (userId) => {
//     const response = await api.delete(`/admin/users/${userId}`);
//     return response;
//   },
  
//   getUserById: async (userId) => {
//     const response = await api.get(`/admin/users/${userId}`);
//     return response;
//   }
// };

// export default api;
// admin-panel/src/utils/api.js
import axios from 'axios';

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : (import.meta.env.VITE_API_URL || 'https://quraninstasnap.onrender.com/api');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  ...(import.meta.env.DEV && {
    httpsAgent: false,
    timeout: 10000
  })
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data; // This returns the actual data from backend
  },
  (error) => {
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error - please check your connection'));
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// ===== Auth API =====
export const authAPI = {
  login: async (email, password) => {
    // Returns: { message: "Login successful.", token: "...", user: {...} }
    const response = await api.post('/auth/login', { email, password });
    return response;
  },
  
  getCurrentUser: async () => {
    // Returns: { user: {...} }
    const response = await api.get('/auth/me');
    return response;
  }
};

// ===== Admin API =====
export const adminAPI = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard-stats');
    return response;
  },
  
  // ===== Patients Management =====
  getPatients: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/patients?${queryString}`);
    return response;
  },
  
  // ===== Doctors Management =====
  getDoctors: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/doctors?${queryString}`);
    return response;
  },
  
  // ===== User Management (Patients & Doctors) =====
  toggleUserStatus: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/toggle-status`);
    return response;
  },
  
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response;
  },
  
  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response;
  },
  
  // ===== Appointments Management =====
  getAppointments: async (params = {}) => {
    const queryString = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
      )
    ).toString();
    const response = await api.get(`/admin/appointments${queryString ? `?${queryString}` : ''}`);
    return response;
  },
  
  getAppointmentById: async (appointmentId) => {
    const response = await api.get(`/admin/appointments/${appointmentId}`);
    return response;
  },
  
  updateAppointmentStatus: async (appointmentId, status) => {
    const response = await api.patch(`/admin/appointments/${appointmentId}/status`, { status });
    return response;
  },
  
  deleteAppointment: async (appointmentId) => {
    const response = await api.delete(`/admin/appointments/${appointmentId}`);
    return response;
  },
  
  // ===== Doctor Profile Management =====
  getDoctorProfile: async (doctorId) => {
    const response = await api.get(`/admin/doctors/${doctorId}/profile`);
    return response;
  },
  
  updateDoctorProfileStatus: async (doctorId, status, isVerified) => {
    const response = await api.patch(`/admin/doctors/${doctorId}/profile-status`, { 
      status, 
      isVerified 
    });
    return response;
  },
  
  deleteDoctorProfile: async (doctorId) => {
    const response = await api.delete(`/admin/doctors/${doctorId}/profile`);
    return response;
  },
  
  // ===== Statistics & Analytics =====
  getAppointmentStats: async () => {
    const response = await api.get('/admin/appointments/stats');
    return response;
  },
  
  getDoctorStats: async () => {
    const response = await api.get('/admin/doctors/stats');
    return response;
  },
  
  getPatientStats: async () => {
    const response = await api.get('/admin/patients/stats');
    return response;
  }
};

export default api;