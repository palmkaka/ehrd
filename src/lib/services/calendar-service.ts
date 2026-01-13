import { ref, set, push, update, onValue } from 'firebase/database';
import { database } from '../firebase';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: number;
  endDate: number;
  participants: string[];
  participantNames: string[];
  createdBy: string;
  location?: string;
  reminders?: number[];
}

class CalendarService {
  // Subscribe to events
  subscribeToEvents(companyId: string, callback: (events: CalendarEvent[]) => void) {
    const eventsRef = ref(database, `companies/${companyId}/events`);
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const events: CalendarEvent[] = Object.entries(data).map(([id, event]: [string, any]) => ({
          id,
          ...event,
        }));
        callback(events);
      }
    });
    return unsubscribe;
  }

  // Create event
  async createEvent(
    companyId: string,
    eventData: Omit<CalendarEvent, 'id'>
  ) {
    const eventsRef = ref(database, `companies/${companyId}/events`);
    const newEventRef = push(eventsRef);
    await set(newEventRef, eventData);
    return newEventRef.key;
  }

  // Update event
  async updateEvent(
    companyId: string,
    eventId: string,
    updates: Partial<CalendarEvent>
  ) {
    const eventRef = ref(database, `companies/${companyId}/events/${eventId}`);
    await update(eventRef, updates);
  }

  // Delete event
  async deleteEvent(companyId: string, eventId: string) {
    const eventRef = ref(database, `companies/${companyId}/events/${eventId}`);
    await set(eventRef, null);
  }
}

export default new CalendarService();
