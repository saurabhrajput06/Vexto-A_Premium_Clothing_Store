import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../Auth/Hook/UseAuth';
import { useWishlist } from '../Wishlist/Hook/useWishlist';
import { setSearch } from '../Products/state/product.slice';

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
  const dispatch = useDispatch();
  const search = useSelector(state => state.product.search || "");
  const [showSearch, setShowSearch] = useState(!!search);
  const cartItems = useSelector(state => state.cart.items);
  const cartCount = (cartItems || []).reduce((sum, item) => sum + item.quantity, 0);
  const { items: wishlistItems, handleGetWishlist } = useWishlist();
  const wishlistCount = wishlistItems?.length || 0;

  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
        (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')
      ) {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    const handleOpenSearch = () => setShowSearch(true);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-search', handleOpenSearch);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-search', handleOpenSearch);
    };
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (user) {
      handleGetWishlist();
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const transparent = false;

  const navBg = isScrolled
    ? "bg-white/80 backdrop-blur-md border-neutral-200"
    : "bg-white border-neutral-200";

  const textClass = "text-neutral-700 hover:text-black";
  const iconClass = "text-neutral-500 hover:text-black";
  const logoClass = "text-black";

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
          <button
            onClick={() => {
              const isOnHome = location.pathname === "/home" || location.pathname === "/";
              if (isOnHome) {
                const el = document.getElementById("product-section");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              } else {
                navigate("/collections");
              }
            }}
            className={`text-[11px] font-semibold uppercase tracking-widest transition-colors ${textClass}`}
          >
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
        <div className="flex items-center gap-3 sm:gap-5 ml-auto sm:ml-0">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100/50 transition-colors ${iconClass}`}
          >
            <SearchIcon />
          </button>

          <button
            onClick={() => navigate("/wishlist")}
            className={`relative transition-colors flex items-center ${iconClass}`}
          >
            <HeartIcon />
            {wishlistCount > 0 && (
              <span className={`absolute -top-1.5 -right-2 w-[16px] h-[16px] text-[9px] font-bold rounded-full flex items-center justify-center leading-none ${transparent ? 'bg-white text-black' : 'bg-black text-white'}`}>
                {wishlistCount}
              </span>
            )}
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

      {/* Dropdown Search Panel */}
      <div
        className={`absolute left-0 right-0 top-16 bg-white border-b border-neutral-200 px-6 py-4 shadow-lg transition-all duration-300 ease-in-out z-40
          ${showSearch
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'}`}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-3 bg-neutral-50 px-4 py-2.5 rounded-full border border-neutral-200 shadow-sm focus-within:border-neutral-400 focus-within:ring-1 focus-within:ring-neutral-400 transition-all duration-200">
          <span className="text-neutral-400 shrink-0">
            <SearchIcon />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search premium collections..."
            value={search}
            onChange={(e) => {
              dispatch(setSearch(e.target.value));
              if (location.pathname !== "/home" && location.pathname !== "/") {
                navigate("/home");
              }
            }}
            className="bg-transparent text-sm outline-none border-none text-neutral-800 w-full placeholder-neutral-400 font-medium"
          />
          {search && (
            <button
              onClick={() => dispatch(setSearch(""))}
              className="text-neutral-400 hover:text-black transition-colors text-xs font-semibold uppercase tracking-wider"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => {
              setShowSearch(false);
              dispatch(setSearch(""));
            }}
            className="text-neutral-400 hover:text-black font-semibold text-xs uppercase tracking-wider pl-3 border-l border-neutral-200 flex items-center gap-1 shrink-0"
          >
            Close
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="inline">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
