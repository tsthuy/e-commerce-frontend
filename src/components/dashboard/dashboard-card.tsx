import { type ReactElement } from 'react';

import { cn } from '~/libs/tailwind.lib';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: ReactElement;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, subtitle, trend, className }) => {
  return (
    <div className={cn('rounded-xl border bg-card p-6 text-card-foreground shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-2 space-y-1">
        <p className="text-3xl font-bold leading-none">{value}</p>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        {trend && (
          <div className="flex items-center space-x-1">
            <span className={cn('text-sm font-medium', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
              {trend.isPositive ? '+' : ''}
              {trend.value}
            </span>
            <span className="text-sm text-muted-foreground">from last period</span>
          </div>
        )}
      </div>
    </div>
  );
};
