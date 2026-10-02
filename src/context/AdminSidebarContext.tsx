'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type AdminSidebarContextValue = {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

const AdminSidebarContext = createContext<AdminSidebarContextValue | undefined>(undefined);

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <AdminSidebarContext.Provider value={{ mobileOpen, setMobileOpen }}>{children}</AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const ctx = useContext(AdminSidebarContext);
  if (!ctx) throw new Error('useAdminSidebar must be used within AdminSidebarProvider');
  return ctx;
}
