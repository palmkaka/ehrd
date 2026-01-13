'use client';

import { CalendarView } from '@/components/calendar/CalendarView';
import { ClientOnly } from '@/components/ClientOnly';

export default function CalendarPage() {
  return (
    <ClientOnly>
      <CalendarView />
    </ClientOnly>
  );
}
