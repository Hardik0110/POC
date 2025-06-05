import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../../lib/utils/firebase';
import type { Employee } from '../../lib/types/employee';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { employees, loading };
}