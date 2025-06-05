import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
  
  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(50, 'Email must not exceed 50 characters'),

  position: z.string()
    .min(2, 'Position must be at least 2 characters')
    .max(50, 'Position must not exceed 50 characters'),
  
  department: z.enum(['frontend', 'backend', 'aiml'], {
    errorMap: () => ({ message: 'Please select a valid department' })
  }),
  
  startDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      return selectedDate <= today;
    }, 'Start date cannot be in the future')
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

export const validateEmployee = (data: unknown) => {
  return employeeSchema.safeParse(data);
};

export const validateEmployeeField = (field: keyof EmployeeFormData, value: unknown) => {
  const fieldSchema = employeeSchema.shape[field];
  return fieldSchema.safeParse(value);
};