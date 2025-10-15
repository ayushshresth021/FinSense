import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../components/providers/auth-provider';
import { QueryProvider } from './providers/query-provider';

export const metadata: Metadata = {
  title: 'FinSense - AI-Powered Personal Finance',
  description: 'Track your spending effortlessly with AI and voice input',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}