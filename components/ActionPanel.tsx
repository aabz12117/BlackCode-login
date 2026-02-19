import React, { useState } from 'react';
import { audioService } from '../services/audioService';
import { Target, Wifi, FileWarning, Eye, Lock, RefreshCw, Zap, Database, ShieldAlert } from 'lucide-react';

interface ActionPanelProps {
  onAction: (action: string) => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ onAction }) => {
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  const handlePress = (id: string, label: string) => {
    setActiveBtn(id);
    audioService.play('click');
    onAction(label);
    
    // Reset active state after animation
    setTimeout(() => setActiveBtn(null), 400);
  };

  const actions = [
    { id: 'scan', label: 'فحص الأنظمة', icon: Wifi, color: 'text-neon-blue border-neon-blue/50 hover:bg-neon-blue/10' },
    { id: 'hack', label: 'اختراق الخادم', icon: Lock, color: 'text-red-500 border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)]' },
    { id: 'track', label: 'تتبع الأهداف', icon: Target, color: 'text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10' },
    { id: 'decrypt', label: 'فك التشفير', icon: FileWarning, color: 'text-green-400 border-green-400/50 hover:bg-green-400/10' },
    { id: 'intel', label: 'بيانات سرية', icon: Eye, color: 'text-purple-400 border-purple-400/50 hover:bg-purple-400/10' },
    { id: 'firewall', label: 'جدار الحماية', icon: ShieldAlert, color: 'text-orange-500 border-orange-500/50 hover:bg-orange-500/10' },
    { id: 'inject', label: 'حقن SQL', icon: Database, color: 'text-cyan-400 border-cyan-400/50 hover:bg-cyan-400/10' },
    { id: 'overload', label: 'زيادة الحمل', icon: Zap, color: 'text-pink-500 border-pink-500/50 hover:bg-pink-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 h-full content-start p-1">
      {actions.map((action) => (
        <button
          key={action.id}
          onMouseEnter={() => audioService.play('hover')}
          onClick={() => handlePress(action.id, action.label)}
          className={`
            relative overflow-hidden group p-3 border rounded-sm transition-all duration-200
            flex flex-col items-center justify-center gap-2 bg-black/60
            ${action.color}
            ${activeBtn === action.id ? 'scale-95 bg-white/10' : ''}
          `}
        >
          <action.icon size={20} className={`transition-transform duration-300 ${activeBtn === action.id ? 'rotate-12 scale-110' : 'group-hover:scale-110'}`} />
          <span className="font-cairo font-bold text-xs tracking-wide whitespace-nowrap">{action.label}</span>
          
          {/* Progress bar effect on click */}
          {activeBtn === action.id && (
             <span className="absolute bottom-0 left-0 h-1 bg-current w-full animate-[width_0.4s_ease-out]"></span>
          )}
          
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-noise.png')] opacity-10 pointer-events-none"></div>
        </button>
      ))}
    </div>
  );
};

export default ActionPanel;
