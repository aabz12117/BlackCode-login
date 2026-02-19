import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, Shield, Cpu } from 'lucide-react';

const StatsPanel: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Initial data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      name: i,
      val: Math.floor(Math.random() * 100),
      sec: 80 + Math.random() * 20,
    }));
    setData(initialData);

    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), {
          name: prev[prev.length - 1].name + 1,
          val: Math.floor(Math.random() * 100),
          sec: 80 + Math.random() * 20,
        }];
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 h-full">
      
      {/* Network Traffic */}
      <div className="bg-black/80 neon-box rounded-sm p-4 flex flex-col justify-between h-48">
        <div className="flex justify-between items-center mb-2 text-neon-blue">
          <div className="flex items-center gap-2">
            <Activity size={16} />
            <h3 className="text-xs font-bold uppercase">حركة الشبكة</h3>
          </div>
          <span className="text-xs font-mono">14.5 TB/s</span>
        </div>
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00d9ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis hide />
              <YAxis hide domain={[0, 100]} />
              <Area type="monotone" dataKey="val" stroke="#00d9ff" fillOpacity={1} fill="url(#colorVal)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Security Level */}
      <div className="bg-black/80 neon-box rounded-sm p-4 flex flex-col justify-between h-48">
         <div className="flex justify-between items-center mb-2 text-neon-blue">
          <div className="flex items-center gap-2">
            <Shield size={16} />
            <h3 className="text-xs font-bold uppercase">مستوى الأمان</h3>
          </div>
          <span className="text-xs font-mono text-green-400">98.4%</span>
        </div>
        <div className="h-full w-full">
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(-10)}>
              <Bar dataKey="sec" fill="#001f3f" stroke="#00d9ff" strokeWidth={1} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CPU Load - Minimal text based */}
      <div className="bg-black/80 neon-box rounded-sm p-4 flex items-center justify-between">
         <div className="flex items-center gap-3 text-neon-blue">
             <Cpu size={24} className="animate-pulse" />
             <div>
                 <h4 className="text-xs text-gray-400">المعالج المركزي</h4>
                 <div className="text-xl font-mono">34%</div>
             </div>
         </div>
         <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
             <div className="h-full bg-neon-alert w-[34%]"></div>
         </div>
      </div>

    </div>
  );
};

export default StatsPanel;
