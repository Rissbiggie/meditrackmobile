import React from 'react';
import { cn } from '@/lib/utils';

interface HeartbeatProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function Heartbeat({ className, size = 'md', ...props }: HeartbeatProps) {
  const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div
      className={cn(
        'relative animate-heartbeat',
        sizeMap[size],
        className
      )}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M12 2L12 22M2 12L22 12"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
} 