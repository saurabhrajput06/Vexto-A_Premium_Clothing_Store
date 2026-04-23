import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useProduct } from "../hook/useProduct";
import { useCart } from "../../Cart/Hook/useCart";







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
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13" />
    <circle cx="9" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
  </svg>
);
const BoltIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductById } = useProduct();
  const { handleAddToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await handleGetProductById(id);
      setProduct(data);
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
        <button onClick={() => navigate("/")} className="text-sm font-medium border border-neutral-900 text-neutral-900 px-8 py-3 rounded-sm hover:bg-neutral-900 hover:text-white transition-colors">
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
  // console.log({product , selectedVariant})

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-200">
      {/* Navbar Minimal */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-6 sm:px-10 h-16 flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <BackIcon /> Back
        </button>
      </nav>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 pt-16 pb-24 lg:pt-28 lg:pb-32">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-neutral-50 rounded-sm overflow-hidden group">
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
                    className={`relative w-20 h-24 shrink-0 overflow-hidden rounded-sm transition-opacity duration-200 ${i === imgIdx ? 'opacity-100 ring-1 ring-neutral-900 ring-offset-2' : 'opacity-50 hover:opacity-100'}`}
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
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 mb-6">
                Premium Collection
              </p>
              
              <h1 className="font-serif text-4xl sm:text-5xl text-neutral-900 leading-tight mb-4">
                {product.title}
              </h1>
              
              <div className="text-2xl font-medium text-neutral-900 mb-2">
                {formattedPrice}
              </div>

              {/* Stock Status */}
              <div className="mb-8">
                  {!isOutOfStock ? (
                      <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                          {stockNumber > 0 ? `In Stock (${stockNumber})` : "In Stock"}
                      </span>
                  ) : (
                      <span className="text-sm font-medium text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                          Out of Stock
                      </span>
                  )}
              </div>

              <div className="h-px bg-neutral-200 mb-8" />

              {/* Variant Selector */}
              {variants.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6B7280] mb-4">Select Option</h3>
                  <div className="flex flex-wrap gap-3">
                    
                    {/* Main Product Button */}
                    <button 
                      onClick={() => {
                        setSelectedVariant(null);
                        setImgIdx(0);
                      }}
                      className={`px-5 py-2.5 text-sm font-medium rounded-sm border transition-all ${selectedVariant === null ? 'border-neutral-900 bg-neutral-900 text-white shadow-md' : 'border-neutral-200 text-neutral-900 hover:border-neutral-900 bg-white'}`}
                    >
                      <span className="capitalize">Standard</span>
                    </button>

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
                          className={`px-5 py-2.5 text-sm font-medium rounded-sm border transition-all ${isSelected ? 'border-neutral-900 bg-neutral-900 text-white shadow-md' : 'border-neutral-200 text-neutral-900 hover:border-neutral-900 bg-white'}`}
                        >
                          <span className="capitalize">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6B7280] mb-4">DETAILS</h3>
                <p className="text-neutral-600 leading-relaxed text-sm whitespace-pre-wrap">
                  {product.description || "No description provided."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 

                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-3 bg-white border border-neutral-900 text-neutral-900 px-8 py-4 rounded-sm font-semibold text-xs tracking-widest uppercase hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    handleAddToCart({
                      productId: product._id,
                      variantId: selectedVariant?._id
                    });
                  }}
                >
                  <CartIcon /> Add to Bag
                </button>
                <button 
                  disabled={isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-sm font-semibold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BoltIcon /> Buy Now
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t border-neutral-100 flex flex-col gap-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-widest text-[#6B7280] font-semibold">LISTED ON</span>
                  <span className="font-medium text-neutral-900">{new Date(product.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-widest text-[#6B7280] font-semibold">SELLER ID</span>
                  <span className="font-mono text-[10px] text-neutral-400 tracking-wider truncate max-w-[150px]">{product.seller}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
