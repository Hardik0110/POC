import { useState, useEffect } from 'react';
import { ref, push, update } from 'firebase/database';
import { useNavigate, useLocation } from 'react-router-dom';
import { rtdb } from '../../lib/utils/firebase';
import type { Employee } from '../../lib/types/employee';
import { validateEmployee, validateEmployeeField, type EmployeeFormData } from '../../lib/validations/addEmployee';
import { Layout } from '../../components/Layout';
import { FormField } from '../../components/FormField';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { DEPARTMENT_OPTIONS } from '../../lib/utils/constants';

export default function AddEmployee() {
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '',
    email: '',
    position: '',
    department: '',
    startDate: '',
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.employee) {
      const employee = location.state.employee;
      setFormData({
        name: employee.name,
        email: employee.email,
        position: employee.position,
        department: employee.department,
        startDate: employee.startDate,
      });
      setEditId(employee.id);
    }
  }, [location.state]);

  const validateField = (field: keyof EmployeeFormData, value: unknown) => {
    const result = validateEmployeeField(field, value);
    if (!result.success) {
      setErrors(prev => ({
        ...prev,
        [field]: result.error.errors[0].message
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const validationResult = validateEmployee(formData);
    
    if (!validationResult.success) {
      const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};
      validationResult.error.errors.forEach(error => {
        if (error.path[0]) {
          newErrors[error.path[0] as keyof EmployeeFormData] = error.message;
        }
      });
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      if (editId) {
        const updates = {
          [`employees/${editId}`]: formData
        };
        await update(ref(rtdb), updates);
      } else {
        await push(ref(rtdb, 'employees'), {
          ...formData,
          submittedAt: new Date().toISOString()
        });
      }
      
      setFormData({ name: '', email: '', position: '', department: '', startDate: '' });
      setEditId(null);
      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', position: '', department: '', startDate: '' });
    setEditId(null);
    navigate('/employees');
  };

  return (
    <Layout
      title={editId ? 'Update Employee' : 'Add New Employee'}
      subtitle={editId ? 'Update employee information below' : 'Fill in the details to add a new team member'}
      showEmployeesButton={true}
    >
      <div className="max-w-4xl mx-auto">
        <div className="card-container">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></div>
            Employee Information
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Full Name" error={errors.name} required>
              <Input
                placeholder="Enter full name"
                value={formData.name}
                onChange={(value) => handleChange('name', value)}
                error={!!errors.name}
                focusColor="cyan"
                required
              />
            </FormField>
            
            <FormField label="Email Address" error={errors.email} required>
              <Input
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(value) => handleChange('email', value)}
                error={!!errors.email}
                focusColor="purple"
                required
              />
            </FormField>
            
            <FormField label="Position" error={errors.position} required>
              <Input
                placeholder="Enter position"
                value={formData.position}
                onChange={(value) => handleChange('position', value)}
                error={!!errors.position}
                focusColor="pink"
                required
              />
            </FormField>
            
            <FormField label="Department" error={errors.department} required>
              <Select
                value={formData.department}
                onChange={(value) => handleChange('department', value)}
                options={DEPARTMENT_OPTIONS}
                placeholder="Select Department"
                focusColor="cyan"
                required
              />
            </FormField>
            
            <FormField label="Start Date" error={errors.startDate} required>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(value) => handleChange('startDate', value)}
                error={!!errors.startDate}
                focusColor="purple"
                required
              />
            </FormField>
            
            <div className="md:col-span-2 flex gap-4 justify-end">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} loading={isLoading}>
                {editId ? '✏️ Update Employee' : '➕ Add Employee'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}