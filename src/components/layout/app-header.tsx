
import { Coins } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/loans" className="mr-6 flex items-center space-x-2">
          <Coins className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-foreground">Nummora</span>
        </Link>
        {/* Future navigation items or user profile can go here */}
      </div>
    </header>
  );
}
