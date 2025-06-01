
"use client";

import type { LenderLoanStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoanFiltersProps {
  currentFilter: LenderLoanStatus;
  onFilterChange: (filter: LenderLoanStatus) => void;
}

const filters: { label: string; value: LenderLoanStatus }[] = [
  { label: 'Activos', value: 'active' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Terminados', value: 'completed' },
];

export function LoanFilters({ currentFilter, onFilterChange }: LoanFiltersProps) {
  return (
    <div className="flex space-x-2 rounded-md bg-muted p-1">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            'w-full justify-center px-4 py-2 text-sm font-medium',
            currentFilter === filter.value
              ? 'bg-background shadow-sm text-primary hover:bg-background'
              : 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
          )}
          style={currentFilter === filter.value ? { 
            color: 'hsl(var(--primary))', // Uses primary for active filter text
            boxShadow: `0 2px 0 0 hsl(var(--active-filter-indicator))` // Bottom border with active indicator color
          } : {}}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
