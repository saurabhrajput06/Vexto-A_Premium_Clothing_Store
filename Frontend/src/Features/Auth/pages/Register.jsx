import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../Hook/UseAuth';
import {useNavigate} from "react-router";
import ContinueWithGoogle from '../components/ContinueWithGoogle';

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
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-neutral-900">
      {/* Left Branding Panel (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-100 overflow-hidden items-end justify-start p-16">
        {/* Fashion Image Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('/vexto_pretty_model.png')" }}
        ></div>
        {/* Minimal Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 transition-opacity"></div>
        
        {/* Stylish Text over the image */}
        <div className="z-20 relative text-left w-full">
          <h1 
            className="text-7xl lg:text-[8rem] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-2 leading-none font-serif tracking-[0.15em] drop-shadow-2xl uppercase" 
          >
            VEXTO
          </h1>
          <h2 className="text-white text-2xl lg:text-3xl font-light mb-6 tracking-wide drop-shadow-md">
            The Next-Gen<br/>
            <span className="font-medium">Shopping Experience.</span>
          </h2>
          <div className="w-12 h-1 bg-white mb-6"></div>
          <p className="text-white/80 text-xs md:text-sm leading-loose max-w-md font-medium tracking-[0.2em] uppercase drop-shadow-md">
            Where Premium Curations Meet Visionary Creators.<br/>
            Shop the Extraordinary, Grow Your Brand with Absolute Elegance.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto bg-white">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-5xl font-serif text-neutral-900 mb-3 tracking-tight">
              Create Account
            </h2>
            <p className="text-neutral-500 text-base tracking-wide">
              Join our exclusive platform today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fullname */}
              <div>
                <label className="block text-sm font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full bg-neutral-50 text-neutral-900 rounded-sm px-4 py-3.5 border border-neutral-200 focus:border-neutral-900 focus:bg-white transition-colors outline-none text-base"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                  Contact
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full bg-neutral-50 text-neutral-900 rounded-sm px-4 py-3.5 border border-neutral-200 focus:border-neutral-900 focus:bg-white transition-colors outline-none text-base"
                  placeholder="+91XXXXXXXXXX"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-neutral-50 text-neutral-900 rounded-sm px-4 py-3.5 border border-neutral-200 focus:border-neutral-900 focus:bg-white transition-colors outline-none text-base"
                placeholder="hello@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-widest text-neutral-500 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-neutral-50 text-neutral-900 rounded-sm px-4 py-3.5 border border-neutral-200 focus:border-neutral-900 focus:bg-white transition-colors outline-none text-base"
                placeholder="••••••••"
                required
              />
            </div>

            {/* isSeller Checkbox */}
            <div 
              className="flex items-center mt-6 p-4 bg-neutral-50 rounded-sm border border-neutral-200 relative group cursor-pointer transition-colors hover:bg-white hover:border-neutral-300" 
              onClick={() => setFormData(p => ({ ...p, isSeller: !p.isSeller }))}
            >
              <div className={`w-5 h-5 flex items-center justify-center border transition-all mr-4
                ${formData.isSeller ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-300 bg-white group-hover:border-neutral-400'}`}>
                {formData.isSeller && (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <span className="block text-base font-medium text-neutral-900">Register as Seller</span>
                <span className="block text-sm text-neutral-500 mt-0.5">Check this if you plan to sell products.</span>
              </div>
            </div>
           
           <ContinueWithGoogle/>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-neutral-900 text-white rounded-sm py-4 px-8 font-semibold text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors mt-8 shadow-sm"
            >
              Create Account
            </button>
          </form>

          <div className="mt-10 text-center lg:text-left border-t border-neutral-100 pt-8">
            <p className="text-base text-neutral-500">
              Already have an account?{' '}
              <Link to="/login" className="text-neutral-900 hover:text-neutral-600 font-medium transition-colors underline underline-offset-4">
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