import React from 'react';

export const WidgetCalendar: React.FC = () => {
  return (
    <div 
      id="calendar_widget" 
      className="bg-orange-50 text-zinc-900 rounded-[28px] p-4 flex flex-col aspect-square w-full shadow-md"
    >
      <div className="flex flex-col">
        <p className="text-[9px] font-bold text-red-500 tracking-wider uppercase">Monday</p>
        <span className="text-5xl font-light text-zinc-900 -mt-1">6</span>
      </div>
      
      <p className="mt-auto text-[10px] text-zinc-450 font-medium leading-tight text-left">
        No events<br />today
      </p>
    </div>
  );
};
