'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Chat } from '@/lib/services/chat-service';
import { ClientOnly } from '@/components/ClientOnly';

function ChatPageContent() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [showChatList, setShowChatList] = useState(true);
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Chat List - Hidden on mobile when chat is selected */}
      <div
        className={`${
          showChatList ? 'flex' : 'hidden'
        } lg:flex w-full lg:w-80 border-r border-gray-200 flex-col`}
      >
        <ChatList
          selectedChatId={selectedChat?.id}
          onSelectChat={(chat) => {
            setSelectedChat(chat);
            setShowChatList(false);
          }}
        />
      </div>

      {/* Chat Window */}
      <div className={`flex-1 ${!showChatList ? 'flex' : 'hidden'} lg:flex flex-col`}>
        <ChatWindow
          chat={selectedChat}
          onBack={() => {
            setShowChatList(true);
            setSelectedChat(null);
          }}
        />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ClientOnly>
      <ChatPageContent />
    </ClientOnly>
  );
}
