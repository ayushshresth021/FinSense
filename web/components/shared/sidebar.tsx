'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lightbulb, Plus, LogOut } from 'lucide-react';
import { useAuthStore } from '../../app/lib/store/auth';
import { useState } from 'react';
import { AddExpenseModal } from './add-expense-modal';
import Image from 'next/image';
import LogoImage from '@/assets/logo.jpg';

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      name: 'Insights',
      href: '/dashboard/insights',
      icon: Lightbulb,
    },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[rgb(var(--color-bg-secondary))] border-r border-[rgb(var(--color-border-primary))] flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-6 border-b border-[rgb(var(--color-border-primary))]">
          <Image
            src={LogoImage}
            alt="FinSense logo"
            width={40}
            height={40}
            className="object-contain rounded-lg"
          />
          <span className="text-xl font-bold">FinSense</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    isActive
                      ? 'bg-[rgb(var(--color-bg-hover))] text-primary'
                      : 'text-secondary hover:bg-[rgb(var(--color-bg-tertiary))] hover:text-primary'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Add Expense Button */}
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all mt-4"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Expense</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[rgb(var(--color-border-primary))]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-[rgb(var(--color-bg-tertiary))] hover:text-primary transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />
    </>
  );
}