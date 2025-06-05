import type { ButtonProps } from "../lib/types/types";

export function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'gradient',
  disabled = false,
  loading = false 
}: ButtonProps) {
  const baseClass = "px-8 py-3 font-semibold rounded-xl transition-all duration-300";
  const variantClass = variant === 'gradient' 
    ? "gradient-button hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative"
    : "bg-slate-700 text-white hover:bg-slate-600";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClass} ${variantClass}`}
    >
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      <span className={variant === 'gradient' ? 'relative' : ''}>
        {loading ? '⏳ Loading...' : children}
      </span>
    </button>
  );
}