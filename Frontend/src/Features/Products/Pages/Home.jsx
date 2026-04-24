import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useAuth } from "../../Auth/Hook/UseAuth";
import { useCart } from "../../Cart/Hook/useCart";

/* ── Icons ── */
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const CartIconSmall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

/* ── Toast Notification ── */
const Toast = ({ show, message, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
      <div className="flex items-center gap-3 bg-neutral-900 text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl shadow-neutral-900/30 backdrop-blur-xl">
        <span className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span className="text-sm font-medium tracking-wide">{message || "Added to bag"}</span>
        <button onClick={onClose} className="ml-2 text-white/60 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

/* ── Product Card ── */
const ProductCard = ({ product, onClick, onQuickAdd }) => {
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product._id);
            }}
            className="w-full bg-neutral-900 text-white py-3.5 px-4 rounded-md font-semibold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <CartIconSmall /> Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-5 flex flex-col gap-2">
        <div className="flex justify-between items-center gap-2">
          <h3 className="text-sm font-semibold text-neutral-900 truncate uppercase tracking-[0.1em]">
            {product.title}
          </h3>
          <span className="text-sm font-bold text-neutral-900 shrink-0">
            {formatted}
          </span>
        </div>
        <div className="flex justify-between items-center text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-medium mt-0.5">
          <span>{product.category || "VINTAGE"}</span>
          <span>{product.brand || "SNITCH"}</span>
        </div>
      </div>
    </div>
  );
};

/* ── Navbar ── */
const Navbar = ({ navigate, user, cartCount }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { handleLogout } = useAuth();

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200/60 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
        <span
          onClick={() => navigate("/")}
          className="font-serif font-bold text-3xl tracking-[-0.02em] text-black cursor-pointer"
        >
          VEXTO
        </span>
        <div className="flex items-center gap-5">
          <button className="text-neutral-500 hover:text-black transition-colors hidden sm:block">
            <SearchIcon />
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => navigate("/cart")}
            className="relative text-neutral-500 hover:text-black transition-colors"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-neutral-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <UserIcon />
                <span className="hidden sm:inline">{user.fullname || "Account"}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-white border border-neutral-100 shadow-xl rounded-md py-2">
                  <div className="px-4 py-2 text-xs text-neutral-400 border-b border-neutral-100 mb-2">Signed in as {user.email}</div>
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/login")} className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                Log in
              </button>
              <button onClick={() => navigate("/register")} className="text-sm font-medium bg-neutral-900 text-white px-5 py-2.5 rounded-md hover:bg-neutral-800 transition-colors">
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
      <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-neutral-400 mb-8">
        New Arrivals
      </p>
      <h1 className="font-serif font-medium text-5xl sm:text-7xl text-black leading-tight tracking-[-0.02em] mb-12">
        The Edit.
      </h1>
      <p className="text-base sm:text-lg text-neutral-500 max-w-xl leading-relaxed mb-14 font-normal">
        Discover our curated selection of premium pieces. Designed for the modern minimalist, crafted with uncompromising quality.
      </p>
      <button className="text-xs font-semibold bg-neutral-900 text-white px-10 py-4 rounded-md hover:bg-neutral-800 transition-all uppercase tracking-[0.2em] shadow-lg hover:-translate-y-0.5 transform duration-200">
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
  const cartItems = useSelector(state => state.cart.items);
  const navigate = useNavigate();
  const { handleAddToCart, handleGetCart } = useCart();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    handleGetAllProducts();
    handleGetCart();
  }, []);

  const cartCount = (cartItems || []).reduce((sum, item) => sum + item.quantity, 0);

  const onQuickAdd = async (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const result = await handleAddToCart({ productId });
    if (result?.success) {
      setToastMessage("Item added to bag ✓");
      setToastShow(true);
      handleGetCart();
    } else {
      setToastMessage(result?.message || "Could not add to bag");
      setToastShow(true);
    }
  };

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
      <Navbar navigate={navigate} user={user} cartCount={cartCount} />
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
              className="w-full bg-neutral-50 border border-neutral-200 text-sm rounded-md py-3.5 pl-14 pr-4 text-neutral-900 font-medium focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:bg-white transition-all placeholder:text-neutral-400"
            />
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em] hidden sm:block">
              {filtered.length} {filtered.length === 1 ? "Result" : "Results"}
            </span>
            <select
              id="sort-products"
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="w-full sm:w-auto bg-transparent border-none text-sm font-medium text-neutral-700 cursor-pointer focus:outline-none focus:ring-0"
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
              <p className="text-neutral-500 text-sm">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
              {filtered.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={() => navigate(`/product/${product._id}`)}
                  onQuickAdd={onQuickAdd}
                />
              ))}
            </div>
          )}

          {/* Pagination / Load More */}
          {products && filtered.length > 0 && (
            <div className="mt-20 flex justify-center">
              <button className="px-10 py-4 border border-neutral-900 text-neutral-900 font-semibold text-xs uppercase tracking-[0.2em] hover:bg-neutral-900 hover:text-white transition-all rounded-md">
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-50 border-t border-neutral-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-serif font-bold text-xl tracking-[-0.02em] text-neutral-900">
            VEXTO
          </span>
          <p className="text-[10px] text-neutral-400 tracking-[0.2em] uppercase">
            © 2026 VEXTO. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Toast */}
      <Toast show={toastShow} message={toastMessage} onClose={() => setToastShow(false)} />
    </div>
  );
};

export default Home;