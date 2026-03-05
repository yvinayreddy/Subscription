"use client";

import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/auth-context';
import { Header } from '@/components/header';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  // remove unexpected attributes that may be injected by browser extensions
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('crxemulator');
    }
  }, []);

  return (
    // suppressHydrationWarning prevents console errors when attributes differ
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AuthProvider>
          <Header />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Toaster position="bottom-right" richColors />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
