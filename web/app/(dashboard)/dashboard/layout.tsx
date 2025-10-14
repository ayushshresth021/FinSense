'use client';

import { Sidebar } from '../../../components/shared/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-[240px] px-6 py-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
