import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import Table from '../components/Table';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { employeeService, attendanceService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalEmployees: 0, presentToday: 0, absentToday: 0 });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesRes = await employeeService.getAll();
        const employees = employeesRes.data;
        setStats(prev => ({ ...prev, totalEmployees: employees.length }));
        // Get recent 5
        setRecentEmployees(employees.slice(-5).reverse());

        // For present/absent today, need to get today's attendance
        const today = new Date().toISOString().split('T')[0];
        let present = 0, absent = 0;
        for (const emp of employees) {
          try {
            const attRes = await attendanceService.getByEmployee(emp.id, today);
            const att = attRes.data;
            if (att.length > 0) {
              if (att[0].status === 'Present') present++;
              else absent++;
            }
          } catch (err) {
            // No attendance for today
          }
        }
        setStats(prev => ({ ...prev, presentToday: present, absentToday: absent }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { key: 'employee_id', label: 'ID' },
    { key: 'full_name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Department' },
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Employees" value={stats.totalEmployees} icon={<div className="h-8 w-8 text-blue-500">👥</div>} />
        <StatCard title="Present Today" value={stats.presentToday} icon={<div className="h-8 w-8 text-green-500">✅</div>} />
        <StatCard title="Absent Today" value={stats.absentToday} icon={<div className="h-8 w-8 text-red-500">❌</div>} />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Employees</h2>
        {recentEmployees.length > 0 ? (
          <Table columns={columns} data={recentEmployees} />
        ) : (
          <EmptyState message="No employees added yet." />
        )}
      </div>
    </div>
  );
};

export default Dashboard;