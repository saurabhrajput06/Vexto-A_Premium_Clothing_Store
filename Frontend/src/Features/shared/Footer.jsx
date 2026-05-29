import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

/* ── Social Icons ── */
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeWidth={2} />
  </svg>
);
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l-6.75-3.75v7.5l6.75-3.75z" />
    <rect x="2" y="5" width="20" height="14" rx="4" />
  </svg>
);
const PinterestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const FOOTER_LINKS = {
  SHOP: [
    { label: 'New Arrivals', path: '/home' },
    { label: 'Best Sellers', path: '/home' },
    { label: "Men's Collection", path: '/home' },
    { label: "Women's Collection", path: '/home' },
  ],
  SUPPORT: [
    { label: 'Track Your Order', path: '/cart' },
    { label: 'Shipping Policy', path: '#' },
    { label: 'Easy Returns', path: '#' },
    { label: 'FAQs', path: '#' },
  ],
  SELLERS: [
    { label: 'Become a Seller', path: '/register' },
    { label: 'Seller Dashboard', path: '/seller/dashboard' },
    { label: 'List a Product', path: '/seller/products/create' },
    { label: 'Seller Support', path: '#' },
  ],
  COMPANY: [
    { label: 'About Us', path: '#' },
    { label: 'Careers', path: '#' },
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Service', path: '#' },
  ],
};

const Footer = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleLink = (path) => {
    if (path === '#') return;
    navigate(path);
  };

  return (
    <footer className="bg-[#0d0d0d] text-white font-sans mt-auto">
      {/* ── TOP SECTION ── */}
      <div className="max-w-[1280px] mx-auto pt-16 pb-10 px-6 sm:px-10 flex flex-wrap gap-12 justify-between items-start border-b border-white/10">

        {/* Brand + Social */}
        <div className="flex-[1_1_260px] max-w-[320px]">
          <div className="text-3xl font-bold tracking-tight text-white mb-1 font-serif flex items-center gap-1.5 uppercase">
            VEXTO<span className="text-[#d4af8a] text-[2rem] leading-none">.</span>
          </div>

          <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-[260px]">
            Redefining streetwear through curated drops and bold fashion.
            Designed for those who dare to stand out.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            {[
              { icon: <InstagramIcon />, label: 'Instagram' },
              { icon: <PinterestIcon />, label: 'Pinterest' },
              { icon: <TwitterIcon />, label: 'Twitter' },
              { icon: <YoutubeIcon />, label: 'YouTube' },
            ].map((s) => (
              <button
                key={s.label}
                aria-label={s.label}
                title={s.label}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-[#d4af8a]/15 hover:border-[#d4af8a] hover:text-[#d4af8a] transition-all duration-300"
              >
                {s.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex-[1_1_320px] max-w-[420px]">
          <p className="text-[10px] tracking-widest uppercase text-[#d4af8a] font-semibold mb-2">
            Subscribe to Vexto
          </p>
          <p className="text-sm text-white/50 mb-5 leading-relaxed">
            Get early access to exclusive drops and style insights.
          </p>

          {subscribed ? (
            <div className="px-5 py-3.5 bg-[#d4af8a]/10 border border-[#d4af8a]/30 rounded text-[#d4af8a] text-sm tracking-wide">
              ✓ You're on the list. Stay tuned for drops!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="flex-1 bg-white/5 border border-white/10 border-r-0 text-white text-sm px-4 py-3 outline-none rounded-l focus:border-[#d4af8a]/50 focus:border-r-0 transition-colors"
              />
              <button
                type="submit"
                className="bg-[#d4af8a] hover:bg-[#c49a6c] px-4 py-3 rounded-r text-[#0d0d0d] flex items-center justify-center transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── LINKS SECTION ── */}
      <div className="max-w-[1280px] mx-auto py-12 px-6 sm:px-10 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-10 border-b border-white/10">
        {Object.entries(FOOTER_LINKS).map(([section, links]) => (
          <div key={section}>
            <p className="text-[10px] tracking-[0.22em] uppercase font-semibold text-white/85 mb-5">
              {section}
            </p>
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLink(link.path)}
                    className={`text-sm tracking-wide text-white/45 text-left transition-colors ${link.path !== '#' ? 'hover:text-[#d4af8a]' : 'cursor-default'}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="max-w-[1280px] mx-auto py-6 px-6 sm:px-10 flex flex-wrap justify-between items-center gap-3">
        <p className="text-xs text-white/25 tracking-wider uppercase">
          © {new Date().getFullYear()} VEXTO. All rights reserved.
        </p>

        {/* Logged-in user badge */}
        {user && (
          <p className="text-xs text-white/25 tracking-wide">
            Signed in as{' '}
            <span className="text-[#d4af8a]">
              {user.name?.split(' ')[0] || user.email?.split('@')[0]}
            </span>
            {user.role === 'seller' && (
              <span className="ml-2 bg-[#d4af8a]/15 border border-[#d4af8a]/30 text-[#d4af8a] text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm">
                Seller
              </span>
            )}
          </p>
        )}

        <div className="flex gap-6">
          {['Privacy', 'Terms', 'Cookies'].map((item) => (
            <span
              key={item}
              className="text-xs text-white/25 hover:text-white/60 tracking-wide cursor-pointer transition-colors"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
