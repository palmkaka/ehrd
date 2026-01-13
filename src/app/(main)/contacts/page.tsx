'use client';

import { ContactsList } from '@/components/contacts/ContactsList';
import { ClientOnly } from '@/components/ClientOnly';

export default function ContactsPage() {
  return (
    <ClientOnly>
      <ContactsList />
    </ClientOnly>
  );
}
