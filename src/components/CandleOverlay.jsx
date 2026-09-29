import React from 'react';

export const CandleOverlay = () => {
  return (
    <>
      {/* Heavy Gothic Outer Vignette */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(13,8,5,0.75)_80%,rgba(13,8,5,0.95)_100%)]" />
      
      {/* Warm Candle Light Pulse Top Corners */}
      <div className="fixed top-0 left-0 w-96 h-96 pointer-events-none z-10 bg-[radial-gradient(circle_at_top_left,rgba(212,162,76,0.18)_0%,rgba(0,0,0,0)_70%)] animate-candle-flicker" />
      <div className="fixed top-0 right-0 w-96 h-96 pointer-events-none z-10 bg-[radial-gradient(circle_at_top_right,rgba(212,162,76,0.18)_0%,rgba(0,0,0,0)_70%)] animate-candle-flicker" style={{ animationDelay: '1.2s' }} />
    </>
  );
};
