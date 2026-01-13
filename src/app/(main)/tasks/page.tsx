'use client';

import { TasksList } from '@/components/tasks/TasksList';
import { ClientOnly } from '@/components/ClientOnly';

export default function TasksPage() {
  return (
    <ClientOnly>
      <TasksList />
    </ClientOnly>
  );
}
