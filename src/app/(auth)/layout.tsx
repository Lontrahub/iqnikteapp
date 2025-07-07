import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col justify-center items-center p-4">
      {children}
    </div>
  );
}
