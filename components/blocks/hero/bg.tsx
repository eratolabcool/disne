import React from 'react';

export default function HeroBg({ src }: { src?: string }) {
  const bgImage = src || '/imgs/disney/Image-01.jpg';
  return (
    <div 
      className="absolute inset-0 -z-10 overflow-hidden bg-cover bg-center pb-80"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-background/10" />
    </div>
  );
}
