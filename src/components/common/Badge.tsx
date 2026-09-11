import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'rose' | 'sky' | 'purple' | 'stone' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  size = 'sm',
  className = '',
  dot = false,
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    sky: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60',
    stone: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
    orange: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60',
  };

  const dotStyles = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    sky: 'bg-sky-500',
    purple: 'bg-purple-500',
    stone: 'bg-stone-400',
    orange: 'bg-orange-500',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border whitespace-nowrap transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
};

export const getStatusBadge = (status: string) => {
  const normalized = status?.toLowerCase() || '';
  if (normalized === 'planted') return <Badge variant="sky" dot>Planted</Badge>;
  if (normalized === 'vegetative') return <Badge variant="emerald" dot>Vegetative</Badge>;
  if (normalized === 'flowering') return <Badge variant="amber" dot>Flowering</Badge>;
  if (normalized === 'harvesting') return <Badge variant="orange" dot>Harvesting</Badge>;
  if (normalized === 'completed') return <Badge variant="stone" dot>Completed</Badge>;

  if (normalized === 'pending') return <Badge variant="amber" dot>Pending Review</Badge>;
  if (normalized === 'in progress') return <Badge variant="sky" dot>In Progress</Badge>;
  if (normalized === 'resolved') return <Badge variant="emerald" dot>Resolved</Badge>;
  if (normalized === 'closed') return <Badge variant="stone" dot>Closed</Badge>;

  if (normalized === 'critical') return <Badge variant="rose" dot>Critical</Badge>;
  if (normalized === 'high') return <Badge variant="orange" dot>High Urgency</Badge>;
  if (normalized === 'medium') return <Badge variant="amber" dot>Medium</Badge>;
  if (normalized === 'low') return <Badge variant="stone" dot>Low</Badge>;

  return <Badge variant="stone">{status}</Badge>;
};
