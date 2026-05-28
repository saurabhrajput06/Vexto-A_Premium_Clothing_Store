import React from "react";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#090b0c] text-white flex flex-col items-center justify-between px-6 py-12 relative overflow-hidden select-none">
      {/* Background Decorative Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.07)_0%,transparent_60%)] pointer-events-none z-0"></div>

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between h-full flex-grow relative z-10">
        {/* Header */}
        <header className="w-full text-center py-4">
          <h1 className="font-helvetica text-7xl font-bold tracking-[0.25em] text-white/90 uppercase hover:text-white transition-colors cursor-pointer" onClick={() => navigate("/")}>
            VEXTO
          </h1>
        </header>

        {/* Main Content */}
        <section className="flex flex-col items-center text-center my-auto py-16">
          <div className="mb-6 flex flex-col items-center">
            {/* Big Elegant 404 Typo */}
            <span className="font-serif text-[120px] md:text-[160px] font-extralight leading-none tracking-widest text-[#c5a059]/10 selection:bg-transparent">
              404
            </span>
            <span className="border border-[#c5a059]/30 text-[#c5a059] px-5 py-1.5 uppercase tracking-[0.3em] text-[10px] font-semibold bg-[#c5a059]/5 rounded-full -mt-8">
              Error 404
            </span>
          </div>

          <h2 className="font-serif font-medium text-4xl md:text-5xl text-white tracking-tight mb-6">
            Lost in Style
          </h2>
          <p className="text-neutral-400 font-sans text-sm md:text-base max-w-md mx-auto leading-relaxed mb-12">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
            <button 
              className="bg-white hover:bg-neutral-200 text-neutral-950 px-10 py-4 uppercase font-semibold text-xs tracking-[0.2em] transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg active:translate-y-0 cursor-pointer" 
              onClick={() => navigate("/login")}
            >
              Sign In to Account
            </button>
            <button 
              className="border border-white/20 hover:border-white text-white hover:bg-white/5 px-10 py-4 uppercase font-semibold text-xs tracking-[0.2em] transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg active:translate-y-0 cursor-pointer" 
              onClick={() => navigate("/")}
            >
              Back to Collection
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full text-center text-neutral-600 uppercase text-[9px] tracking-[0.3em] font-sans py-4">
          &copy; {new Date().getFullYear()} VEXTO . All Rights Reserved.
        </footer>
      </div>
    </main>
  );
};

export default NotFoundPage;
