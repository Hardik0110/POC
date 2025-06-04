import { useState, useEffect } from 'react';
import { ref, remove, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { rtdb } from '../../lib/utils/firebase';
import type { Employee } from '../../lib/types/employee';
import { Table } from '../../components/Table';
import { Header } from '../../components/Header';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const employeesRef = ref(rtdb, 'employees');
    const unsubscribe = onValue(employeesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const employeeList = Object.entries(data).map(([id, values]) => ({
          id, 
          ...(values as Omit<Employee, 'id'>)
        }));
        setEmployees(employeeList);
      } else {
        setEmployees([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await remove(ref(rtdb, `employees/${id}`));
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error deleting employee');
      }
    }
  };

  const handleEdit = (employee: Employee) => {
    navigate('/add-employee', { state: { employee } });
  };

  // department filter
  const departments = [...new Set(employees.map(emp => emp.department))].filter(Boolean);

  // Filtering employees based on search and department
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto p-6">
        <Header />
        
        <div className="mt-8">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300"
            >
              <span className="text-xl">←</span>
              Back to Home
            </button>
            <button
              onClick={() => navigate('/add-employee')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="text-lg">➕</span>
              Add New Employee
            </button>
          </div>

          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Employee Directory
            </h1>
            <p className="text-slate-300 text-lg">Manage and view all your team members in one place</p>
          </div>

          {/* Filters Section */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Search Employees</label>
                  <input
                    type="text"
                    placeholder="Search by name, email, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Filter by Department</label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-cyan-400">{employees.length}</div>
                <div className="text-slate-300 text-sm">Total Employees</div>
              </div>
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-purple-400">{departments.length}</div>
                <div className="text-slate-300 text-sm">Departments</div>
              </div>
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-pink-400">{filteredEmployees.length}</div>
                <div className="text-slate-300 text-sm">Filtered Results</div>
              </div>
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-400">
                  {employees.filter(emp => {
                    const startDate = new Date(emp.startDate);
                    const oneYearAgo = new Date();
                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                    return startDate > oneYearAgo;
                  }).length}
                </div>
                <div className="text-slate-300 text-sm">New This Year</div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="max-w-7xl mx-auto">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-pink-400 to-cyan-500 rounded-full"></div>
                  Team Members ({filteredEmployees.length})
                </h2>
                <div className="text-sm text-slate-300 bg-slate-800/50 px-3 py-1 rounded-full">
                  {searchTerm || filterDepartment ? `Filtered: ${filteredEmployees.length}` : `Total: ${employees.length}`}
                </div>
              </div>
              
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {employees.length === 0 ? 'No Employees Added Yet' : 'No Employees Found'}
                  </h3>
                  <p className="text-slate-300 mb-6">
                    {employees.length === 0 
                      ? 'Get started by adding your first team member.' 
                      : 'Try adjusting your search or filter criteria.'}
                  </p>
                  {employees.length === 0 && (
                    <button
                      onClick={() => navigate('/add-employee')}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Add First Employee
                    </button>
                  )}
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-slate-600">
                  <Table 
                    employees={filteredEmployees}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}