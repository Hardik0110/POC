import { useState, useEffect } from 'react';
import { ref, push, update } from 'firebase/database';
import { useNavigate, useLocation } from 'react-router-dom';
import { rtdb } from '../../lib/utils/firebase';
import type { Employee } from '../../lib/types/employee';
import { Header } from '../../components/Header';
import { validateEmployee, validateEmployeeField, type EmployeeFormData } from '../../lib/validations/addEmployee';

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
      
      // Reset form
      setFormData({ name: '', email: '', position: '', department: '', startDate: '' });
      setEditId(null);
      
      // Navigate to employees page after successful submission
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
              onClick={() => navigate('/employees')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-xl text-slate-300 hover:text-white hover:border-slate-500 transition-all duration-300"
            >
              <span className="text-lg">👥</span>
              View All Employees
            </button>
          </div>

          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              {editId ? 'Update Employee' : 'Add New Employee'}
            </h1>
            <p className="text-slate-300 text-lg">
              {editId ? 'Update employee information below' : 'Fill in the details to add a new team member'}
            </p>
          </div>

          {/* Form Section */}
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></div>
                Employee Information
              </h2>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-800/50 border ${
                      errors.name ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300`}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email Address *</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-800/50 border ${
                      errors.email ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Position *</label>
                  <input
                    type="text"
                    placeholder="Enter position"
                    value={formData.position}
                    onChange={(e) => handleChange('position', e.target.value)}
                    className={`w-full px-4 py-3 bg-slate-800/50 border ${
                      errors.position ? 'border-red-500' : 'border-slate-600'
                    } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300`}
                    required
                  />
                  {errors.position && (
                    <p className="text-red-400 text-sm mt-1">{errors.position}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                    required
                  >
                    <option value="" className="bg-slate-800">Select Department</option>
                    <option value="frontend" className="bg-slate-800">Frontend</option>
                    <option value="backend" className="bg-slate-800">Backend</option>
                    <option value="aiml" className="bg-slate-800">AI/ML</option>
                  </select>
                  {errors.department && (
                    <p className="text-red-400 text-sm mt-1">{errors.department}</p>
                  )}
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 cursor-pointer"
                    required
                  />
                  {errors.startDate && (
                    <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>
                  )}
                </div>
                
                <div className="md:col-span-2 flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative px-8 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center gap-2">
                      {isLoading ? (
                        <>⏳ Saving...</>
                      ) : (
                        editId ? '✏️ Update Employee' : '➕ Add Employee'
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}