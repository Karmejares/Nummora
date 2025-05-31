"use client";

import {
  Coins,
  User,
  Landmark,
  LayoutGrid,
  Wallet,
  Repeat,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import TransactionsDrawer from "./transactionsDrawer";

export function AppHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Detectamos si el usuario está en la vista de prestatario o prestamista
  const isBorrower = pathname.startsWith("/borrower");

  // Define a dónde redirigir según el rol actual
  const switchHref = isBorrower ? "/loans" : "/borrower";
  const switchLabel = isBorrower
    ? "Cambiar a Prestamista"
    : "Cambiar a Prestatario";
  const switchIcon = isBorrower ? (
    <Landmark className="h-5 w-5" />
  ) : (
    <User className="h-5 w-5" />
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/loans" className="mr-6 flex items-center space-x-2">
          <Coins className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-foreground">Nummora</span>
        </Link>

        <nav className="ml-auto flex items-center space-x-2 sm:space-x-4">
          <Link href="/dashboard" passHref aria-label="Dashboard">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
            >
              <Landmark className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/sections" passHref aria-label="Sections">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
          </Link>

          {/* 🔁 Switch de rol */}
          <Link href={switchHref} passHref aria-label={switchLabel}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
            >
              {switchIcon}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Connect Wallet"
            className="h-9 w-9 sm:h-10 sm:w-10"
            onClick={() => setDrawerOpen(true)}
          >
            <Wallet className="h-5 w-5" />
          </Button>

          <Link href="/profile" passHref aria-label="Profile">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </nav>
      </div>

      <TransactionsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </header>
  );
}
