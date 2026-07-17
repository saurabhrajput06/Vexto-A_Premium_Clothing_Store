import React from 'react';

const Loader = ({ fullScreen = true, text = "Loading" }) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-white ${fullScreen ? 'min-h-screen w-screen fixed inset-0 z-50' : 'py-16 w-full'}`}>
      <div className="flex flex-col items-center gap-4">
        {/* Brand/Logo Name */}
        <h1 className="font-serif text-3xl font-medium tracking-[0.25em] text-neutral-900 uppercase animate-pulse select-none">
          Vexto
        </h1>
        {/* Sleek Minimalist Linear Progress Bar */}
        <div className="w-24 h-[1px] bg-neutral-100 overflow-hidden relative rounded-full">
          <div className="absolute top-0 bottom-0 left-0 bg-neutral-900 w-1/3 animate-[loadingBar_1.2s_ease-in-out_infinite] rounded-full"></div>
        </div>
        {/* Mini text */}
        {text && (
          <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-neutral-400 mt-1 animate-pulse">
            {text}
          </span>
        )}
      </div>
      
      {/* Dynamic Keyframes injected for the loadingBar animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loadingBar {
          0% {
            left: -33%;
            width: 33%;
          }
          50% {
            width: 40%;
          }
          100% {
            left: 100%;
            width: 33%;
          }
        }
      `}} />
    </div>
  );
};

export default Loader;
