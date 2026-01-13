import { database } from './firebase';
import { ref, set } from 'firebase/database';

export async function initializeMockData() {
  try {
    const mockChats = {
      'chat-1': {
        type: '1:1',
        participants: ['user-1', 'user-2'],
        participantNames: ['John Doe', 'Jane Smith'],
        lastMessage: 'Hey, how are you?',
        lastMessageTime: Date.now(),
        unreadCount: 0,
      },
      'chat-2': {
        type: 'group',
        participants: ['user-1', 'user-3', 'user-4'],
        participantNames: ['John Doe', 'Bob Johnson', 'Alice Brown'],
        name: 'Team Discussion',
        lastMessage: 'Let\'s sync up tomorrow',
        lastMessageTime: Date.now() - 3600000,
        unreadCount: 2,
      },
    };

    const mockMessages = {
      'chat-1': {
        'msg-1': {
          text: 'Hi John!',
          sender: 'user-2',
          senderName: 'Jane Smith',
          senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
          timestamp: Date.now() - 7200000,
        },
        'msg-2': {
          text: 'Hey Jane! How are you doing?',
          sender: 'user-1',
          senderName: 'John Doe',
          senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          timestamp: Date.now() - 3600000,
        },
        'msg-3': {
          text: 'Great! Just finished the project 🎉',
          sender: 'user-2',
          senderName: 'Jane Smith',
          senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
          timestamp: Date.now() - 1800000,
          reactions: {
            '👍': ['user-1'],
            '🎉': ['user-1'],
          },
        },
      },
      'chat-2': {
        'msg-1': {
          text: 'Team, let\'s discuss the new feature',
          sender: 'user-1',
          senderName: 'John Doe',
          senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          timestamp: Date.now() - 5400000,
        },
        'msg-2': {
          text: 'Sounds good! I have some ideas',
          sender: 'user-3',
          senderName: 'Bob Johnson',
          senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
          timestamp: Date.now() - 5100000,
        },
        'msg-3': {
          text: 'Let\'s sync up tomorrow at 10am',
          sender: 'user-1',
          senderName: 'John Doe',
          senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          timestamp: Date.now() - 3600000,
        },
      },
    };

    // Set chats data
    await set(ref(database, 'companies/company-1/chats'), mockChats);

    // Set messages for each chat
    for (const [chatId, messages] of Object.entries(mockMessages)) {
      await set(ref(database, `companies/company-1/chats/${chatId}/messages`), messages);
    }

    console.log('Mock data initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize mock data:', error);
  }
}
