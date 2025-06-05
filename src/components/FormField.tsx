import type { FormFieldProps } from '../lib/types/types';

export function FormField({ label, error, children, required = false }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="form-label">
        {label} {required && '*'}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}