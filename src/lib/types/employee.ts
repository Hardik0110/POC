export interface Employee {
  id?: string;
  name: string;
  email: string;
  position: string;
  department: string;
  startDate: string;
}

export interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  focusColor?: 'cyan' | 'purple' | 'pink';
  required?: boolean;
}