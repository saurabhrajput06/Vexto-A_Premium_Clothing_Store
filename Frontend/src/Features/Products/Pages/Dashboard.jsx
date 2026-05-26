import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Footer from "../../shared/Footer";

/* ------------------------------------------------------------------ */
/*  SVG Icons                                                           */
/* ------------------------------------------------------------------ */
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  ProductCard — with mini image carousel                             */
/* ------------------------------------------------------------------ */
const ProductCard = ({ product }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const images = product.images || [];
  const hasMultiple = images.length > 1;

  const prev = (e) => {
    e.stopPropagation();
    setImgIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const next = (e) => {
    e.stopPropagation();
    setImgIdx((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  const currency = product.price?.currency || "INR";
  const amount = product.price?.amount;
  const formatted =
    amount != null
      ? new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount)
      : "—";
 const navigate = useNavigate();
  return (
    <div
    onClick={() => navigate(`/seller/products/${product._id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col bg-white border border-neutral-200 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[imgIdx]?.url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <ImageIcon />
          </div>
        )}

        {/* Carousel controls */}
        {hasMultiple && (
          <div className={`absolute inset-0 flex items-center justify-between px-2 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={prev}
              className="p-2 bg-white/90 hover:bg-white text-neutral-900 rounded-full shadow-sm transition-colors"
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={next}
              className="p-2 bg-white/90 hover:bg-white text-neutral-900 rounded-full shadow-sm transition-colors"
            >
              <ChevronRightIcon />
            </button>
          </div>
        )}

        {/* Image count badge */}
        {images.length > 0 && (
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-neutral-900 text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-widest shadow-sm">
            {imgIdx + 1}/{images.length}
          </span>
        )}
      </div>

      {/* Card Info */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-base font-semibold text-neutral-900 truncate">
            {product.title}
          </h3>
          <span className="text-base font-bold text-neutral-900 shrink-0">
            {formatted}
          </span>
        </div>

        {product.description && (
          <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-2 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
            {new Date(product.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
            Edit
          </span>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Empty State                                                         */
/* ------------------------------------------------------------------ */
const EmptyState = ({ onAdd }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-neutral-200 rounded-sm bg-neutral-50">
    <div className="w-16 h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 mb-6 shadow-sm">
      <ImageIcon />
    </div>
    <h3 className="text-xl font-serif text-neutral-900 mb-2">
      No products yet
    </h3>
    <p className="text-sm text-neutral-500 mb-8 max-w-sm">
      Start your journey by creating your first product listing. It only takes a few minutes.
    </p>
    <button
      onClick={onAdd}
      className="bg-neutral-900 text-white px-8 py-3 rounded-sm font-semibold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2"
    >
      <PlusIcon /> List a Product
    </button>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                      */
/* ------------------------------------------------------------------ */
const Dashboard = () => {
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  const totalValue = (sellerProducts || []).reduce((sum, p) => sum + (p.price?.amount || 0), 0);
  const totalImages = (sellerProducts || []).reduce((sum, p) => sum + (p.images?.length || 0), 0);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-neutral-200">
      
      {/* Navbar Minimal */}
      <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 px-6 sm:px-10 h-20 flex items-center justify-between">
         <span 
          onClick={() => navigate("/")}
          className="font-serif font-bold text-2xl tracking-tighter text-neutral-900 cursor-pointer"
        >
          VEXTO <span className="font-sans text-sm font-medium tracking-widest uppercase text-neutral-400 ml-2">Seller</span>
        </span>
        <button 
          onClick={() => navigate("/")}
          className="text-sm font-semibold tracking-widest uppercase text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Storefront
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 lg:py-20">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-neutral-400"><GridIcon /></span>
              <span className="text-sm font-bold tracking-widest uppercase text-neutral-500">
                Dashboard Overview
              </span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl text-neutral-900 leading-tight">
              Your Products
            </h1>
          </div>

          <button
            id="create-product-btn"
            onClick={() => navigate("/seller/products/create")}
            className="flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3.5 rounded-sm font-semibold text-sm tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <PlusIcon /> New Listing
          </button>
        </div>

        {/* ── Stats Bar ── */}
        {sellerProducts?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            {[
              { label: "Total Listings", value: sellerProducts.length },
              {
                label: "Portfolio Value",
                value: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(totalValue),
              },
              { label: "Total Photos", value: totalImages },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white border border-neutral-200 rounded-sm p-6 shadow-sm">
                <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">
                  {label}
                </p>
                <p className="text-3xl font-serif text-neutral-900">
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Products Grid ── */}
        {sellerProducts === undefined || sellerProducts === null ? (
          <div className="py-32 flex justify-center items-center">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sellerProducts.length === 0 ? (
              <EmptyState onAdd={() => navigate("/seller/products/create")} />
            ) : (
              sellerProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;