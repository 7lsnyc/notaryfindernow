export default function Logo({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="16" cy="16" r="16" fill="#1E90FF"/>
      
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
  );
} 