'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import chatService, { Chat, Message } from '@/lib/services/chat-service';
import {
  Send,
  Paperclip,
  Smile,
  ArrowLeft,
  MoreVertical,
} from 'lucide-react';

interface ChatWindowProps {
  chat: Chat | null;
  onBack: () => void;
}

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '✨'];

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onBack }) => {
  const { user } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Subscribe to messages
  useEffect(() => {
    if (!chat || !user) return;

    setLoading(true);
    const unsubscribe = chatService.subscribeToMessages(
      user.companyId,
      chat.id,
      (messages) => {
        setMessages(messages);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [chat, user]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chat || !user) return;

    const messageText = inputValue;
    setInputValue('');

    try {
      await chatService.sendMessage(user.companyId, chat.id, {
        text: messageText,
        sender: user.id,
        senderName: user.displayName,
        senderAvatar: user.avatar,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setInputValue(messageText); // Restore on error
    }
  };

  const handleAddReaction = async (messageId: string, emoji: string) => {
    if (!chat || !user) return;

    try {
      await chatService.addReaction(user.companyId, chat.id, messageId, emoji, user.id);
      setShowEmojiPicker(null);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-semibold text-gray-900">
              {chat.name || chat.participantNames?.join(', ')}
            </h2>
            <p className="text-sm text-gray-500">
              {chat.type === 'group' ? `${chat.participants?.length} members` : 'Active now'}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender === user?.id;

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className="group flex gap-2 max-w-xs lg:max-w-md">
                  {!isOwnMessage && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                      {message.senderName?.[0] || '?'}
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    {/* Sender Name (for group chats) */}
                    {chat.type === 'group' && !isOwnMessage && (
                      <p className="text-xs font-semibold text-gray-600 px-3 pt-2">
                        {message.senderName}
                      </p>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-2 rounded-lg break-words ${
                        isOwnMessage
                          ? 'bg-blue-600 text-white rounded-bl-none'
                          : 'bg-gray-100 text-gray-900 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    {/* Reactions */}
                    {message.reactions && Object.keys(message.reactions).length > 0 && (
                      <div className="flex gap-2 flex-wrap px-3 pt-1">
                        {Object.entries(message.reactions).map(([emoji, userIds]) => (
                          <div
                            key={emoji}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200 cursor-pointer transition-colors"
                          >
                            <span>{emoji}</span>
                            <span className="text-gray-600">{userIds.length}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Emoji Picker Button */}
                    <div className="flex gap-1 px-3 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Smile size={16} className="text-gray-600" />
                      </button>

                      {/* Emoji Picker Dropdown */}
                      {showEmojiPicker === message.id && (
                        <div className="absolute mt-8 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-1 z-10">
                          {EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleAddReaction(message.id, emoji)}
                              className="p-2 hover:bg-gray-100 rounded transition-colors text-lg"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-3 items-end">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip size={20} className="text-gray-600" />
          </button>

          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={1}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
