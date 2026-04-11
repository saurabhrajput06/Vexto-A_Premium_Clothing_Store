import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../Hook/UseAuth';

const Login = () => {
 const {handleLogin} = useAuth();
 const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin({
          email: formData.email,
          password: formData.password
      });
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#131313] font-['Inter',sans-serif]">
      {/* Left Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1c1b1b] overflow-hidden items-end justify-start border-r border-[#ffd700]/10 p-16">
        {/* Fashion Image Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-80" 
          style={{ backgroundImage: "url('/vexto_model_mib.png')" }}
        ></div>
        {/* Deep Gradient Overlay to make text pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-[#131313]/10 z-10 transition-opacity"></div>
        <div className="absolute inset-0 bg-[#ffd700]/5 z-10 mix-blend-color-burn"></div>
        
        {/* Stylish Text over the image */}
        <div className="z-20 relative text-left w-full">
          <h1 
            className="text-7xl lg:text-[7rem] text-transparent bg-clip-text bg-gradient-to-br from-[#ffd700] via-[#e9c400] to-[#b39500] mb-2 leading-none" 
            style={{ fontFamily: '"Playfair Display", "Georgia", serif', fontStyle: 'italic', fontWeight: '900', letterSpacing: '0.02em', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.8))' }}
          >
            VEXTO
          </h1>
          <h2 className="text-[#e5e2e1] text-2xl lg:text-3xl font-light mb-6 tracking-wide drop-shadow-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Welcome<br/>
            <span className="font-bold text-[#ffd700]">Back.</span>
          </h2>
          <div className="w-12 h-1 bg-[#ffd700] rounded-full mb-6"></div>
          <p className="text-[#e5e2e1]/90 text-lg leading-relaxed max-w-sm drop-shadow-md">
            Enter your credentials to access the world's most exclusive digital shopping platform.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-lg bg-[#1c1b1b] lg:bg-transparent rounded-3xl p-8 sm:p-12 lg:p-4 shadow-[0_0_24px_rgba(0,0,0,0.5)] lg:shadow-none">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-[#e5e2e1] mb-2 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Sign In
            </h2>
            <p className="text-[#d0c6ab] text-sm tracking-wide">
              Access your exclusive Vexto account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm text-[#d0c6ab] tracking-wide mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0e0e0e] text-[#e5e2e1] rounded-xl px-5 py-4 border border-[#4d4732]/20 focus:border-[#ffd700]/80 focus:ring-1 focus:ring-[#ffd700]/50 transition-all outline-none"
                placeholder="hello@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2 ml-1 mr-1">
                <label className="block text-sm text-[#d0c6ab] tracking-wide">
                  Password
                </label>
                <a href="#" className="text-xs text-[#ffd700] hover:text-[#e9c400] transition-colors">
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#0e0e0e] text-[#e5e2e1] rounded-xl px-5 py-4 border border-[#4d4732]/20 focus:border-[#ffd700]/80 focus:ring-1 focus:ring-[#ffd700]/50 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#ffd700] to-[#e9c400] text-[#3a3000] rounded-full py-4 px-8 font-bold text-sm tracking-[0.15em] uppercase hover:shadow-[0_0_24px_rgba(255,215,0,0.3)] transition-all mt-8"
            >
              Log In
            </button>
          </form>

          <div className="mt-8 text-center lg:text-left">
            <p className="text-sm text-[#d0c6ab]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#ffd700] hover:text-[#e9c400] font-semibold transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;