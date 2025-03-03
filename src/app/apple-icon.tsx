import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 180,
  height: 180,
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
        <svg width="180" height="180" viewBox="0 0 180 180">
          {/* Clock face */}
          <circle cx="90" cy="90" r="80" fill="white"/>
          
          {/* Clock outline */}
          <circle cx="90" cy="90" r="75" stroke="#1E90FF" strokeWidth="2" fill="none"/>
          
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) * Math.PI / 180;
            const x1 = 90 + 65 * Math.sin(angle);
            const y1 = 90 - 65 * Math.cos(angle);
            const x2 = 90 + 72 * Math.sin(angle);
            const y2 = 90 - 72 * Math.cos(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#1E90FF"
                strokeWidth="6"
                strokeLinecap="round"
              />
            );
          })}
          
          {/* Clock hands */}
          <line 
            x1="90" 
            y1="90" 
            x2="90" 
            y2="35" 
            stroke="#32CD32" 
            strokeWidth="8" 
            strokeLinecap="round"
          />
          <line 
            x1="90" 
            y1="90" 
            x2="135" 
            y2="90" 
            stroke="#32CD32" 
            strokeWidth="8" 
            strokeLinecap="round"
          />
          
          {/* Center dot */}
          <circle cx="90" cy="90" r="6" fill="#1E90FF"/>
        </svg>
      </div>
    ),
    { ...size }
  );
} 