import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import { useCart } from "../../Cart/Hook/useCart";
import Footer from "../../shared/Footer";
import Navbar from "../../shared/Navbar";


/* ── Icons ── */
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

/* ── Toast Notification ── */
const Toast = ({ show, message, type, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const isError = type === "error";

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
      <div className="flex items-center gap-3 bg-neutral-900 text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl shadow-neutral-900/30 backdrop-blur-xl">
        <span className={`w-7 h-7 rounded-full ${isError ? 'bg-red-500' : 'bg-emerald-500'} flex items-center justify-center shrink-0`}>
          {isError ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <span className="text-sm font-medium tracking-wide">{message}</span>
        <button onClick={onClose} className="ml-2 text-white/60 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const { handleGetProductById } = useProduct();
  const { handleAddToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [adding, setAdding] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await handleGetProductById(id);
      setProduct(data);
      if (data?.variants?.length > 0) {
        setSelectedVariant(data.variants[0]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <h1 className="font-serif text-3xl text-neutral-900 mb-6">Product Not Found</h1>
        <button onClick={() => navigate("/")} className="text-sm font-medium border border-neutral-900 text-neutral-900 px-8 py-3 rounded-md hover:bg-neutral-900 hover:text-white transition-colors">
          Return to Collection
        </button>
      </div>
    );
  }

  // Fallback logic: Use selected variant values, otherwise fallback to main product
  const images = (selectedVariant?.images && selectedVariant.images.length > 0) ? selectedVariant.images : (product.images || []);
  const hasMultiple = images.length > 1;
  const currency = selectedVariant?.price?.currency || product.price?.currency || "INR";
  const amount = selectedVariant?.price?.amount ?? product.price?.amount;

  const formattedPrice = amount != null ? new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount) : "—";
  const variants = product.variants || [];
  const hasVariants = variants.length > 0;

  // Stock Calculation
  let stockNumber = undefined;
  let isOutOfStock = false;

  if (hasVariants) {
    if (selectedVariant) {
      stockNumber = selectedVariant.stock;
      isOutOfStock = stockNumber === 0;
    } else {
      stockNumber = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
      isOutOfStock = stockNumber === 0;
    }
  } else {
    stockNumber = product.stock;
    isOutOfStock = stockNumber === 0; // If undefined, it's in stock
  }

  const prev = () => setImgIdx(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setImgIdx(i => (i === images.length - 1 ? 0 : i + 1));

  // Reset image index when variant changes to ensure we show the first image of the new variant
  const handleVariantSelect = (variant) => {
    setSelectedVariant(selectedVariant?._id === variant._id ? null : variant);
    setImgIdx(0);
  };

  const onAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      const result = await handleAddToCart({
        productId: product._id,
        variantId: selectedVariant?._id
      });
      if (result?.success) {
        setToastType("success");
        setToastMessage("Added to bag — View cart");
      } else {
        setToastType("error");
        setToastMessage(result?.message || "Could not add to bag");
      }
    } catch (err) {
      setToastType("error");
      setToastMessage("Something went wrong");
    }
    setToastShow(true);
    setAdding(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-200">
      {/* Navbar Minimal */}
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 pt-16 pb-24 lg:pt-28 lg:pb-32">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">

          {/* Left: Image Gallery */}
          <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-neutral-50 rounded-md overflow-hidden group">
              {images.length > 0 && images[imgIdx] ? (
                <img src={images[imgIdx].url} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300 text-4xl">
                  🖼
                </div>
              )}

              {/* Navigation Arrows */}
              {hasMultiple && (
                <>
                  <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 text-neutral-900 rounded-full backdrop-blur-md shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                    <ChevronLeftIcon />
                  </button>
                  <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 text-neutral-900 rounded-full backdrop-blur-md shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                    <ChevronRightIcon />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {hasMultiple && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`relative w-20 h-24 shrink-0 overflow-hidden rounded-md transition-all duration-200 ${i === imgIdx ? 'opacity-100 ring-2 ring-neutral-900 ring-offset-2' : 'opacity-40 hover:opacity-80'}`}
                  >
                    <img src={img.url} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info (Sticky on Desktop) */}
          <div className="w-full lg:w-[45%] xl:w-[40%]">
            <div className="lg:sticky lg:top-40 flex flex-col">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400 mb-6">
                Premium Collection
              </p>

              <h1 className="font-serif text-4xl sm:text-5xl text-neutral-900 leading-tight mb-4 tracking-[-0.02em]">
                {product.title}
              </h1>

              <div className="text-2xl font-medium text-neutral-900 mb-2">
                {formattedPrice}
              </div>

              {/* Stock Status */}
              <div className="mb-8">
                {!isOutOfStock ? (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60 tracking-wide">
                    {stockNumber > 0 ? `In Stock (${stockNumber})` : "In Stock"}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1.5 rounded-full border border-red-200/60 tracking-wide">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="h-px bg-neutral-200 mb-8" />

              {/* Variant Selector */}
              {variants.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-4">Select Option</h3>
                  <div className="flex flex-wrap gap-3">

                    {variants.map((variant) => {
                      // Generate a label from attributes, e.g., "Red / M"
                      const label = variant.attributes && Object.keys(variant.attributes).length > 0
                        ? Object.entries(variant.attributes).map(([k, v]) => `${v}`).join(' / ')
                        : `Variant`;

                      const isSelected = selectedVariant?._id === variant._id;

                      return (
                        <button
                          key={variant._id}
                          onClick={() => handleVariantSelect(variant)}
                          className={`px-5 py-2.5 text-sm font-medium rounded-md border transition-all ${isSelected ? 'border-neutral-900 bg-neutral-900 text-white shadow-md' : 'border-neutral-200 text-neutral-700 hover:border-neutral-900 bg-white'}`}
                        >
                          <span className="capitalize">{isSelected ? `✓${label}` : label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 mb-4">DETAILS</h3>
                <p className="text-neutral-500 leading-relaxed text-sm whitespace-pre-wrap">
                  {product.description || "No description provided."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button
                  disabled={isOutOfStock || adding}
                  className="flex-1 flex items-center justify-center gap-3 bg-white border border-neutral-900 text-neutral-900 px-8 py-4 rounded-md font-semibold text-xs tracking-[0.15em] uppercase hover:bg-neutral-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={onAddToCart}
                >
                  {adding ? (
                    <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
                  ) : (
                    <CartIcon />
                  )}
                  {adding ? "Adding..." : "Add to Bag"}
                </button>
                <button
                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-md font-semibold text-xs tracking-[0.15em] uppercase hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-900/10 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <BoltIcon /> Buy Now
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t border-neutral-100 flex flex-col gap-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-[0.2em] text-neutral-400 font-semibold">LISTED ON</span>
                  <span className="font-medium text-neutral-700">{new Date(product.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-[0.2em] text-neutral-400 font-semibold">SELLER ID</span>
                  <span className="font-mono text-[10px] text-neutral-400 tracking-wider truncate max-w-[150px]">{product.seller}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Toast */}
      <Toast
        show={toastShow}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastShow(false)}
      />

      <Footer />
    </div>
  );
};

export default ProductDetails;
