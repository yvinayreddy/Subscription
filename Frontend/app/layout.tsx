import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/auth-context'
import { Header } from '@/components/header'
import './globals.css'

// metadata must be exported from a server component

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: 'PostHub - Share and Discover Premium Content',
  description: 'A content platform for sharing images and discovering premium posts. Subscribe to plans for exclusive content.',
}

import ClientWrapper from '@/components/ClientWrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // server component that simply delegates to client wrapper
  return <ClientWrapper>{children}</ClientWrapper>;
}
