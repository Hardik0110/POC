import { useState, useEffect } from 'react';
import { ref, push, remove, update, onValue } from 'firebase/database';
import { rtdb, auth } from '../../lib/utils/firebase';
import type { Employee } from '../../lib/types/employee';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '',
    email: '',
    position: '',
    department: '',
    startDate: '',
  });
  const [editId, setEditId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up real-time listener
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

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update existing employee
        const updates = {
          [`employees/${editId}`]: formData
        };
        await update(ref(rtdb), updates);
      } else {
        // Add new employee
        await push(ref(rtdb, 'employees'), {
          ...formData,
          submittedAt: new Date().toISOString()
        });
      }
      setFormData({ name: '', email: '', position: '', department: '', startDate: '' });
      setEditId(null);
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee data');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(ref(rtdb, `employees/${id}`));
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee');
    }
  };

  const handleEdit = (employee: Employee) => {
    setFormData(employee);
    setEditId(employee.id || null);
  };

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="Department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? 'Update Employee' : 'Add Employee'}
        </button>
      </form>

      <div className="grid gap-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="border p-4 rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{employee.name}</h3>
              <p>{employee.email}</p>
              <p>{employee.position} - {employee.department}</p>
              <p>Started: {employee.startDate}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(employee)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => employee.id && handleDelete(employee.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}