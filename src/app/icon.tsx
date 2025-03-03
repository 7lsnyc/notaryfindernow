import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1E90FF', // Blue background
          borderRadius: '50%',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32">
          {/* Clock face */}
          <circle cx="16" cy="16" r="14" fill="white"/>
          
          {/* Clock outline */}
          <circle cx="16" cy="16" r="13" stroke="#1E90FF" strokeWidth="1" fill="none"/>
          
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) * Math.PI / 180;
            const x1 = 16 + 10 * Math.sin(angle);
            const y1 = 16 - 10 * Math.cos(angle);
            const x2 = 16 + 12 * Math.sin(angle);
            const y2 = 16 - 12 * Math.cos(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#1E90FF"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
          
          {/* Clock hands */}
          <line 
            x1="16" 
            y1="16" 
            x2="16" 
            y2="8" 
            stroke="#32CD32" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <line 
            x1="16" 
            y1="16" 
            x2="22" 
            y2="16" 
            stroke="#32CD32" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          
          {/* Center dot */}
          <circle cx="16" cy="16" r="1.5" fill="#1E90FF"/>
        </svg>
      </div>
    ),
    { ...size }
  );
} 