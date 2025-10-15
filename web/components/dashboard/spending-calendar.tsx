'use client';

import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '../../app/lib/api';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function SpendingCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: dailyData, isLoading } = useQuery({
    queryKey: ['spending-calendar', format(selectedDate, 'yyyy-MM')],
    queryFn: async () => {
      const startDate = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
      const response = await insightsApi.getSummary({ startDate, endDate });
      return response.dailySpending;
    },
  });

  // Get all days in selected month
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const utcStart = startOfMonth(selectedDate);
  const utcEnd = endOfMonth(selectedDate);

  const localStart = toZonedTime(utcStart, timeZone);
  const localEnd = toZonedTime(utcEnd, timeZone);

  const firstDayOfMonth = getDay(localStart);

  const days = eachDayOfInterval({ start: localStart, end: localEnd }).map((localDate) => {
    const utcDateStr = format(localDate, 'yyyy-MM-dd'); // This is local, but match to stored UTC date strings
    const dayData = dailyData?.find((d) => d.date === utcDateStr);
    return {
      day: localDate.getDate(),
      date: utcDateStr,
      amount: dayData?.amount || 0,
      hasSpending: !!dayData,
    };
  });

  // Get max amount for color scaling
  const maxAmount = Math.max(...days.map((d) => d.amount), 1);

  // Get color intensity based on spending
  const getColorIntensity = (amount: number) => {
    if (amount === 0) return 'bg-[rgb(var(--color-bg-tertiary))]';
    const intensity = (amount / maxAmount) * 100;
    if (intensity < 25) return 'bg-blue-900/40';
    if (intensity < 50) return 'bg-blue-700/60';
    if (intensity < 75) return 'bg-blue-500/80';
    return 'bg-blue-400';
  };

  const [hoveredDay, setHoveredDay] = useState<{ date: string; amount: number } | null>(null);

  if (isLoading) {
    return (
      <div className="card">
        <div className="skeleton h-56"></div>
      </div>
    );
  }

  return (
    <div className="card relative h-fit">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold">Spending Calendar</h3>
        <p className="text-xs text-secondary">
          {selectedDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-[10px] text-secondary font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}

        {/* Day cells */}
        {days.map((dayData) => (
          <div
            key={dayData.date}
            className={`aspect-square rounded-md flex items-center justify-center text-[11px] font-medium transition-all cursor-pointer relative ${getColorIntensity(dayData.amount)} hover:ring-1 hover:ring-blue-400`}
            onMouseEnter={() =>
              setHoveredDay({ date: dayData.date, amount: dayData.amount })
            }
            onMouseLeave={() => setHoveredDay(null)}
          >
            {dayData.day}
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1.5 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] rounded-md shadow-lg z-10 whitespace-nowrap">
          <p className="text-xs font-medium">
            {format(toZonedTime(new Date(`${hoveredDay.date}T23:59:59Z`), timeZone), 'MMM d')}
          </p>
          <p className="text-[10px] text-secondary">
            ${hoveredDay.amount.toFixed(2)} spent
          </p>
        </div>
      )}

      {/* Legend with navigation */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgb(var(--color-border-primary))]">
        <button 
          className="text-[10px] text-secondary hover:text-primary"
          onClick={() => setSelectedDate(addMonths(selectedDate, -1))}
        >
          Prev
        </button>
        <div className="flex gap-1">
          <div className="w-3.5 h-3.5 rounded bg-[rgb(var(--color-bg-tertiary))]"></div>
          <div className="w-3.5 h-3.5 rounded bg-blue-900/40"></div>
          <div className="w-3.5 h-3.5 rounded bg-blue-700/60"></div>
          <div className="w-3.5 h-3.5 rounded bg-blue-500/80"></div>
          <div className="w-3.5 h-3.5 rounded bg-blue-400"></div>
        </div>
        <button 
          className="text-[10px] text-secondary hover:text-primary"
          onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}