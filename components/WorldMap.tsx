import React, { useEffect, useState } from 'react';
import { MissionPoint } from '../types';
import { audioService } from '../services/audioService';
import { Globe, MapPin, Target } from 'lucide-react';

const WorldMap: React.FC = () => {
  const [points, setPoints] = useState<MissionPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<MissionPoint | null>(null);

  useEffect(() => {
    // Generate simulated mission points
    const newPoints: MissionPoint[] = [
        { id: 'us-east', x: 25, y: 35, status: 'active', name: 'Server Farm: Virginia', details: 'High traffic detected. Possible intrusion.' },
        { id: 'eu-west', x: 48, y: 30, status: 'pending', name: 'Relay Node: London', details: 'Awaiting encryption keys.' },
        { id: 'asia-east', x: 80, y: 38, status: 'active', name: 'Firewall: Tokyo', details: 'Under DDoS attack. Mitigation active.' },
        { id: 'sa-brazil', x: 32, y: 65, status: 'completed', name: 'Archive: Sao Paulo', details: 'Data extraction complete.' },
        { id: 'ru-moscow', x: 55, y: 25, status: 'pending', name: 'Proxy: Moscow', details: 'Connection unstable.' },
        { id: 'au-sydney', x: 85, y: 75, status: 'pending', name: 'Sat-Link: Sydney', details: 'Offline for maintenance.' },
        { id: 'af-cairo', x: 52, y: 42, status: 'active', name: 'Hub: Cairo', details: 'Operation DarkCode HQ.' },
    ];
    setPoints(newPoints);
  }, []);

  const handlePointClick = (point: MissionPoint) => {
      setSelectedPoint(point);
      audioService.play('click');
  };

  return (
    <div className="h-full w-full relative group bg-black/50">
        
        {/* Header Overlay */}
        <div className="absolute top-4 right-4 z-20 bg-black/80 px-4 py-2 border border-neon-blue/30 backdrop-blur-md rounded-sm">
            <h3 className="text-neon-blue text-xs tracking-widest uppercase flex items-center gap-2">
                <Globe size={14} className="animate-spin-slow" />
                خريطة العمليات العالمية
            </h3>
            <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-[10px] text-white/70">تحديث مباشر</span>
            </div>
        </div>

      {/* SVG Map Container */}
      <div className="w-full h-full p-4">
        <svg className="w-full h-full drop-shadow-[0_0_10px_rgba(0,217,255,0.3)]" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid Pattern */}
            <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0, 217, 255, 0.05)" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />

            {/* Abstract World Map Path (Simplified) */}
            <path d="M10,20 Q30,15 45,30 T80,30 T95,50 M20,60 Q30,80 40,70 T55,80 M60,50 Q70,40 80,60" 
                  fill="none" stroke="rgba(0, 217, 255, 0.2)" strokeWidth="0.5" strokeDasharray="2 2" />
            
            <text x="50" y="50" fontSize="10" fill="rgba(255,255,255,0.05)" textAnchor="middle" dominantBaseline="middle" fontWeight="900">
                GLOBAL NET
            </text>

            {/* Connecting Lines */}
            {points.map((p, i) => {
                const center = { x: 52, y: 42 }; // Cairo Hub
                return (
                    <line 
                        key={`line-${i}`}
                        x1={center.x} y1={center.y}
                        x2={p.x} y2={p.y}
                        stroke="rgba(0, 217, 255, 0.15)"
                        strokeWidth="0.2"
                        strokeDasharray="1 1"
                    >
                        <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2s" repeatCount="indefinite" />
                    </line>
                )
            })}

            {/* Nodes */}
            {points.map((point) => (
            <g key={point.id} 
                className="cursor-pointer hover:opacity-100 transition-opacity"
                onClick={() => handlePointClick(point)}
                onMouseEnter={() => audioService.play('hover')}
            >
                {/* Ping Effect */}
                {point.status === 'active' && (
                    <circle cx={point.x} cy={point.y} r="4" fill="none" stroke={point.status === 'active' ? '#ff003c' : '#00d9ff'} strokeWidth="0.2" className="animate-ping opacity-75" />
                )}
                
                {/* Core Dot */}
                <circle
                    cx={point.x}
                    cy={point.y}
                    r={point.status === 'active' ? 1.5 : 1}
                    fill={point.status === 'active' ? '#ff003c' : '#00d9ff'}
                    className={point.id === selectedPoint?.id ? 'fill-white' : ''}
                />
                
                {/* Label */}
                <text x={point.x + 3} y={point.y + 0.5} fontSize="2.5" fill="white" className="opacity-60 font-mono tracking-tighter" style={{ textShadow: '0 0 2px black' }}>
                    {point.name.split(':')[0]}
                </text>
            </g>
            ))}
        </svg>
      </div>
      
      {/* Selected Point Info Panel */}
      {selectedPoint && (
          <div className="absolute bottom-4 left-4 bg-black/90 border border-white/20 p-4 w-64 backdrop-blur-md animate-fade-in-up rounded-sm shadow-xl">
              <div className="flex justify-between items-start mb-2">
                  <h4 className="text-neon-blue font-bold text-sm flex items-center gap-2">
                      <Target size={14} />
                      {selectedPoint.name}
                  </h4>
                  <button onClick={() => setSelectedPoint(null)} className="text-gray-500 hover:text-white text-xs">✕</button>
              </div>
              <div className="text-xs text-gray-300 font-mono mb-2">
                  STATUS: <span className={selectedPoint.status === 'active' ? 'text-red-500 animate-pulse' : 'text-green-500'}>{selectedPoint.status.toUpperCase()}</span>
              </div>
              <p className="text-xs text-gray-400 border-t border-white/10 pt-2">
                  {selectedPoint.details}
              </p>
              <div className="mt-3 flex gap-2">
                  <button className="flex-1 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue text-[10px] py-1 border border-neon-blue/30 rounded-sm transition-colors">
                      تحليل
                  </button>
                  <button className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] py-1 border border-red-500/30 rounded-sm transition-colors">
                      عزل
                  </button>
              </div>
          </div>
      )}

      {/* Radar Scan Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/10 to-transparent w-[50%] h-full animate-[scan_4s_linear_infinite] pointer-events-none transform -skew-x-12" style={{filter: 'blur(8px)'}}></div>
    </div>
  );
};

export default WorldMap;
