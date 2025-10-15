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
      <aside className="fixed left-0 top-0 h-screen w-[200px] bg-[rgb(var(--color-bg-secondary))] border-r border-[rgb(var(--color-border-primary))] flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-[rgb(var(--color-border-primary))]">
          <Image
            src={LogoImage}
            alt="FinSense logo"
            width={32}
            height={32}
            className="object-contain rounded-lg"
          />
          <span className="text-lg font-semibold">FinSense</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2.5 px-3 py-2 rounded-md transition-all duration-200 text-sm
                  ${
                    isActive
                      ? 'bg-[rgb(var(--color-bg-hover))] text-primary shadow-sm'
                      : 'text-secondary hover:bg-[rgb(var(--color-bg-tertiary))] hover:text-primary'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}

          {/* Add Expense Button */}
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md bg-gradient-to-r from-[#003566] to-[#001d3d] text-white hover:from-[#004a8a] hover:to-[#002a5a] transition-all duration-200 mt-3 shadow-sm text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[rgb(var(--color-border-primary))]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-secondary hover:bg-[rgb(var(--color-bg-tertiary))] hover:text-primary transition-all duration-200 text-sm"
          >
            <LogOut className="w-4 h-4" />
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