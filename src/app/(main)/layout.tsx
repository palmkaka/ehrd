'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { LarkSidebar } from '@/components/layout/LarkSidebar';
import { initializeMockData } from '@/lib/mock-data';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { setActiveModule, user, setUser } = useAppStore();

  // Initialize mock data once
  useEffect(() => {
    const initData = async () => {
      try {
        await initializeMockData();
      } catch (error) {
        console.error('Failed to initialize mock data:', error);
      }
    };
    
    initData();
  }, []);

  // Set active module based on current pathname
  useEffect(() => {
    if (pathname.includes('/chat')) {
      setActiveModule('chat');
    } else if (pathname.includes('/docs')) {
      setActiveModule('docs');
    } else if (pathname.includes('/calendar')) {
      setActiveModule('calendar');
    } else if (pathname.includes('/contacts')) {
      setActiveModule('contacts');
    } else if (pathname.includes('/tasks')) {
      setActiveModule('tasks');
    }
  }, [pathname, setActiveModule]);

  // Initialize mock user (TODO: Replace with Firebase Auth)
  useEffect(() => {
    if (!user) {
      setUser({
        id: 'user-1',
        email: 'user@example.com',
        displayName: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        companyId: 'company-1',
      });
    }
  }, [user, setUser]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <LarkSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden ml-20 lg:ml-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
