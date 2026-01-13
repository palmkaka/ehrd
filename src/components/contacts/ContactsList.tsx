'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import contactsService, { Contact } from '@/lib/services/contacts-service';
import {
  Plus,
  Search,
  Mail,
  Phone,
  Edit2,
  Trash2,
  Users,
} from 'lucide-react';

export const ContactsList: React.FC = () => {
  const { user } = useAppStore();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = contactsService.subscribeToContacts(user.companyId, (contacts) => {
      setContacts(contacts);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGroup = !selectedGroup || contact.groups?.includes(selectedGroup);
    
    return matchesSearch && matchesGroup;
  });

  const groups = Array.from(new Set(contacts.flatMap((c) => c.groups || [])));

  return (
    <div className="h-full flex gap-6 bg-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 p-6 overflow-y-auto">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mb-6">
          <Plus size={20} />
          New Contact
        </button>

        {/* Groups */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
            <Users size={16} />
            Groups
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedGroup(null)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedGroup === null
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Contacts ({contacts.length})
            </button>
            {groups.map((group) => {
              const count = contacts.filter((c) => c.groups?.includes(group)).length;
              return (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedGroup === group
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {group} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contacts</h1>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading contacts...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No contacts found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow flex items-start justify-between group"
                >
                  <div className="flex gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {contact.name[0]?.toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.position || 'Team Member'}</p>
                      
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          >
                            <Mail size={14} />
                            {contact.email}
                          </a>
                        )}
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                          >
                            <Phone size={14} />
                            {contact.phone}
                          </a>
                        )}
                      </div>

                      {/* Groups */}
                      {contact.groups && contact.groups.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {contact.groups.map((group) => (
                            <span
                              key={group}
                              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                            >
                              {group}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit2 size={16} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
