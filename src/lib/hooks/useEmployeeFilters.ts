import { useMemo, useState } from 'react';
import type { Employee } from '../../lib/types/employee';

export function useEmployeeFilters(employees: Employee[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const departments = useMemo(() => 
    [...new Set(employees.map(emp => emp.department))].filter(Boolean),
    [employees]
  );

  const filteredEmployees = useMemo(() => 
    employees.filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
      return matchesSearch && matchesDepartment;
    }),
    [employees, searchTerm, filterDepartment]
  );

  return {
    searchTerm,
    setSearchTerm,
    filterDepartment,
    setFilterDepartment,
    departments,
    filteredEmployees
  };
}