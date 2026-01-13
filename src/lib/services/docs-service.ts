import { ref, set, push, update, onValue } from 'firebase/database';
import { database } from '../firebase';

export interface Document {
  id: string;
  name: string;
  type: 'document' | 'folder' | 'wiki';
  content?: string;
  uploadedBy: string;
  createdAt: number;
  updatedAt: number;
  sharedWith: string[];
  parentId?: string;
}

class DocsService {
  // Subscribe to files/documents
  subscribeToFiles(companyId: string, callback: (files: Document[]) => void) {
    const filesRef = ref(database, `companies/${companyId}/files`);
    const unsubscribe = onValue(filesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const files: Document[] = Object.entries(data).map(([id, file]: [string, any]) => ({
          id,
          ...file,
        }));
        callback(files);
      }
    });
    return unsubscribe;
  }

  // Create new document
  async createDocument(
    companyId: string,
    docData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const filesRef = ref(database, `companies/${companyId}/files`);
    const newDocRef = push(filesRef);
    await set(newDocRef, {
      ...docData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return newDocRef.key;
  }

  // Update document
  async updateDocument(
    companyId: string,
    docId: string,
    updates: Partial<Document>
  ) {
    const docRef = ref(database, `companies/${companyId}/files/${docId}`);
    await update(docRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  // Share document with users
  async shareDocument(
    companyId: string,
    docId: string,
    userIds: string[]
  ) {
    const docRef = ref(database, `companies/${companyId}/files/${docId}`);
    await update(docRef, {
      sharedWith: userIds,
      updatedAt: Date.now(),
    });
  }
}

export default new DocsService();
