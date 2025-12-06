
export interface Heart {
  id: number;
  x: number;      // Starting left position (%)
  scale: number;  // Size
  color: string;
  // New physics properties
  rotation: number; // End rotation (deg)
  driftX: number;   // Horizontal movement (px)
  duration: number; // Animation speed (s)
}

export interface Message {
  text: string;
  timestamp: Date;
  sender: 'me' | 'partner';
}

export type AppState = 'onboarding' | 'dashboard';
