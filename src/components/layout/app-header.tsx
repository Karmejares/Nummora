
'use client';

import { Coins, User, Landmark, LayoutGrid, Wallet } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  const handleWalletConnect = () => {
    // Placeholder for wallet connection logic
    console.log('Connect Wallet clicked');
    // You would typically integrate with a library like ethers.js or web3modal here
    alert('Wallet connection logic to be implemented.');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/loans" className="mr-6 flex items-center space-x-2">
          <Coins className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-foreground">Nummora</span>
        </Link>
        
        <nav className="ml-auto flex items-center space-x-2 sm:space-x-4">
          <Link href="/dashboard" passHref aria-label="Dashboard">
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
              <Landmark className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/sections" passHref aria-label="Sections">
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
              <LayoutGrid className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleWalletConnect} aria-label="Connect Wallet" className="h-9 w-9 sm:h-10 sm:w-10">
            <Wallet className="h-5 w-5" />
          </Button>
          <Link href="/profile" passHref aria-label="Profile">
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
