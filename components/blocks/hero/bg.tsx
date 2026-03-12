import React from 'react';

export default function HeroBg() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[url('/imgs/disney/Image-01.jpg')] bg-cover bg-center pb-80">
      <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-background/10" />
    </div>
  );
}
