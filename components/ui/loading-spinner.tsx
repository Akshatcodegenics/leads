interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="relative">
      <div className={`animate-spin rounded-full border-3 border-gray-200 border-t-blue-600 shadow-lg ${sizeClasses[size]} ${className}`} />
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-pulse ${sizeClasses[size]}`}></div>
    </div>
  );
}
