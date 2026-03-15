import { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Table from '../components/Table';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import ErrorBanner from '../components/ErrorBanner';
import { employeeService } from '../services/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ employee_id: '', full_name: '', email: '', department: '' });
  const [formErrors, setFormErrors] = useState({});

  const departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.getAll();
      setEmployees(res.data);
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.employee_id.trim()) errors.employee_id = 'Employee ID is required';
    if (!form.full_name.trim() || form.full_name.length < 2) errors.full_name = 'Full name must be at least 2 characters';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email format';
    if (!form.department) errors.department = 'Department is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await employeeService.create(form);
      setModalOpen(false);
      setForm({ employee_id: '', full_name: '', email: '', department: '' });
      setFormErrors({});
      fetchEmployees();
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to create employee');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await employeeService.delete(deleteId);
      setConfirmOpen(false);
      setDeleteId(null);
      fetchEmployees();
    } catch (err) {
      setError('Failed to delete employee');
    }
  };

  const columns = [
    { key: 'employee_id', label: 'Employee ID' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
  ];

  const actions = (row) => (
    <button onClick={() => { setDeleteId(row.id); setConfirmOpen(true); }} className="text-red-600 hover:text-red-900">Delete</button>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
        <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Employee</button>
      </div>
      {employees.length > 0 ? (
        <Table columns={columns} data={employees} actions={actions} />
      ) : (
        <EmptyState message="No employees found. Add your first employee." />
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setFormErrors({}); }}>
        <h2 className="text-xl font-bold mb-4">Add Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Employee ID</label>
            <input type="text" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            {formErrors.employee_id && <p className="text-red-500 text-sm">{formErrors.employee_id}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            {formErrors.full_name && <p className="text-red-500 text-sm">{formErrors.full_name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
              <option value="">Select Department</option>
              {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
            {formErrors.department && <p className="text-red-500 text-sm">{formErrors.department}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">Add Employee</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} message="Are you sure you want to delete this employee? This action cannot be undone." />

    </div>
  );
};

export default Employees;