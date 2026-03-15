import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Table from '../components/Table';
import Badge from '../components/Badge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorBanner from '../components/ErrorBanner';
import { employeeService, attendanceService } from '../services/api';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState({ total_present: 0, total_absent: 0, total_days: 0 });
  const [date, setDate] = useState(new Date());
  const [status, setStatus] = useState('Present');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await employeeService.getAll();
      setEmployees(res.data);
    } catch (err) {
      setError('Failed to load employees');
    }
  };

  const handleMarkAttendance = async () => {
    if (!selectedEmployee) {
      setError('Please select an employee');
      return;
    }
    try {
      await attendanceService.mark({
        employee_id: parseInt(selectedEmployee),
        date: date.toISOString().split('T')[0],
        status,
      });
      fetchAttendance();
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to mark attendance');
      }
    }
  };

  const fetchAttendance = async () => {
    if (!selectedEmployee) return;
    setLoading(true);
    try {
      const attRes = await attendanceService.getByEmployee(selectedEmployee);
      setAttendance(attRes.data);
      const sumRes = await attendanceService.getSummary(selectedEmployee);
      setSummary(sumRes.data);
    } catch (err) {
      setError('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedEmployee]);

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: (row) => <Badge status={row.status} /> },
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Attendance</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
              <option value="">Select Employee</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <DatePicker selected={date} onChange={(date) => setDate(date)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="mt-1">
              <label className="inline-flex items-center">
                <input type="radio" value="Present" checked={status === 'Present'} onChange={(e) => setStatus(e.target.value)} className="form-radio" />
                <span className="ml-2">Present</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input type="radio" value="Absent" checked={status === 'Absent'} onChange={(e) => setStatus(e.target.value)} className="form-radio" />
                <span className="ml-2">Absent</span>
              </label>
            </div>
          </div>
          <div className="flex items-end">
            <button onClick={handleMarkAttendance} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Mark Attendance</button>
          </div>
        </div>
      </div>
      {selectedEmployee && (
        <div>
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Total Present: {summary.total_present}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-4">Attendance History</h2>
          {attendance.length > 0 ? (
            <Table columns={columns} data={attendance} />
          ) : (
            <EmptyState message="No attendance records found." />
          )}
        </div>
      )}
    </div>
  );
};

export default Attendance;