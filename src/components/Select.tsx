import type { SelectProps } from "../lib/types/types";

export function Select({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Select an option',
  focusColor = 'cyan',
  required = false 
}: SelectProps) {
  const focusColorClass = {
    cyan: 'focus:ring-cyan-400',
    purple: 'focus:ring-purple-400',
    pink: 'focus:ring-pink-400'
  }[focusColor];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 appearance-none cursor-pointer ${focusColorClass}`}
      required={required}
    >
      <option value="" className="bg-slate-800">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value} className="bg-slate-800">
          {option.label}
        </option>
      ))}
    </select>
  );
}