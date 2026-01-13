import { ref, set, push, update, onValue } from 'firebase/database';
import { database } from '../firebase';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  assigneeName: string;
  dueDate: number;
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

class TasksService {
  // Subscribe to tasks
  subscribeToTasks(companyId: string, callback: (tasks: Task[]) => void) {
    const tasksRef = ref(database, `companies/${companyId}/tasks`);
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const tasks: Task[] = Object.entries(data).map(([id, task]: [string, any]) => ({
          id,
          ...task,
        }));
        callback(tasks);
      }
    });
    return unsubscribe;
  }

  // Create task
  async createTask(
    companyId: string,
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    const tasksRef = ref(database, `companies/${companyId}/tasks`);
    const newTaskRef = push(tasksRef);
    await set(newTaskRef, {
      ...taskData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return newTaskRef.key;
  }

  // Update task
  async updateTask(
    companyId: string,
    taskId: string,
    updates: Partial<Task>
  ) {
    const taskRef = ref(database, `companies/${companyId}/tasks/${taskId}`);
    await update(taskRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  }

  // Delete task
  async deleteTask(companyId: string, taskId: string) {
    const taskRef = ref(database, `companies/${companyId}/tasks/${taskId}`);
    await set(taskRef, null);
  }
}

export default new TasksService();
