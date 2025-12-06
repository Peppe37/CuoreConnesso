
import React from 'react';
import { Heart } from '../types';

interface HeartOverlayProps {
  hearts: Heart[];
}

export const HeartOverlay: React.FC<HeartOverlayProps> = ({ hearts }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-[-50px] animate-float-up will-change-transform"
          style={{
            left: `${heart.x}%`,
            // Inject random physics values into CSS variables
            '--tx': `${heart.driftX}px`, 
            '--rot': `${heart.rotation}deg`,
            animationDuration: `${heart.duration}s`,
            animationTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Soft easing
          } as React.CSSProperties}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`h-16 w-16 drop-shadow-xl ${heart.color}`}
            style={{ transform: `scale(${heart.scale})` }}
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </div>
      ))}
    </div>
  );
};
