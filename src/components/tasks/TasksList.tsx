'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import tasksService, { Task } from '@/lib/services/tasks-service';
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  User,
  AlertCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const TasksList: React.FC = () => {
  const { user } = useAppStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = tasksService.subscribeToTasks(user.companyId, (tasks) => {
      setTasks(tasks);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return 'text-green-600';
      case 'in-progress':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority?: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };
  };

  const stats = getTaskStats();

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus size={20} />
            New Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', count: stats.total, color: 'bg-gray-100' },
            { label: 'To Do', count: stats.todo, color: 'bg-blue-100' },
            { label: 'In Progress', count: stats.inProgress, color: 'bg-yellow-100' },
            { label: 'Done', count: stats.done, color: 'bg-green-100' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-lg p-4 text-center`}>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border rounded-lg transition-all hover:shadow-lg group ${
                  task.status === 'done' ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button className={`mt-1 flex-shrink-0 ${getStatusColor(task.status)}`}>
                    {task.status === 'done' ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-lg ${
                        task.status === 'done'
                          ? 'text-gray-500 line-through'
                          : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}

                    {/* Meta Info */}
                    <div className="flex gap-4 mt-3 text-sm">
                      {/* Priority */}
                      {task.priority && (
                        <span className={`px-2 py-1 rounded ${getPriorityColor(task.priority)} text-xs font-medium flex items-center gap-1`}>
                          {task.priority === 'high' && <AlertCircle size={12} />}
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      )}

                      {/* Due Date */}
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar size={14} />
                        {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                      </div>

                      {/* Assignee */}
                      <div className="flex items-center gap-1 text-gray-600">
                        <User size={14} />
                        {task.assigneeName}
                      </div>

                      {/* Status Badge */}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.status === 'done'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
