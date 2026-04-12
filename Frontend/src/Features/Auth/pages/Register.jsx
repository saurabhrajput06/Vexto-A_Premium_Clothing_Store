import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../Hook/UseAuth';
import {useNavigate} from "react-router";

const Register = () => {
 const {handleRegister}=useAuth();
 const navigate=useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    isSeller: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({
        email:formData.email,
        contact:formData.contact,
        password:formData.password,
        fullname:formData.fullname,
        isSeller:formData.isSeller

    })
    navigate("/");
    console.log("Registering...", formData);
    // TODO: Add registration API call here
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
            The Next-Gen<br/>
            <span className="font-bold text-[#ffd700]">Shopping Experience.</span>
          </h2>
          <div className="w-12 h-1 bg-[#ffd700] rounded-full mb-6"></div>
          <p className="text-[#e5e2e1]/90 text-lg leading-relaxed max-w-sm drop-shadow-md">
            Join the most exclusive digital platform. Connect, sell, and grow your brand with absolute elegance.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-lg bg-[#1c1b1b] lg:bg-transparent rounded-3xl p-8 sm:p-12 lg:p-4 shadow-[0_0_24px_rgba(0,0,0,0.5)] lg:shadow-none">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-[#e5e2e1] mb-2 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Create Account
            </h2>
            <p className="text-[#d0c6ab] text-sm tracking-wide">
              Join our exclusive platform today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fullname */}
              <div>
                <label className="block text-sm text-[#d0c6ab] tracking-wide mb-2 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full bg-[#0e0e0e] text-[#e5e2e1] rounded-xl px-5 py-4 border border-[#4d4732]/20 focus:border-[#ffd700]/80 focus:ring-1 focus:ring-[#ffd700]/50 transition-all outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm text-[#d0c6ab] tracking-wide mb-2 ml-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full bg-[#0e0e0e] text-[#e5e2e1] rounded-xl px-5 py-4 border border-[#4d4732]/20 focus:border-[#ffd700]/80 focus:ring-1 focus:ring-[#ffd700]/50 transition-all outline-none"
                  placeholder="+91XXXXXXXXXX"
                  required
                />
              </div>
            </div>

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
              <label className="block text-sm text-[#d0c6ab] tracking-wide mb-2 ml-1">
                Password
              </label>
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

            {/* isSeller Checkbox */}
            <div 
              className="flex items-center mt-8 p-4 bg-[#0e0e0e] rounded-xl border border-[#4d4732]/10 relative group cursor-pointer transition-colors hover:bg-[#131313]" 
              onClick={() => setFormData(p => ({ ...p, isSeller: !p.isSeller }))}
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-all mr-4
                ${formData.isSeller ? 'bg-[#ffd700] border-[#ffd700]' : 'border-[#4d4732]/40 group-hover:border-[#ffd700]/50'}`}>
                {formData.isSeller && (
                  <svg className="w-4 h-4 text-[#3a3000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <span className="block text-[#e5e2e1] font-medium tracking-wide">Register as Seller</span>
                <span className="block text-xs text-[#d0c6ab]/70 mt-1">Check this if you plan to sell products.</span>
              </div>

             
            </div>
            <a href="/api/auth/google" className="w-full bg-gradient-to-r from-[#ffd700] to-[#e9c400] text-[#3a3000] rounded-full py-4 px-8 font-bold text-sm tracking-[0.15em] uppercase hover:shadow-[0_0_24px_rgba(255,215,0,0.3)] transition-all mt-8">
             Continue with Google
            </a>


            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#ffd700] to-[#e9c400] text-[#3a3000] rounded-full py-4 px-8 font-bold text-sm tracking-[0.15em] uppercase hover:shadow-[0_0_24px_rgba(255,215,0,0.3)] transition-all mt-8"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center lg:text-left">
            <p className="text-sm text-[#d0c6ab]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#ffd700] hover:text-[#e9c400] font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;