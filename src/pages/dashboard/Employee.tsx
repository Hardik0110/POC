import { ref, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { rtdb } from '../../lib/utils/firebase';
import type { Employee } from '../../lib/types/employee';
import { Table } from '../../components/Table';
import { Layout } from '../../components/Layout';
import { FormField } from '../../components/FormField';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { StatsCard } from '../../components/StatsCard';
import { EmptyState } from '../../components/EmptyState';
import { useEmployees } from '../../lib/hooks/useEmployees';
import { useEmployeeFilters } from '../../lib/hooks/useEmployeeFilters';

export default function Employees() {
  const { employees } = useEmployees();
  const {
    searchTerm,
    setSearchTerm,
    filterDepartment,
    setFilterDepartment,
    departments,
    filteredEmployees
  } = useEmployeeFilters(employees);
  const navigate = useNavigate();

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

  const newThisYear = employees.filter(emp => {
    const startDate = new Date(emp.startDate);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return startDate > oneYearAgo;
  }).length;

  const departmentOptions = departments.map(dept => ({ value: dept, label: dept }));

  return (
    <Layout
      title="Employee Directory"
      subtitle="Manage and view all your team members in one place"
      showAddButton={true}
    >
      {/* Filters Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="card-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Search Employees">
              <Input
                placeholder="Search by name, email, or position..."
                value={searchTerm}
                onChange={setSearchTerm}
                focusColor="cyan"
              />
            </FormField>
            <FormField label="Filter by Department">
              <Select
                value={filterDepartment}
                onChange={setFilterDepartment}
                options={departmentOptions}
                placeholder="All Departments"
                focusColor="purple"
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard value={employees.length} label="Total Employees" color="cyan" />
          <StatsCard value={departments.length} label="Departments" color="purple" />
          <StatsCard value={filteredEmployees.length} label="Filtered Results" color="pink" />
          <StatsCard value={newThisYear} label="New This Year" color="green" />
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto">
        <div className="card-container">
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
            <EmptyState
              icon="👥"
              title={employees.length === 0 ? 'No Employees Added Yet' : 'No Employees Found'}
              description={employees.length === 0 
                ? 'Get started by adding your first team member.' 
                : 'Try adjusting your search or filter criteria.'}
              actionLabel={employees.length === 0 ? 'Add First Employee' : undefined}
              onAction={employees.length === 0 ? () => navigate('/add-employee') : undefined}
            />
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
    </Layout>
  );
}