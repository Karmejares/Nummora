
import type { LenderLoan } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, CircleDollarSign, Clock, Briefcase, Info, CalendarDays, Percent } from 'lucide-react';
import { LoanStatusBadge } from './loan-status-badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface LoanCardProps {
  loan: LenderLoan;
}

function formatCurrency(amount: number, currencyCode: string) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateString?: string) {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: es });
  } catch (error) {
    return 'Fecha inválida';
  }
}

export function LoanCard({ loan }: LoanCardProps) {
  const nameInitials = loan.borrowerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
    
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center space-x-4 pb-3">
        <Avatar className="h-12 w-12">
          {loan.borrowerAvatar && <AvatarImage src={loan.borrowerAvatar} alt={loan.borrowerName} data-ai-hint="person portrait" />}
          <AvatarFallback className="bg-muted text-muted-foreground font-semibold">{nameInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center">
            {loan.borrowerName}
            {loan.isVerified && (
              <CheckCircle2 className="ml-2 h-5 w-5" style={{ color: 'hsl(var(--highlight-green))' }} />
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">Prestatario</p>
        </div>
        <LoanStatusBadge status={loan.status} />
      </CardHeader>
      <CardContent className="flex-grow space-y-3 pt-3">
        <div className="text-3xl font-bold text-primary">
          {formatCurrency(loan.amount, loan.currency)}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Percent className="h-4 w-4" />
            <span>Tasa Interés: {loan.interestRate}% EA</span>
          </div>
          {loan.collateral && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>Colateral: {loan.collateral}</span>
            </div>
          )}

          {loan.status === 'active' && loan.termEndDate && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Vence: {formatDate(loan.termEndDate)}</span>
            </div>
          )}
          {loan.status === 'pending' && loan.dueDate && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Pagar Antes de: {formatDate(loan.dueDate)}</span>
            </div>
          )}
          {loan.status === 'completed' && loan.paidDate && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Pagado: {formatDate(loan.paidDate)}</span>
            </div>
          )}
        </div>
        {loan.contractAddress && (
            <p className="text-xs text-muted-foreground/70 pt-2">
                Contrato (simulado): {loan.contractAddress.substring(0,10)}...
            </p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full">
          <Info className="mr-2 h-4 w-4" style={{ color: 'hsl(var(--dark-purple-text))' }}/>
          <span style={{ color: 'hsl(var(--dark-purple-text))' }}>Expandir</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
