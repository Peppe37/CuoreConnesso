
import React, { useState, useEffect, useCallback } from 'react';
import { HeartOverlay } from './components/HeartOverlay';
import { Dashboard } from './components/Dashboard';
import { Heart, AppState, Message } from './types';

// Enhanced Pairing Screen with "Create" vs "Join" logic and improved visuals
const PairingScreen = ({ onPair }: { onPair: (name: string, role: 'host' | 'guest') => void }) => {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  // Generate a random code when entering "create" mode
  useEffect(() => {
    if (mode === 'create') {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setGeneratedCode(code);
    }
  }, [mode]);

  const handleConnect = () => {
    if (!name) return;
    onPair(name, mode === 'create' ? 'host' : 'guest');
  };

  if (mode === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-rose-50 animate-fade-in relative overflow-hidden">
        
        {/* Decorative background elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-48 h-48 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 transform -translate-x-1/2"></div>

        {/* Enhanced Heart Icon */}
        <div className="relative mb-10 group cursor-pointer">
           <div className="absolute inset-0 bg-rose-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
           <div className="relative z-10 animate-heartbeat drop-shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#heartGradient)" className="w-32 h-32 filter drop-shadow-lg">
                <defs>
                  <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#e11d48" />
                  </linearGradient>
                </defs>
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
           </div>
        </div>

        <h1 className="text-4xl font-black text-rose-900 mb-2 tracking-tight">CuoreConnesso</h1>
        <p className="text-rose-600 mb-12 text-base font-medium">L'app per chi si ama, ovunque.</p>

        <div className="w-full max-w-xs space-y-4 z-10">
          <button 
            onClick={() => setMode('create')}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200/50 active:scale-95 transition-all"
          >
            Crea una Stanza
          </button>
          <button 
            onClick={() => setMode('join')}
            className="w-full bg-white text-rose-500 font-bold py-4 rounded-2xl border-2 border-rose-100 hover:bg-rose-50 active:scale-95 transition-all shadow-sm"
          >
            Unisciti con Codice
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-rose-50 animate-fade-in relative">
      <button 
        onClick={() => setMode('menu')}
        className="absolute top-6 left-6 text-rose-400 hover:text-rose-600 font-medium"
      >
        ← Indietro
      </button>

      <h2 className="text-2xl font-bold text-rose-900 mb-6">
        {mode === 'create' ? 'Il tuo Codice Amore' : 'Inserisci Codice'}
      </h2>

      {mode === 'create' && (
        <div className="mb-8 p-6 bg-white rounded-2xl border-2 border-dashed border-rose-300 w-full max-w-xs">
          <p className="text-xs text-rose-400 uppercase tracking-widest mb-2">Condividi questo codice</p>
          <p className="text-4xl font-mono font-bold text-rose-600 tracking-wider select-all">{generatedCode}</p>
        </div>
      )}

      <div className="w-full max-w-xs space-y-4">
        {mode === 'join' && (
          <div className="text-left">
            <label className="block text-xs font-bold text-rose-800 uppercase ml-1 mb-1">Codice Partner</label>
            <input 
              type="text" 
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              placeholder="ES. A1B2C3"
              className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-center font-mono text-lg uppercase placeholder:normal-case placeholder:font-sans"
            />
          </div>
        )}

        <div className="text-left">
          <label className="block text-xs font-bold text-rose-800 uppercase ml-1 mb-1">Il tuo Nome</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Come ti chiamerai?"
            className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
          />
        </div>

        <button 
          onClick={handleConnect}
          disabled={!name || (mode === 'join' && joinCode.length < 6)}
          className="w-full bg-rose-500 disabled:bg-rose-300 text-white font-bold py-4 rounded-xl shadow-lg mt-4 transition-colors"
        >
          {mode === 'create' ? 'Entra in attesa...' : 'Connetti Cuori'}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [partnerName, setPartnerName] = useState<string>('');
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [lastReceivedMessage, setLastReceivedMessage] = useState<Message | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  // Function to create floating hearts visual effect
  const triggerHeartAnimation = useCallback((color: string) => {
    const newHearts: Heart[] = [];
    const count = 8 + Math.floor(Math.random() * 6); // More hearts: 8 to 14
    
    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: Date.now() + i + Math.random(),
        x: 10 + Math.random() * 80, // Start X position
        scale: 0.4 + Math.random() * 0.9, // Varied Size
        color: color,
        // Physics for natural feel
        rotation: Math.random() * 120 - 60, // Rotate between -60 and 60 degrees
        driftX: Math.random() * 200 - 100, // Drift left or right up to 100px
        duration: 2.5 + Math.random() * 3, // Duration between 2.5s and 5.5s
      });
    }

    setHearts(prev => [...prev, ...newHearts]);

    // Cleanup hearts after animation (Max duration + buffer)
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 6000);
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification("CuoreConnesso", { body: "Le notifiche sono attive! ❤️" });
      }
    } catch (e) {
      console.error("Permission request failed", e);
    }
  };

  const handlePairing = (name: string, role: 'host' | 'guest') => {
    // In a real app, here we would verify the code with the backend
    setPartnerName(role === 'host' ? 'Partner (in attesa)' : 'Partner'); // Host waits for guest usually
    
    // Simulate finding the partner name after a brief delay
    setTimeout(() => {
        const finalName = role === 'host' ? 'La tua Ragazza' : 'Il tuo Ragazzo';
        setPartnerName(finalName);
        
        // SIMULATION ONLY: Receive a welcome message so the new "Received Message" card isn't empty
        setTimeout(() => {
            handleReceiveHeart(`Ciao ${name}, ora siamo connessi! ❤️`);
        }, 1500);

    }, 1500);

    setAppState('dashboard');
  };

  const handleReceiveHeart = async (msg: string) => {
    // Update state to show in Dashboard
    setLastReceivedMessage({
        text: msg,
        timestamp: new Date(),
        sender: 'partner'
    });

    // Trigger visual effect when receiving
    triggerHeartAnimation('text-pink-400');
    
    // 1. Try Service Worker Notification (Best for PWA/Android)
    if ('serviceWorker' in navigator && notificationPermission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification(`Amore da ${partnerName}`, {
          body: msg,
          icon: 'https://cdn-icons-png.flaticon.com/512/2190/2190552.png',
          badge: 'https://cdn-icons-png.flaticon.com/512/2190/2190552.png',
          vibrate: [200, 100, 200]
        } as any);
        return; // Success, exit
      } catch (e) {
        console.log("SW notification failed, falling back to standard API", e);
      }
    }

    // 2. Fallback to standard Notification API (Desktop/iOS foreground)
    if (notificationPermission === 'granted') {
      try {
        new Notification(`Amore da ${partnerName}`, {
            body: msg,
            icon: 'https://cdn-icons-png.flaticon.com/512/2190/2190552.png',
        });
      } catch (e) {
        console.log("Notification failed:", e);
      }
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-rose-50 to-white overflow-hidden font-sans">
      
      {/* Visual Layer */}
      <HeartOverlay hearts={hearts} />

      {/* Logic Layer */}
      {appState === 'onboarding' ? (
        <PairingScreen onPair={handlePairing} />
      ) : (
        <div className="h-full w-full relative">
          {/* Notification Permission Prompt (Only if needed) */}
          {notificationPermission === 'default' && (
            <div className="absolute top-0 left-0 w-full z-40 bg-rose-600 text-white px-4 py-2 text-xs flex justify-between items-center shadow-md">
              <span>Attiva le notifiche per ricevere i cuori!</span>
              <button 
                onClick={requestNotificationPermission}
                className="bg-white text-rose-600 px-3 py-1 rounded-full font-bold text-xs"
              >
                Attiva
              </button>
            </div>
          )}
          
          <Dashboard 
            partnerName={partnerName}
            onTriggerHeart={triggerHeartAnimation}
            lastReceivedMessage={lastReceivedMessage}
          />
        </div>
      )}
    </div>
  );
}
