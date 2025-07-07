import { ReactNode } from 'react';
import AdminHeader from '@/components/admin-header';
import AdminFooter from '@/components/admin-footer';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
        <AdminHeader />
        <main className="flex-1">
            {children}
        </main>
        <AdminFooter />
    </div>
  );
}
