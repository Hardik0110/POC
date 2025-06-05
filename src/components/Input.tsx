import type { InputProps } from "../lib/types/employee";

export function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error = false,
  focusColor = 'cyan',
  required = false 
}: InputProps) {
  const focusColorClass = {
    cyan: 'focus:ring-cyan-400',
    purple: 'focus:ring-purple-400',
    pink: 'focus:ring-pink-400'
  }[focusColor];

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`form-input ${focusColorClass} ${error ? 'border-red-500' : ''}`}
      required={required}
    />
  );
}