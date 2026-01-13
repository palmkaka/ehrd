'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import calendarService, { CalendarEvent } from '@/lib/services/calendar-service';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Bell,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

export const CalendarView: React.FC = () => {
  const { user } = useAppStore();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'month' | 'week' | 'day'>('month');

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = calendarService.subscribeToEvents(user.companyId, (events) => {
      setEvents(events);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Pad with previous month's days
  const startDayOfWeek = startOfMonth(currentDate).getDay();
  const paddedDays = Array(startDayOfWeek).fill(null);

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, date);
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus size={20} />
            New Event
          </button>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 mb-4">
          {(['month', 'week', 'day'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setViewType(type)}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                viewType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading calendar...</p>
          </div>
        ) : (
          <div>
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-gray-600 text-sm h-10 flex items-center justify-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {paddedDays.map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-gray-50 rounded-lg p-2 h-24"
                />
              ))}

              {daysInMonth.map((date) => {
                const dayEvents = getEventsForDay(date);
                const isToday = isSameDay(date, new Date());

                return (
                  <div
                    key={date.toISOString()}
                    className={`rounded-lg p-2 min-h-24 border-2 ${
                      isToday
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    } transition-colors cursor-pointer`}
                  >
                    <p className={`text-sm font-semibold mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {format(date, 'd')}
                    </p>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs bg-blue-600 text-white rounded px-2 py-1 truncate"
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="text-xs text-gray-500">+{dayEvents.length - 2} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
