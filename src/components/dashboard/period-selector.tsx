import { type FC, useState } from 'react';

import { Button } from '~/components/common/button';

import type { PeriodType } from '~/types/dashboard';

interface PeriodSelectorProps {
  value: PeriodType;
  onChange: (value: PeriodType) => void;
}

const periodOptions = [
  { value: 'today', label: 'Today' },
  { value: '3days', label: '3 Days' },
  { value: '7days', label: '7 Days' },
  { value: '1month', label: '1 Month' },
  { value: '1quarter', label: '3 Months' },
  { value: '6months', label: '6 Months' },
  { value: '1year', label: '1 Year' },
  { value: 'all', label: 'All Time' }
] as const;

export const PeriodSelector: FC<PeriodSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLabel = periodOptions.find((option) => option.value === value)?.label || '7 Days';

  return (
    <div className="relative">
      <Button className="w-[140px] justify-between" variant="outline" onClick={() => setIsOpen(!isOpen)}>
        {currentLabel}
        <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              className={`w-full px-3 py-2 text-left text-sm first:rounded-t-md last:rounded-b-md hover:bg-gray-50 ${option.value === value ? 'bg-blue-50 font-medium text-blue-600' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
