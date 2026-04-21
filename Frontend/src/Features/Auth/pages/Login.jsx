import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../Hook/UseAuth';
import ContinueWithGoogle from '../components/ContinueWithGoogle';

const Login = () => {
  const { handleLogin } = useAuth();
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
      const user = await handleLogin({
        email: formData.email,
        password: formData.password
      });

      if (user.role == "buyer") {
        navigate("/");
      }
      else if (user.role == "seller") {
        navigate("/seller/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
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
            Welcome<br />
            <span className="font-medium">Back.</span>
          </h2>
          <div className="w-12 h-1 bg-white mb-6"></div>
          <p className="text-white/80 text-xs md:text-sm leading-loose max-w-md font-medium tracking-[0.2em] uppercase drop-shadow-md">
            Step back into the realm of Exclusivity.<br />
            Enter your credentials to access the world's most Curated Digital Experience.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto bg-white">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-5xl font-serif text-neutral-900 mb-3 tracking-tight">
              Sign In
            </h2>
            <p className="text-neutral-500 text-base tracking-wide">
              Access your exclusive Vexto account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold uppercase tracking-widest text-neutral-500">
                  Password
                </label>
                <a href="#" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-2">
                  Forgot Password?
                </a>
              </div>
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-neutral-900 text-white rounded-sm py-4 px-8 font-semibold text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors mt-8 shadow-sm"
            >
              Log In
            </button>
            <ContinueWithGoogle />
          </form>

          <div className="mt-10 text-center lg:text-left border-t border-neutral-100 pt-8">
            <p className="text-base text-neutral-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-neutral-900 hover:text-neutral-600 font-medium transition-colors underline underline-offset-4">
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