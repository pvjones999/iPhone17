import React from 'react';
import { Moon } from 'lucide-react';

export const WidgetWeather: React.FC = () => {
  return (
    <div 
      id="weather_widget" 
      className="bg-zinc-900 text-white rounded-[28px] p-4 flex flex-col justify-between aspect-square w-full shadow-md"
    >
      <div className="flex flex-col">
        <span className="text-[11px] font-medium opacity-70">Yonkers</span>
        <span className="text-3xl font-light tracking-tight mt-0.5">59°</span>
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <Moon className="w-4 h-4 text-amber-300 fill-amber-300 opacity-90" />
          <span className="text-[10px] font-medium">Clear</span>
        </div>
        <span className="text-[9px] opacity-60 mt-0.5 font-medium">H:60° L:56°</span>
      </div>
    </div>
  );
};
