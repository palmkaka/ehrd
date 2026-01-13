import {
  ref,
  query,
  onValue,
  set,
  push,
  update,
  remove,
  serverTimestamp,
} from 'firebase/database';
import { database } from '../firebase';

export interface Message {
  id: string;
  text: string;
  sender: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: number;
  reactions?: { [emoji: string]: string[] };
  attachments?: Array<{ name: string; url: string }>;
}

export interface Chat {
  id: string;
  type: '1:1' | 'group';
  participants: string[];
  participantNames: string[];
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount?: number;
  avatar?: string;
  name?: string;
}

class ChatService {
  // Subscribe to chat list
  subscribeToChatList(companyId: string, userId: string, callback: (chats: Chat[]) => void) {
    const chatsRef = ref(database, `companies/${companyId}/chats`);
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const chats: Chat[] = Object.entries(data).map(([id, chat]: [string, any]) => ({
          id,
          ...chat,
        }));
        callback(chats);
      }
    });
    return unsubscribe;
  }

  // Subscribe to messages in a chat
  subscribeToMessages(
    companyId: string,
    chatId: string,
    callback: (messages: Message[]) => void
  ) {
    const messagesRef = ref(database, `companies/${companyId}/chats/${chatId}/messages`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messages: Message[] = Object.entries(data)
          .map(([id, msg]: [string, any]) => ({
            id,
            ...msg,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        callback(messages);
      }
    });
    return unsubscribe;
  }

  // Send message
  async sendMessage(
    companyId: string,
    chatId: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ) {
    const messagesRef = ref(database, `companies/${companyId}/chats/${chatId}/messages`);
    const newMessageRef = push(messagesRef);
    await set(newMessageRef, {
      ...message,
      timestamp: serverTimestamp(),
    });
    return newMessageRef.key;
  }

  // Add emoji reaction
  async addReaction(
    companyId: string,
    chatId: string,
    messageId: string,
    emoji: string,
    userId: string
  ) {
    const reactionsRef = ref(
      database,
      `companies/${companyId}/chats/${chatId}/messages/${messageId}/reactions/${emoji}`
    );
    const currentRef = ref(
      database,
      `companies/${companyId}/chats/${chatId}/messages/${messageId}/reactions/${emoji}`
    );
    
    onValue(
      currentRef,
      (snapshot) => {
        const current = snapshot.val() || [];
        if (!current.includes(userId)) {
          set(reactionsRef, [...current, userId]);
        }
      },
      { onlyOnce: true }
    );
  }

  // Create new chat
  async createChat(
    companyId: string,
    chatData: Omit<Chat, 'id'>
  ) {
    const chatsRef = ref(database, `companies/${companyId}/chats`);
    const newChatRef = push(chatsRef);
    await set(newChatRef, chatData);
    return newChatRef.key;
  }

  // Update chat
  async updateChat(
    companyId: string,
    chatId: string,
    updates: Partial<Chat>
  ) {
    const chatRef = ref(database, `companies/${companyId}/chats/${chatId}`);
    await update(chatRef, updates);
  }
}

export default new ChatService();
