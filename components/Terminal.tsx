import React, { useEffect, useRef, useState } from 'react';
import { LogEntry, UserData } from '../types';
import { FAKE_LOGS } from '../constants';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import { audioService } from '../services/audioService';

interface TerminalProps {
    userData: UserData | null;
}

const Terminal: React.FC<TerminalProps> = ({ userData }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [inputValue, setInputValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Initial Logs
  useEffect(() => {
    const addLog = () => {
      const randomMsg = FAKE_LOGS[Math.floor(Math.random() * FAKE_LOGS.length)];
      const type = Math.random() > 0.85 ? 'warning' : Math.random() > 0.95 ? 'error' : 'info';
      
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        message: randomMsg,
        type: type as any,
      };

      setLogs((prev) => {
        const updated = [...prev, newLog];
        return updated.length > 50 ? updated.slice(-50) : updated; 
      });
    };

    // Add initial logs quickly
    let count = 0;
    const initialInterval = setInterval(() => {
        addLog();
        count++;
        if (count > 5) clearInterval(initialInterval);
    }, 200);

    // Then add logs periodically
    const interval = setInterval(() => {
        if (Math.random() > 0.6) addLog();
    }, 3500);

    return () => {
        clearInterval(initialInterval);
        clearInterval(interval);
    };
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const cmd = inputValue.trim().toLowerCase();
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

    // Add User Command Log
    setLogs(prev => [...prev, {
        id: Math.random().toString(),
        timestamp,
        message: `> ${inputValue}`,
        type: 'command'
    }]);

    audioService.play('typing');

    // Process Command
    let responseMsg = '';
    let responseType: 'info' | 'success' | 'error' | 'warning' = 'info';

    switch (cmd) {
        case 'help':
            responseMsg = 'AVAILABLE COMMANDS: help, status, clear, whoami, date, scan';
            break;
        case 'whoami':
            responseMsg = userData ? `AGENT: ${userData.codeName} | ID: ${userData.nationalId}` : 'UNKNOWN AGENT';
            responseType = 'success';
            break;
        case 'clear':
            setLogs([]);
            setInputValue('');
            return;
        case 'status':
            responseMsg = 'SYSTEM INTEGRITY: 98% | CONNECTION: SECURE | THREATS: 0';
            responseType = 'success';
            break;
        case 'date':
            responseMsg = new Date().toString();
            break;
        case 'scan':
            responseMsg = 'INITIATING NETWORK SCAN... [||||||||||] 100% COMPLETE. NO LOCAL THREATS.';
            responseType = 'warning';
            break;
        case 'hack':
            responseMsg = 'ACCESS DENIED. AUTHORIZATION LEVEL 10 REQUIRED.';
            responseType = 'error';
            break;
        default:
            responseMsg = `COMMAND NOT FOUND: ${cmd}`;
            responseType = 'error';
    }

    // Add System Response with slight delay
    setTimeout(() => {
        setLogs(prev => [...prev, {
            id: Math.random().toString(),
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            message: responseMsg,
            type: responseType
        }]);
        audioService.play(responseType === 'error' ? 'error' : 'success');
    }, 300);

    setInputValue('');
  };

  const focusInput = () => {
      inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-black/80 neon-box rounded-sm p-3 font-mono text-sm overflow-hidden relative group" onClick={focusInput}>
      <div className="flex items-center justify-between gap-2 mb-2 border-b border-neon-blue/30 pb-2 text-neon-blue">
        <div className="flex items-center gap-2">
            <TerminalIcon size={14} />
            <span className="uppercase tracking-widest text-xs">ROOT@DARKCODE:~</span>
        </div>
        <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1 pb-2">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 animate-fade-in-up break-words text-xs md:text-sm">
            {log.type !== 'command' && (
                <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
            )}
            <span className={`
              ${log.type === 'error' ? 'text-red-500 font-bold' : ''}
              ${log.type === 'warning' ? 'text-yellow-400' : ''}
              ${log.type === 'success' ? 'text-green-400' : ''}
              ${log.type === 'info' ? 'text-neon-blue/80' : ''}
              ${log.type === 'command' ? 'text-white font-bold ml-4' : ''}
            `}>
              {log.type === 'warning' ? 'WARN: ' : ''}
              {log.type === 'error' ? 'ERR: ' : ''}
              <span className="">{log.message}</span>
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleCommand} className="mt-2 flex items-center gap-2 border-t border-white/10 pt-2">
          <ChevronRight size={16} className="text-neon-alert animate-pulse" />
          <input 
            ref={inputRef}
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-gray-700"
            placeholder="Type command..."
            autoFocus
          />
      </form>
      
      {/* Decorative scanline */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-neon-blue/5 pointer-events-none opacity-20" />
    </div>
  );
};

export default Terminal;
