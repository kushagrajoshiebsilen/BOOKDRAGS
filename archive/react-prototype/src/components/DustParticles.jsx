import React, { useMemo } from 'react';

export const DustParticles = () => {
  // Generate random static values for 24 dust motes
  const motes = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {motes.map((mote) => (
        <div
          key={mote.id}
          className="dust-mote"
          style={{
            width: `${mote.size}px`,
            height: `${mote.size}px`,
            left: `${mote.left}%`,
            top: `${mote.top}%`,
            animationDuration: `${mote.duration}s`,
            animationDelay: `${mote.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
