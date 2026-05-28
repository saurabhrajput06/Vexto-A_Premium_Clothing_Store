import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useAuth } from "../../Auth/Hook/UseAuth";
import { useCart } from "../../Cart/Hook/useCart";
import { useWishlist } from "../../Wishlist/Hook/useWishlist";
import Footer from "../../shared/Footer";
import Navbar from "../../shared/Navbar";

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

const getPastelColors = (r, g, b) => {
  // Mix with white (85% white, 15% image color) to create a beautiful subtle light tint
  const bgR = Math.round((r + 255 * 5.5) / 6.5);
  const bgG = Math.round((g + 255 * 5.5) / 6.5);
  const bgB = Math.round((b + 255 * 5.5) / 6.5);

  // Border: slightly darker (75% white, 25% image color)
  const borderR = Math.round((r + 255 * 3.5) / 4.5);
  const borderG = Math.round((g + 255 * 3.5) / 4.5);
  const borderB = Math.round((b + 255 * 3.5) / 4.5);

  return {
    bg: `rgb(${bgR}, ${bgG}, ${bgB})`,
    border: `rgb(${borderR}, ${borderG}, ${borderB})`,
    shadow: `rgba(${r}, ${g}, ${b}, 0.12)`
  };
};

const getHashColors = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  const s = 35 + (Math.abs(hash) % 15); // 35% - 50%
  return {
    bg: `hsl(${h}, ${s}%, 96%)`,
    border: `hsl(${h}, ${s}%, 90%)`,
    shadow: `hsla(${h}, ${s}%, 50%, 0.12)`
  };
};

/* ── Product Card ── */
const ProductCard = ({ product, onClick, onQuickAdd, isWishlisted, onToggleWishlist }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const images = product.images || [];
  const hasMultiple = images.length > 1;
  const [colors, setColors] = useState({
    bg: "transparent",
    border: "transparent",
    shadow: "rgba(0, 0, 0, 0.08)"
  });

  useEffect(() => {
    if (images.length === 0) {
      setColors(getHashColors(product.title || product._id || "Product"));
      return;
    }

    const imageUrl = images[0].url;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        setColors(getPastelColors(r, g, b));
      } catch (e) {
        setColors(getHashColors(product.title || product._id || "Product"));
      }
    };
    img.onerror = () => {
      setColors(getHashColors(product.title || product._id || "Product"));
    };
    img.src = imageUrl;
  }, [images, product.title, product._id]);

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
      className="group cursor-pointer flex flex-col p-4 rounded-none transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-2 border"
      style={{
        backgroundColor: hovered ? colors.bg : 'transparent',
        borderColor: hovered ? colors.border : 'transparent',
        boxShadow: hovered ? `0 30px 60px -15px ${colors.shadow}` : 'none'
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[7/10] bg-neutral-100 overflow-hidden rounded-none shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-md border active:scale-90
            ${isWishlisted 
              ? 'border-red-100 text-red-500' 
              : 'border-white/20 text-neutral-800 hover:text-red-500 bg-white/70 hover:bg-white'}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="15" 
            height="15" 
            fill={isWishlisted ? "currentColor" : "none"} 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={1.8}
            className={isWishlisted ? "scale-110" : ""}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {images.length > 0 ? (
          images.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={product.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1100ms] ease-in-out group-hover:scale-[1.06]
                ${index === imgIdx ? "opacity-100 scale-100 z-0" : "opacity-0 scale-[0.96] pointer-events-none z-0"}`}
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-3xl">
            🖼
          </div>
        )}

        {/* Carousel controls - Only show on hover if multiple images */}
        {hasMultiple && (
          <div className={`absolute inset-0 flex items-center justify-between px-2 transition-opacity duration-300 z-10 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
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
            className="w-full bg-neutral-900 text-white py-3.5 px-4 rounded-none font-semibold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <CartIconSmall /> Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-6 pb-2 px-1 flex flex-col gap-2">
        <div className="flex justify-between items-center gap-3">
          <h3 className="text-sm font-bold text-neutral-900 truncate uppercase tracking-[0.1em] group-hover:text-neutral-700 transition-colors">
            {product.title}
          </h3>
          <span className="text-sm font-bold text-neutral-900 shrink-0 bg-neutral-50 px-2 py-1 rounded-md group-hover:bg-neutral-100 transition-colors">
            {formatted}
          </span>
        </div>
        <div className="flex justify-between items-center text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-medium mt-0.5">
          <span>{product.category || ""}</span>
          <span>{product.brand || ""}</span>
        </div>
      </div>
    </div>
  );
};



/* ── Hero ── */
const Hero = () => (
  <div className="relative pt-44 pb-36 sm:pt-56 sm:pb-48 px-6 sm:px-10 text-center overflow-hidden -mt-16">
    {/* Background Image */}
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/clothes_rack.png')" }}
    ></div>

    {/* Dark Overlay for readability */}
    <div className="absolute inset-0 bg-black/40"></div>

    {/* Content */}
    <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
      <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-white/80 mb-8">
        New Arrivals
      </p>
      <h1 className="font-serif font-medium text-5xl sm:text-7xl text-white leading-tight tracking-[-0.02em] mb-12 drop-shadow-lg">
        The Edit.
      </h1>
      <p className="text-base sm:text-lg text-white/90 max-w-xl leading-relaxed mb-14 font-normal drop-shadow-md">
        Discover our curated selection of premium pieces. Designed for the modern minimalist, crafted with uncompromising quality.
      </p>
      <button className="text-xs font-semibold bg-white text-black px-10 py-4 rounded-md hover:bg-neutral-200 transition-all uppercase tracking-[0.2em] shadow-xl hover:-translate-y-0.5 transform duration-200">
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
  const { isLiked, handleToggleWishlist } = useWishlist();

  useEffect(() => {
    handleGetAllProducts();
    handleGetCart();
  }, []);

  const cartCount = (cartItems || []).reduce((sum, item) => sum + item.quantity, 0);

  const onToggleWishlist = async (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const result = await handleToggleWishlist({ productId });
    if (result?.success) {
      setToastMessage(result.message);
      setToastShow(true);
    }
  };

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
      <Navbar />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-3` gap-y-12">
              {filtered.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={() => navigate(`/product/${product._id}`)}
                  onQuickAdd={onQuickAdd}
                  isWishlisted={isLiked(product._id)}
                  onToggleWishlist={() => onToggleWishlist(product._id)}
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
      <Footer />

      {/* Toast */}
      <Toast show={toastShow} message={toastMessage} onClose={() => setToastShow(false)} />
    </div>
  );
};

export default Home;