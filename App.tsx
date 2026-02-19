import React, { useState } from 'react';
import IntroSection from './components/IntroSection';
import { UserData } from './types';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleIntroComplete = (data: UserData) => {
    setUserData(data);
    setIntroComplete(true);
  };

  if (!introComplete) {
    return <IntroSection onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen bg-black text-neon-blue font-cairo flex flex-col items-center justify-center p-4 relative overflow-hidden text-center" dir="rtl">

      {/* Background Effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-90"></div>

      <div className="relative z-10 animate-fade-in-up flex flex-col items-center max-w-2xl w-full">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse"></div>
          <ShieldCheck className="w-32 h-32 text-green-500 relative z-10" />
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
          تم التسجيل
          <span className="text-green-500">.</span>
        </h1>

        <div className="bg-white/5 border border-white/10 p-10 rounded-sm w-full backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-center gap-3 text-green-400 mb-6">
            <CheckCircle2 size={24} />
            <span className="font-mono text-lg uppercase tracking-widest">اكتمال العملية</span>
          </div>

          <p className="text-2xl md:text-3xl text-gray-200 font-bold leading-relaxed mb-8">
            تم تسجيلك بنجاح.
          </p>

          <div className="py-6 border-t border-white/10">
            <p className="text-xl text-neon-blue font-mono animate-pulse">
              انتظر رسالة قبولك...
            </p>
          </div>

          {userData && (
            <div className="mt-6 text-xs text-gray-600 font-mono uppercase tracking-widest">
              AGENT: {userData.codeName} | ID: {userData.nationalId ? `${userData.nationalId.slice(0, 4)}****` : 'UNDEFINED'}
            </div>
          )}
        </div>

        <div className="mt-12 text-[10px] text-gray-700 font-mono">
          DARKCODE INTELLIGENCE SYSTEMS | SESSION TERMINATED
        </div>
      </div>
    </div>
  );
};

export default App;