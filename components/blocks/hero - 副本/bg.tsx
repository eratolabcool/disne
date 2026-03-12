import React from 'react';

export default function HeroBg() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/imgs/disney/image-01.jpg")',
          opacity: 0.8
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
    </div>
  );
}
