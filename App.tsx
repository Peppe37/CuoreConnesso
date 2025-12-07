
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HeartOverlay } from './components/HeartOverlay';
import { Dashboard } from './components/Dashboard';
import { Heart, AppState, Message } from './types';
import { api } from './services/api';

// Enhanced Pairing Screen with "Create" vs "Join" logic and improved visuals
const PairingScreen = ({ onPair }: { onPair: (name: string, role: 'host' | 'guest', code: string) => void }) => {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRoom = async () => {
      setIsLoading(true);
      setError(null);
      try {
          const data = await api.createRoom(name);
          setGeneratedCode(data.code);
          // Wait for partner to join (polling handled by parent or here?
          // For simplicity, we just enter "wait" mode here and let the parent handle polling once "connected"
          // But actually, we need to know when a guest joins to proceed.
          // Let's pass the code up and let the parent start polling immediately.
          onPair(name, 'host', data.code);
      } catch (e: any) {
          setError(e.message);
      } finally {
          setIsLoading(false);
      }
  };

  const handleJoinRoom = async () => {
      setIsLoading(true);
      setError(null);
      try {
          const data = await api.joinRoom(joinCode, name);
          onPair(name, 'guest', joinCode);
      } catch (e: any) {
          setError(e.message);
      } finally {
          setIsLoading(false);
      }
  };

  const handleConnect = () => {
    if (!name) return;
    if (mode === 'create') {
        handleCreateRoom();
    } else {
        handleJoinRoom();
    }
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
        {mode === 'create' ? 'Crea la tua Stanza' : 'Inserisci Codice'}
      </h2>

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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button 
          onClick={handleConnect}
          disabled={!name || (mode === 'join' && joinCode.length < 6) || isLoading}
          className="w-full bg-rose-500 disabled:bg-rose-300 text-white font-bold py-4 rounded-xl shadow-lg mt-4 transition-colors flex justify-center items-center"
        >
          {isLoading ? (
             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : (
            mode === 'create' ? 'Crea Codice' : 'Connetti Cuori'
          )}
        </button>
      </div>
    </div>
  );
};

// Footer for Notifications (Non-blocking)
const NotificationFooter = ({ onRequest }: { onRequest: () => void }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 bg-white border-t border-rose-100 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] animate-slide-up pb-8">
            <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-4">
                 <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center shrink-0 text-2xl">
                        🔔
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-rose-900 leading-tight">Attiva le Notifiche</h3>
                        <p className="text-xs text-slate-600 leading-snug">
                            Necessario per ricevere i cuori del partner anche ad app chiusa.
                        </p>
                    </div>
                 </div>
                 <button
                    onClick={onRequest}
                    className="w-full sm:w-auto whitespace-nowrap bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 rounded-xl shadow-md active:scale-95 transition-all"
                >
                    Attiva
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
    typeof Notification !== 'undefined' ? Notification.permission : 'granted'
  );

  // Check permission on focus (in case user changes settings)
  useEffect(() => {
    const checkPermission = () => {
      if (typeof Notification !== 'undefined') {
        setNotificationPermission(Notification.permission);
      }
    };

    window.addEventListener('focus', checkPermission);
    return () => window.removeEventListener('focus', checkPermission);
  }, []);

  // App Logic State
  const [myRole, setMyRole] = useState<'host' | 'guest' | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [myName, setMyName] = useState<string>('');
  const [lastPollTime, setLastPollTime] = useState<number>(0);

  // Persistence Effect
  useEffect(() => {
    // Load from localStorage on mount
    const savedRoom = localStorage.getItem('cc_room');
    if (savedRoom) {
      try {
        const { roomCode: r, myName: n, myRole: ro, partnerName: pn } = JSON.parse(savedRoom);
        if (r && n && ro) {
           setRoomCode(r);
           setMyName(n);
           setMyRole(ro);
           setPartnerName(pn || (ro === 'host' ? 'In attesa...' : ''));
           setAppState('dashboard');
        }
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever critical state changes
    if (appState === 'dashboard' && roomCode && myName && myRole) {
      localStorage.setItem('cc_room', JSON.stringify({
        roomCode,
        myName,
        myRole,
        partnerName
      }));
    }
  }, [appState, roomCode, myName, myRole, partnerName]);

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
    if (!('Notification' in window)) {
        setNotificationPermission('granted');
        return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification("CuoreConnesso", { body: "Le notifiche sono attive! ❤️" });
      } else if (permission === 'default') {
          alert("Per favore clicca su 'Consenti' nel messaggio che appare per attivare le notifiche.");
      } else {
          // If denied, we can't do much but maybe alert the user
          alert("Devi attivare le notifiche dalle impostazioni del browser per usare l'app.");
      }
    } catch (e) {
      console.error("Permission request failed", e);
    }
  };

  const handlePairing = (name: string, role: 'host' | 'guest', code: string) => {
    setMyName(name);
    setMyRole(role);
    setRoomCode(code);
    setAppState('dashboard');
    if (role === 'host') {
        setPartnerName("In attesa del partner...");
    }
  };

  const handleReceiveHeart = async (msg: string, senderName: string, color: string) => {
    // Update state to show in Dashboard
    setLastReceivedMessage({
        text: msg,
        timestamp: new Date(),
        sender: 'partner'
    });

    // Trigger visual effect when receiving, using the correct color
    triggerHeartAnimation(color || 'text-pink-400');
    
    // 1. Try Service Worker Notification (Best for PWA/Android)
    if ('serviceWorker' in navigator && notificationPermission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification(`Amore da ${senderName}`, {
          body: msg,
          icon: '/logo.svg', // Use local logo
          badge: '/logo.svg',
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
        new Notification(`Amore da ${senderName}`, {
            body: msg,
            icon: '/logo.svg',
        });
      } catch (e) {
        console.log("Notification failed:", e);
      }
    }
  };

  // Polling Effect
  useEffect(() => {
    if (!roomCode || appState !== 'dashboard') return;

    const poll = async () => {
        try {
            const data = await api.pollMessages(roomCode, lastPollTime);

            // Update Room State (check if partner joined)
            if (data.roomState) {
                if (myRole === 'host' && data.roomState.guest) {
                    setPartnerName(data.roomState.guest);
                } else if (myRole === 'guest' && data.roomState.host) {
                    setPartnerName(data.roomState.host);
                }
            }

            // Process Messages
            if (data.messages && data.messages.length > 0) {
                // Filter messages that are not from me
                const newMessages = data.messages.filter((m: any) => m.sender !== myName && m.timestamp > lastPollTime);

                if (newMessages.length > 0) {
                    const latestMsg = newMessages[newMessages.length - 1];
                    // Pass color to handler
                    handleReceiveHeart(latestMsg.text, latestMsg.sender, latestMsg.color);
                    setLastPollTime(latestMsg.timestamp);
                } else {
                    // Update poll time anyway to avoid refetching old messages if we restart
                    const maxTime = Math.max(...data.messages.map((m: any) => m.timestamp));
                    if (maxTime > lastPollTime) setLastPollTime(maxTime);
                }
            }
        } catch (e) {
            console.error("Polling error", e);
        }
    };

    const interval = setInterval(poll, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [roomCode, appState, lastPollTime, myName, myRole]);

  const handleTriggerHeart = async (color: string, message: string) => {
      // Local animation
      triggerHeartAnimation(color);

      // Send to backend
      if (roomCode && myName) {
          try {
              await api.sendMessage(roomCode, myName, message, color);
          } catch (e) {
              console.error("Failed to send", e);
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
        <div className="h-full w-full relative flex flex-col items-center">
            {/* Room Code Display for Host */}
            {myRole === 'host' && partnerName.includes('attesa') && (
                <div className="mt-4 p-4 bg-white rounded-xl shadow-lg border-2 border-dashed border-rose-300 z-10">
                     <p className="text-xs text-rose-400 uppercase tracking-widest mb-1 text-center">Codice Stanza</p>
                     <p className="text-3xl font-mono font-bold text-rose-600 tracking-wider select-all">{roomCode}</p>
                </div>
            )}

            {/* Footer Notification (Non-blocking) */}
            {notificationPermission === 'default' && (
                <NotificationFooter onRequest={requestNotificationPermission} />
            )}

            {/* If Denied, we might want to show something or just let them use it but warn them.
                User said "deve per forza essere accettata". If denied, the browser won't show the prompt again.
                So we show a message telling them to fix it. */}
            {notificationPermission === 'denied' && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                         <h3 className="text-xl font-bold text-red-600 mb-3">Notifiche Bloccate ⚠️</h3>
                        <p className="text-slate-600 mb-4">
                            Hai bloccato le notifiche. Senza di esse l'app non può funzionare correttamente.
                        </p>
                        <p className="text-sm text-slate-500 mb-6">
                            Vai nelle impostazioni del tuo browser, sblocca le notifiche per questo sito e ricarica la pagina.
                        </p>
                        <button
                             onClick={() => window.location.reload()}
                             className="text-rose-600 font-bold hover:underline"
                        >
                            Ricarica Pagina
                        </button>
                    </div>
                </div>
            )}
          
            <Dashboard
                partnerName={partnerName}
                onTriggerHeart={handleTriggerHeart}
                lastReceivedMessage={lastReceivedMessage}
            />
        </div>
      )}
    </div>
  );
}
