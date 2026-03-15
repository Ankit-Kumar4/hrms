import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Employee service

export const employeeService = {
  /**
   * Get all employees
   * @returns {Promise<Array>} List of employees
   */
  getAll: () => api.get('/api/employees'),

  /**
   * Create a new employee
   * @param {Object} employee - Employee data
   * @returns {Promise<Object>} Created employee
   */
  create: (employee) => api.post('/api/employees', employee),

  /**
   * Delete an employee
   * @param {number} id - Employee ID
   * @returns {Promise<Object>} Deletion response
   */
  delete: (id) => api.delete(`/api/employees/${id}`),
};

// Attendance service

export const attendanceService = {
  /**
   * Mark attendance
   * @param {Object} attendance - Attendance data
   * @returns {Promise<Object>} Marked attendance
   */
  mark: (attendance) => api.post('/api/attendance', attendance),

  /**
   * Get attendance for an employee
   * @param {number} employeeId - Employee ID
   * @param {string} date - Optional date filter
   * @returns {Promise<Array>} List of attendance records
   */
  getByEmployee: (employeeId, date = null) => {
    const params = date ? { date } : {};
    return api.get(`/api/attendance/${employeeId}`, { params });
  },

  /**
   * Get attendance summary for an employee
   * @param {number} employeeId - Employee ID
   * @returns {Promise<Object>} Attendance summary
   */
  getSummary: (employeeId) => api.get(`/api/attendance/${employeeId}/summary`),
};