
import type { Loan } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LoanStatusBadgeProps {
  status: Loan['status'];
}

export function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  let className = '';

  switch (status) {
    case 'active':
      variant = 'default'; // Uses primary color by default
      className = 'bg-primary/10 text-primary border-primary/30';
      break;
    case 'pending':
      className = 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/30'; // Specific amber color
      variant = 'outline';
      break;
    case 'completed':
      className = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/30'; // Specific emerald color
      variant = 'outline';
      break;
  }

  return (
    <Badge variant={variant} className={cn("capitalize", className)}>
      {status}
    </Badge>
  );
}
