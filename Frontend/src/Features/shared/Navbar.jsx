import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { useAuth } from '../Auth/Hook/UseAuth';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { handleLogout } = useAuth();
  
  const user = useSelector(state => state.auth.user);
  const cartItems = useSelector(state => state.cart.items);
  const cartCount = (cartItems || []).reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  const transparent = isHome && !isScrolled;

  const navBg = transparent 
    ? "bg-transparent border-transparent" 
    : "bg-white/80 backdrop-blur-md border-neutral-200";

  const textClass = transparent ? "text-white/90 hover:text-white" : "text-neutral-700 hover:text-black";
  const iconClass = transparent ? "text-white/90 hover:text-white" : "text-neutral-500 hover:text-black";
  const logoClass = transparent ? "text-white" : "text-black";

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <nav className={`sticky top-0 z-50 border-b px-6 transition-all duration-300 ${navBg}`}>
      <div className="max-w-5xl mx-auto h-16 flex items-center justify-between relative">
        {/* Left Links */}
        <div className="flex items-center gap-6 hidden sm:flex">
          <button onClick={() => navigate("/")} className={`text-[11px] font-semibold uppercase tracking-widest transition-colors ${textClass}`}>
            NEW
          </button>
          <button onClick={() => navigate("/")} className={`text-[11px] font-semibold uppercase tracking-widest transition-colors ${textClass}`}>
            COLLECTIONS
          </button>
        </div>

        {/* Logo */}
        <span
          onClick={() => navigate("/")}
          className={`absolute left-1/2 -translate-x-1/2 font-serif font-bold text-2xl tracking-[0.15em] cursor-pointer uppercase transition-colors ${logoClass}`}
        >
          VEXTO
        </span>

        {/* Right Icons */}
        <div className="flex items-center gap-5 ml-auto sm:ml-0">
          <button className={`transition-colors ${iconClass}`}>
            <SearchIcon />
          </button>
          
          <button className={`transition-colors hidden sm:block ${iconClass}`}>
            <HeartIcon />
          </button>

          <button
            onClick={() => navigate("/cart")}
            className={`relative transition-colors flex items-center ${iconClass}`}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className={`absolute -top-1.5 -right-2 w-[16px] h-[16px] text-[9px] font-bold rounded-full flex items-center justify-center leading-none ${transparent ? 'bg-white text-black' : 'bg-black text-white'}`}>
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center transition-colors ${iconClass}`}
              >
                <UserIcon />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-4 w-52 bg-white border border-neutral-100 shadow-xl rounded-xl py-2 z-50">
                  <div className="px-4 py-2.5 text-[10px] text-neutral-400 border-b border-neutral-100 mb-1 truncate uppercase tracking-widest font-semibold">
                    Signed in as {user.email?.split('@')[0]}
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate('/account'); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                  >
                    My Account
                  </button>
                  {user.role === 'seller' && (
                    <button
                      onClick={() => { setDropdownOpen(false); navigate('/seller/dashboard'); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                    >
                      Seller Dashboard
                    </button>
                  )}
                  <div className="border-t border-neutral-100 mt-1 pt-1">
                    <button onClick={onLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className={`transition-colors ${iconClass}`}
            >
              <UserIcon />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
