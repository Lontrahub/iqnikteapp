import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col justify-center items-center p-4 bg-muted/40">
      {children}
    </div>
  );
}
