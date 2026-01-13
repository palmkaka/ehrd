'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import chatService, { Chat } from '@/lib/services/chat-service';
import { Plus, Search } from 'lucide-react';

interface ChatListProps {
  onSelectChat: (chat: Chat) => void;
  selectedChatId?: string;
}

export const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedChatId }) => {
  const { user } = useAppStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = chatService.subscribeToChatList(
      user.companyId,
      user.id,
      (chats) => {
        setChats(chats);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const filteredChats = chats.filter((chat) =>
    (chat.name || chat.participantNames?.join(', ')).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
        
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading chats...</div>
        ) : filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No chats found</div>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                selectedChatId === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
              }`}
            >
              {/* Avatar */}
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {chat.avatar ? (
                    <img src={chat.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (chat.name || chat.participantNames?.[0] || 'C')[0]?.toUpperCase()
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {chat.name || chat.participantNames?.join(', ')}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage || 'No messages yet'}</p>
                </div>

                {/* Time and Badge */}
                <div className="flex flex-col items-end gap-2">
                  {chat.lastMessageTime && (
                    <span className="text-xs text-gray-400">
                      {new Date(chat.lastMessageTime).toLocaleDateString()}
                    </span>
                  )}
                  {chat.unreadCount ? (
                    <span className="bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {Math.min(chat.unreadCount, 9)}+
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          <Plus size={20} />
          New Chat
        </button>
      </div>
    </div>
  );
};
