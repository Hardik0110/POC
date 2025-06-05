import type { ReactNode } from "react";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'gradient' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

export interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

export interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  showEmployeesButton?: boolean;
  showAddButton?: boolean;
}

interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  focusColor?: 'cyan' | 'purple' | 'pink';
  required?: boolean;
}

export interface StatsCardProps {
  value: number;
  label: string;
  color: 'cyan' | 'purple' | 'pink' | 'green';
}