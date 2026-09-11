import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  children,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-stone-200/80 dark:border-stone-800">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
            {title}
          </h1>
          {badge}
        </div>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl">
          {subtitle}
        </p>
      </div>
      {children && (
        <div className="flex items-center gap-2.5 flex-wrap">
          {children}
        </div>
      )}
    </div>
  );
};
