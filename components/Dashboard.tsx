
import React, { useState } from 'react';
import { Message } from '../types';

interface DashboardProps {
  partnerName: string;
  onTriggerHeart: (color: string, message: string) => void;
  // Ora accettiamo il messaggio ricevuto dall'esterno (App.tsx)
  lastReceivedMessage: Message | null; 
  onExit: () => void;
}

// Creative "Mood" palette instead of simple colors
const MOODS = [
  { 
    id: 'passion', 
    label: 'Passione', 
    emoji: '🌹',
    heartColor: 'text-rose-500', 
    gradient: 'from-rose-400 to-red-600',
    border: 'border-rose-500',
    shadow: 'shadow-rose-500/30'
  },
  { 
    id: 'dream', 
    label: 'Sogno', 
    emoji: '🔮',
    heartColor: 'text-violet-500', 
    gradient: 'from-violet-400 to-fuchsia-600',
    border: 'border-violet-500',
    shadow: 'shadow-violet-500/30'
  },
  { 
    id: 'energy', 
    label: 'Energia', 
    emoji: '⚡',
    heartColor: 'text-amber-500', 
    gradient: 'from-amber-400 to-orange-500',
    border: 'border-amber-500',
    shadow: 'shadow-amber-500/30'
  },
  { 
    id: 'peace', 
    label: 'Pace', 
    emoji: '🌊',
    heartColor: 'text-cyan-500', 
    gradient: 'from-cyan-400 to-blue-600',
    border: 'border-cyan-500',
    shadow: 'shadow-cyan-500/30'
  },
  { 
    id: 'nature', 
    label: 'Natura', 
    emoji: '🌿',
    heartColor: 'text-emerald-500', 
    gradient: 'from-emerald-400 to-teal-600',
    border: 'border-emerald-500',
    shadow: 'shadow-emerald-500/30'
  },
];

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ partnerName, onTriggerHeart, lastReceivedMessage, onExit }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false); // New error state for shaking
  const [feedback, setFeedback] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [customMessage, setCustomMessage] = useState("");

  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) { }
    }
  };

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - button.left;
    const y = event.clientY - button.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  const handleSendLove = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Validation: Block empty messages
    if (!customMessage.trim()) {
      setIsError(true);
      triggerHaptic([50, 50, 50]); // Error vibration pattern
      setFeedback("Scrivi un messaggio per inviarlo! ✍️");
      setTimeout(() => setIsError(false), 500); // Remove shake class
      setTimeout(() => setFeedback(""), 2000);
      return;
    }

    createRipple(e);
    triggerHaptic(50);

    setFeedback("Invio in corso...");
    
    // Trigger visual effect using the mood's heart color
    onTriggerHeart(selectedMood.heartColor, customMessage);

    setCustomMessage("");
    setFeedback("Inviato con successo!");
    
    // Activate success animation
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000); 

    setTimeout(() => setFeedback(""), 3000);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-md mx-auto p-6 relative">
      
      {/* Header */}
      <div className="w-full pt-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 -ml-2 text-slate-400 hover:text-rose-500 transition-colors rounded-full hover:bg-rose-50"
            title="Esci dalla stanza"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connesso con</h2>
            <h1 className={`text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${selectedMood.gradient}`}>
              {partnerName}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs text-green-600 font-bold">ONLINE</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 gap-8">
        
        {/* Mood Selector - Creative Palette */}
        <div className="w-full">
            <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest mb-3">
              Scegli il tuo mood
            </p>
            <div className="flex justify-center gap-3">
              {MOODS.map((mood) => {
                const isSelected = selectedMood.id === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => {
                      triggerHaptic(15);
                      setSelectedMood(mood);
                    }}
                    className={`
                      relative group flex flex-col items-center justify-center transition-all duration-300
                      ${isSelected ? 'scale-110 -translate-y-1' : 'opacity-60 hover:opacity-100 hover:scale-105'}
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md transition-all
                      bg-gradient-to-br ${mood.gradient} text-white
                      ${isSelected ? 'ring-2 ring-offset-2 ring-rose-100 shadow-lg' : ''}
                    `}>
                      {mood.emoji}
                    </div>
                    <span className={`
                      text-[10px] font-bold mt-1 transition-all duration-300
                      ${isSelected ? 'text-slate-700 opacity-100' : 'text-slate-400 opacity-0 h-0 overflow-hidden'}
                    `}>
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>
        </div>

        {/* Message Input */}
        <div className={`w-full relative group transition-transform ${isError ? 'animate-shake' : ''}`}>
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${selectedMood.gradient} rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur`}></div>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder={`Scrivi un messaggio di ${selectedMood.label.toLowerCase()}...`}
            rows={2}
            maxLength={140}
            className="relative w-full px-4 py-3 rounded-2xl bg-white border-0 text-center text-slate-700 placeholder:text-slate-400 focus:ring-0 resize-none shadow-sm text-sm"
          />
        </div>

        {/* The Big Button */}
        <div className="relative">
            {/* Outer Glow */}
            <div className={`absolute inset-0 bg-gradient-to-r ${selectedMood.gradient} rounded-full blur-xl opacity-20 animate-pulse`}></div>
            
            <button
              onClick={handleSendLove}
              className={`
                group relative flex items-center justify-center overflow-hidden
                w-44 h-44 rounded-full 
                bg-white
                shadow-[0_15px_60px_-15px_rgba(0,0,0,0.3)]
                transition-all duration-300 ease-out
                ${!isSuccess ? 'hover:scale-105 active:scale-95' : ''}
                ${isSuccess ? 'animate-pulse ring-4 ring-offset-4 ring-rose-200' : ''}
                ${isError ? 'ring-2 ring-red-400' : ''}
                border-[6px] border-white
              `}
            >
              {/* Internal Dynamic Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${selectedMood.gradient} opacity-10 transition-opacity duration-500`}></div>
              
              {/* Ripple Container */}
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className={`absolute rounded-full bg-current opacity-30 animate-ripple pointer-events-none ${selectedMood.heartColor}`}
                  style={{
                    left: ripple.x,
                    top: ripple.y,
                    width: '100px',
                    height: '100px',
                    marginLeft: '-50px',
                    marginTop: '-50px',
                  }}
                />
              ))}

              {/* Heart Icon - The Logo */}
              <img
                src="/logo.svg"
                alt="Cuore"
                className={`
                  relative z-10 w-24 h-24 drop-shadow-md transition-all duration-300 
                  ${isSuccess ? 'animate-pulse scale-90' : 'group-hover:scale-110'}
                `}
              />
            </button>
        </div>

        {/* Feedback Text */}
        <div className="h-6">
            {feedback && <p className={`text-sm font-bold animate-bounce ${isError ? 'text-red-500' : selectedMood.heartColor}`}>{feedback}</p>}
        </div>
      </div>

      {/* Last RECEIVED Message Card */}
      <div className={`
        w-full bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-100 z-10 mb-2
        transition-colors duration-500
      `}>
        <div className="flex items-center gap-2 mb-2">
           <span className="text-lg animate-pulse">📩</span>
           <h3 className={`text-xs font-bold uppercase tracking-wide text-slate-500`}>Ultimo Messaggio Ricevuto</h3>
        </div>
        
        {lastReceivedMessage ? (
          <div className="animate-fade-in">
             <p className="text-lg text-slate-700 italic font-medium leading-relaxed">
              "{lastReceivedMessage.text}"
            </p>
            <div className="flex justify-end mt-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                {partnerName} • {new Date(lastReceivedMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 text-sm italic">Ancora nessun messaggio ricevuto oggi.</p>
        )}
      </div>

    </div>
  );
};
