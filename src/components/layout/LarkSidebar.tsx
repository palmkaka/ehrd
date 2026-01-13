'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import {
  Menu,
  X,
  MessageCircle,
  FileText,
  Calendar,
  Users,
  CheckSquare,
  ChevronDown,
  LogOut,
  Settings,
} from 'lucide-react';

export const LarkSidebar: React.FC = () => {
  const router = useRouter();
  const { activeModule, setActiveModule, sidebarCollapsed, toggleSidebar, user } = useAppStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const modules = [
    { id: 'chat' as const, label: 'Chat', icon: MessageCircle, path: '/chat' },
    { id: 'docs' as const, label: 'Docs', icon: FileText, path: '/docs' },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar, path: '/calendar' },
    { id: 'contacts' as const, label: 'Contacts', icon: Users, path: '/contacts' },
    { id: 'tasks' as const, label: 'Tasks', icon: CheckSquare, path: '/tasks' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 z-40 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!sidebarCollapsed && <h1 className="text-xl font-bold">Lark</h1>}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
        >
          {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* App Switcher */}
      <nav className="py-4 px-2 space-y-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;

          return (
            <button
              key={module.id}
              onClick={() => {
                setActiveModule(module.id);
                router.push(module.path);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 shadow-lg'
                  : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
              }`}
            >
              <Icon size={22} className="flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-medium text-sm">{module.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-2 h-px bg-slate-700" />

      {/* User Profile */}
      <div className="p-4 mt-auto space-y-4 border-t border-slate-700">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              {user?.displayName?.[0] || '?'}
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium truncate">{user?.displayName}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
                <ChevronDown size={16} />
              </>
            )}
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && !sidebarCollapsed && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700">
              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-700/50 transition-colors text-left">
                <Settings size={16} />
                <span className="text-sm">Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-700/50 transition-colors text-left text-red-400">
                <LogOut size={16} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
