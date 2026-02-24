type Variant = 'default' | 'primary' | 'success' | 'warning' | 'error';

const variantClasses: Record<Variant, string> = {
  default: 'bg-white/50 text-gray-700 border-white/30',
  primary: 'bg-primary-500/15 text-primary-700 border-primary-200/50',
  success: 'bg-success/15 text-success-dark border-success/30',
  warning: 'bg-warning/15 text-warning-dark border-warning/30',
  error: 'bg-error/15 text-error-dark border-error/30',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
