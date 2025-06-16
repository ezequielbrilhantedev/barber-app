'use client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/context/AuthContext';
import { ReactNode } from 'react';

export function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </AuthProvider>
  );
}
