
import type { ReactNode } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { Toaster } from "@/components/ui/toaster";


export default function LoansLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  );
}
