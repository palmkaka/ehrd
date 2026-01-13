import { ref, set, push, update, onValue } from 'firebase/database';
import { database } from '../firebase';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  groups: string[];
  company?: string;
  position?: string;
}

class ContactsService {
  // Subscribe to contacts
  subscribeToContacts(companyId: string, callback: (contacts: Contact[]) => void) {
    const contactsRef = ref(database, `companies/${companyId}/contacts`);
    const unsubscribe = onValue(contactsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const contacts: Contact[] = Object.entries(data).map(([id, contact]: [string, any]) => ({
          id,
          ...contact,
        }));
        callback(contacts);
      }
    });
    return unsubscribe;
  }

  // Create contact
  async createContact(
    companyId: string,
    contactData: Omit<Contact, 'id'>
  ) {
    const contactsRef = ref(database, `companies/${companyId}/contacts`);
    const newContactRef = push(contactsRef);
    await set(newContactRef, contactData);
    return newContactRef.key;
  }

  // Update contact
  async updateContact(
    companyId: string,
    contactId: string,
    updates: Partial<Contact>
  ) {
    const contactRef = ref(database, `companies/${companyId}/contacts/${contactId}`);
    await update(contactRef, updates);
  }

  // Delete contact
  async deleteContact(companyId: string, contactId: string) {
    const contactRef = ref(database, `companies/${companyId}/contacts/${contactId}`);
    await set(contactRef, null);
  }
}

export default new ContactsService();
