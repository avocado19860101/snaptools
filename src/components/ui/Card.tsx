import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({ children, hover = false, padding = 'md', className = '', ...props }: CardProps) {
  return (
    <div
      className={`glass rounded-2xl ${paddingClasses[padding]} ${hover ? 'hover:bg-white/80 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
