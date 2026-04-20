import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useAuth } from "../../Auth/Hook/UseAuth";

/* ── Icons ── */
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13" />
    <circle cx="9" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
  </svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

/* ── Product Card ── */
const ProductCard = ({ product, onClick }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const images = product.images || [];
  const hasMultiple = images.length > 1;

  const prev = (e) => { e.stopPropagation(); setImgIdx(i => (i === 0 ? images.length - 1 : i - 1)); };
  const next = (e) => { e.stopPropagation(); setImgIdx(i => (i === images.length - 1 ? 0 : i + 1)); };

  const currency = product.price?.currency || "INR";
  const amount = product.price?.amount;
  const formatted = amount != null
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount)
    : "—";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group cursor-pointer flex flex-col transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden rounded-md shadow-sm">
        {images.length > 0 ? (
          <img
            src={images[imgIdx]?.url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-3xl">
            🖼
          </div>
        )}

        {/* Carousel controls - Only show on hover if multiple images */}
        {hasMultiple && (
          <div className={`absolute inset-0 flex items-center justify-between px-2 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <button onClick={prev} className="p-2 bg-white/80 hover:bg-white text-neutral-800 rounded-full backdrop-blur-sm transition-colors shadow-sm">
              <ChevronLeftIcon />
            </button>
            <button onClick={next} className="p-2 bg-white/80 hover:bg-white text-neutral-800 rounded-full backdrop-blur-sm transition-colors shadow-sm">
              <ChevronRightIcon />
            </button>
          </div>
        )}
        
        {/* Quick Add overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 ${hovered ? 'translate-y-0' : ''}`}>
          <button className="w-full bg-[#0a3a2a] text-white py-3.5 px-4 rounded-md font-semibold text-xs tracking-widest uppercase hover:bg-[#072a1e] transition-colors flex items-center justify-center gap-2 shadow-lg">
            <CartIcon /> Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-5 flex flex-col gap-2">
        <div className="flex justify-between items-center gap-2">
            <h3 className="text-base font-bold text-black truncate uppercase tracking-wider">
            {product.title}
            </h3>
            <span className="text-base font-extrabold text-black shrink-0">
            {formatted}
            </span>
        </div>
        <div className="flex justify-between items-center text-[11px] text-[#1c1c1e] uppercase tracking-widest font-semibold mt-1">
          <span>{product.category || "VINTAGE"}</span>
          <span>{product.brand || "SNITCH"}</span>
        </div>
      </div>
    </div>
  );
};

/* ── Navbar ── */
const Navbar = ({ navigate, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { handleLogout } = useAuth();

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
        <span 
          onClick={() => navigate("/")}
          className="font-serif font-bold text-3xl tracking-tighter text-black cursor-pointer pt-1 pl-2"
        >
          VEXTO
        </span>
        <div className="flex items-center gap-6">
          <button className="text-neutral-600 hover:text-black transition-colors hidden sm:block">
            <SearchIcon />
          </button>
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                <UserIcon />
                <span>{user.fullname || "Account"}</span>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-white border border-neutral-100 shadow-xl rounded-sm py-2">
                   <div className="px-4 py-2 text-xs text-neutral-400 border-b border-neutral-100 mb-2">Signed in as {user.email}</div>
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/login")} className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Log in
              </button>
              <button onClick={() => navigate("/register")} className="text-sm font-medium bg-neutral-900 text-white px-5 py-2.5 rounded-sm hover:bg-neutral-800 transition-colors">
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

/* ── Hero ── */
const Hero = () => (
  <div className="relative py-28 sm:py-36 px-6 sm:px-10 text-center overflow-hidden bg-neutral-50">
    <div className="max-w-4xl mx-auto flex flex-col items-center">
        <p className="text-sm font-bold tracking-[0.25em] uppercase text-neutral-500 mb-8">
        New Arrivals
        </p>
        <h1 className="font-sans font-extrabold text-5xl sm:text-7xl text-black leading-tight tracking-[0.2em] uppercase mb-12">
        THE EDIT.
        </h1>
        <p className="text-lg sm:text-xl text-[#1c1c1e] max-w-2xl leading-relaxed mb-14 font-medium">
        Discover our curated selection of premium pieces. Designed for the modern minimalist, crafted with uncompromising quality.
        </p>
        <button className="text-sm font-bold bg-[#0a3a2a] text-white px-10 py-4 rounded-md hover:bg-[#072a1e] transition-colors uppercase tracking-[0.2em] shadow-lg hover:-translate-y-0.5 transform duration-200">
            Shop Collection
        </button>
    </div>
  </div>
);

/* ── Home Page ── */
const Home = () => {
  const { handleGetAllProducts } = useProduct();
  const products = useSelector(state => state.product.products);
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => { handleGetAllProducts(); }, []);

  const filtered = (products || [])
    .filter(p => p.title?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "price-asc") return (a.price?.amount || 0) - (b.price?.amount || 0);
      if (sort === "price-desc") return (b.price?.amount || 0) - (a.price?.amount || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-200">
      <Navbar navigate={navigate} user={user} />
      <Hero />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 border-b border-neutral-200 pb-8">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5">
              <SearchIcon />
            </span>
            <input
              id="search-products"
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 text-base rounded-md py-4 pl-14 pr-4 text-black font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black focus:bg-white transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-widest hidden sm:block">
              {filtered.length} {filtered.length === 1 ? "Result" : "Results"}
            </span>
            <select
              id="sort-products"
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="w-full sm:w-auto bg-transparent border-none text-sm font-medium text-neutral-900 cursor-pointer focus:outline-none focus:ring-0"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="price-asc">Sort by: Price (Low to High)</option>
              <option value="price-desc">Sort by: Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div>
          {products === null || products === undefined ? (
            <div className="py-32 flex justify-center items-center">
              <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="font-serif text-2xl text-neutral-900 mb-2">No results found</h3>
              <p className="text-neutral-500">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {filtered.map(product => (
                <ProductCard key={product._id} product={product} onClick={() => navigate(`/product/${product._id}`)} />
              ))}
            </div>
          )}
          
          {/* Pagination / Load More */}
          {products && filtered.length > 0 && (
            <div className="mt-20 flex justify-center">
              <button className="px-10 py-4 border-2 border-black text-black font-bold text-sm uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all rounded-md shadow-sm">
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-50 border-t border-neutral-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="font-serif font-bold text-xl tracking-tighter text-neutral-900">
                VEXTO
            </span>
            <p className="text-xs text-neutral-500 tracking-widest uppercase">
                © 2026 VEXTO. All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;