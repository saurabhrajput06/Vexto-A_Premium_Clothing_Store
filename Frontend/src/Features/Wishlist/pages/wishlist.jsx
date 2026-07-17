import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useWishlist } from "../Hook/useWishlist";
import { useCart } from "../../Cart/Hook/useCart";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";

/* ── Custom Animations (Injected CSS) ── */
const AnimationStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(24px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes fadeOutScale {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.94);
      }
    }

    @keyframes pulseGlow {
      0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.2));
      }
      50% {
        transform: scale(1.06);
        filter: drop-shadow(0 0 16px rgba(239, 68, 68, 0.45));
      }
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .animate-fade-out-scale {
      animation: fadeOutScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .animate-pulse-glow {
      animation: pulseGlow 2s ease-in-out infinite;
    }

    .animate-float {
      animation: float 4s ease-in-out infinite;
    }

    .shimmer-bg {
      background: linear-gradient(90deg, #f5f5f5 25%, #e8e8e8 50%, #f5f5f5 75%);
      background-size: 200% 100%;
      animation: shimmer 1.6s infinite linear;
    }
  `}} />
);

/* ── Inline SVG Icons ── */
const BagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const HeartIconHollow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
      <div className="flex items-center gap-3 bg-neutral-900/95 backdrop-blur-xl text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl shadow-neutral-900/40 border border-neutral-800">
        <span className={`w-6 h-6 rounded-full ${isError ? 'bg-red-500' : 'bg-emerald-500'} flex items-center justify-center shrink-0`}>
          {isError ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <span className="text-xs font-semibold tracking-wide">{message}</span>
        <button onClick={onClose} className="ml-2 text-white/50 hover:text-white transition-colors">
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

/* ── Shimmer Skeleton Loader ── */
const WishlistSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex flex-col gap-4">
        <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shimmer-bg" />
        <div className="flex flex-col gap-2 pt-2 px-1">
          <div className="h-4 w-3/4 rounded shimmer-bg" />
          <div className="h-4 w-1/3 rounded shimmer-bg" />
          <div className="h-10 w-full rounded-xl shimmer-bg mt-3" />
        </div>
      </div>
    ))}
  </div>
);

/* ── Main Wishlist Component ── */
const Wishlist = () => {
  const navigate = useNavigate();
  const { items, loading, error, handleToggleWishlist, handleGetWishlist } = useWishlist();
  const { handleAddToCart, handleGetCart } = useCart();

  // Local state to track items undergoing exit animation
  const [removingIds, setRemovingIds] = useState([]);
  // Track adding items for custom spinner and feedback on specific cards
  const [addingIds, setAddingIds] = useState({});
  // Toast notifications
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    handleGetWishlist();
  }, []);

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Delayed wishlist removal handler for exit transition
  const onRemoveItem = async (productId, itemId) => {
    // Add to removingIds to trigger CSS exit animation
    setRemovingIds((prev) => [...prev, itemId]);

    // Find all matching items in the wishlist with this product ID
    const matchingItems = (items || []).filter(item => item.product?._id === productId);

    // Wait for the exit animation duration (400ms) before hitting API
    setTimeout(async () => {
      try {
        let success = true;
        for (const match of matchingItems) {
          const result = await handleToggleWishlist({ 
            productId, 
            variantId: match.variant?._id 
          });
          if (!result?.success) {
            success = false;
          }
        }
        if (success) {
          triggerToast("Removed from wishlist");
        } else {
          triggerToast("Failed to remove some items from wishlist", "error");
          setRemovingIds((prev) => prev.filter((id) => id !== itemId));
        }
      } catch {
        triggerToast("Failed to remove item", "error");
        setRemovingIds((prev) => prev.filter((id) => id !== itemId));
      }
    }, 400);
  };

  // Handle add to bag operation
  const onAddToBag = async (productId, variantId, itemId) => {
    setAddingIds((prev) => ({ ...prev, [itemId]: "adding" }));
    try {
      const result = await handleAddToCart({ productId, variantId });
      if (result?.success) {
        setAddingIds((prev) => ({ ...prev, [itemId]: "success" }));
        triggerToast("Added to bag successfully ✓");
        
        // Refresh Redux cart state to sync Navbar badges
        handleGetCart();

        // Restore button state after 3 seconds
        setTimeout(() => {
          setAddingIds((prev) => {
            const copy = { ...prev };
            delete copy[itemId];
            return copy;
          });
        }, 3000);
      } else {
        triggerToast(result?.message || "Could not add to bag", "error");
        setAddingIds((prev) => {
          const copy = { ...prev };
          delete copy[itemId];
          return copy;
        });
      }
    } catch {
      triggerToast("Something went wrong", "error");
      setAddingIds((prev) => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-200">
      <AnimationStyles />
      <Navbar />

      <main className="max-w-[1440px] mx-auto px-6 sm:px-10 pt-10 pb-24 lg:pt-14 lg:pb-32">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col mb-12 sm:mb-16">
          {/* <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-semibold text-neutral-400 uppercase mb-4">
            <span className="cursor-pointer hover:text-black transition-colors" onClick={() => navigate("/home")}>Home</span>
            <span>/</span>
            <span className="text-neutral-500">Wishlist</span>
          </div> */}

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-neutral-100 pb-6">
            <div className="flex items-baseline gap-3">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-neutral-900 leading-tight tracking-tight">
                Your Wishlist
              </h1>
              {items && items.length > 0 && (
                <span className="text-sm font-medium font-sans text-neutral-400 tracking-wider">
                  ({items.length} {items.length === 1 ? "Item" : "Items"})
                </span>
              )}
            </div>
            <button
              onClick={() => navigate("/home")}
              className="group self-start sm:self-auto text-xs font-bold text-neutral-900 tracking-widest uppercase flex items-center gap-1.5 hover:text-neutral-600 transition-colors"
            >
              Back to Catalog
              <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </button>
          </div>
        </div>

        {/* Content Wrapper */}
        {loading && (!items || items.length === 0) ? (
          <WishlistSkeleton />
        ) : error ? (
          <div className="py-24 text-center">
            <p className="text-4xl mb-4">⚠️</p>
            <h3 className="font-serif text-2xl text-neutral-900 mb-2">Error Loading Wishlist</h3>
            <p className="text-neutral-500 text-sm mb-6">{error}</p>
            <button
              onClick={handleGetWishlist}
              className="text-xs font-semibold bg-black text-white px-8 py-3.5 rounded-md hover:bg-neutral-800 transition-all uppercase tracking-widest"
            >
              Retry
            </button>
          </div>
        ) : !items || items.length === 0 ? (
          /* Empty State */
          <div className="py-24 max-w-md mx-auto text-center flex flex-col items-center animate-fade-in-up">
            <div className="w-24 h-24 rounded-full bg-neutral-50 flex items-center justify-center text-red-500 animate-pulse-glow animate-float mb-8 border border-neutral-100">
              <HeartIconHollow />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 mb-3 tracking-tight">
              Wishlist is Empty
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-10 max-w-sm">
              Save items you love here. They will remain waiting for you to make them yours.
            </p>
            <button
              onClick={() => navigate("/home")}
              className="w-full sm:w-auto bg-neutral-900 text-white px-12 py-4 rounded-xl font-semibold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-all shadow-xl hover:-translate-y-0.5 duration-200"
            >
              Explore Products
            </button>
          </div>
        ) : (
          /* Grid of Wishlist Items */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {(() => {
              const uniqueItems = [];
              const seenProductIds = new Set();
              (items || []).forEach((item) => {
                const prodId = item.product?._id;
                if (prodId && !seenProductIds.has(prodId)) {
                  seenProductIds.add(prodId);
                  uniqueItems.push(item);
                }
              });

              return uniqueItems.map((item, index) => {
                const product = item.product;
                if (!product) return null;

                const itemId = item._id;
                const isRemoving = removingIds.includes(itemId);
                const isAddingState = addingIds[itemId]; // "adding", "success", or undefined

                // Extract correct attributes, image and price fallback
                const hasAttributes = item.variant?.attributes && Object.keys(item.variant.attributes).length > 0;
                const attributesLabel = hasAttributes
                  ? Object.values(item.variant.attributes).join(" / ")
                  : "";

                const imageUrl = item.variant?.images?.[0]?.url || product.images?.[0]?.url || "";
                const currency = item.variant?.price?.currency || product.price?.currency || "INR";
                const priceAmount = item.variant?.price?.amount ?? product.price?.amount;
                const formattedPrice = priceAmount != null
                  ? new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(priceAmount)
                  : "—";

                // Check if out of stock (variant level or product level)
                const isOutOfStock = item.variant
                  ? item.variant.stock === 0
                  : product.stock === 0;

                return (
                  <div
                    key={itemId}
                    onClick={() => navigate(`/product/${product._id}`)}
                    style={{ animationDelay: `${index * 80}ms` }}
                    className={`group flex flex-col relative transition-all duration-500 cursor-pointer ${isRemoving ? "animate-fade-out-scale pointer-events-none" : "animate-fade-in-up"}`}
                  >
                    {/* Image Card Container */}
                    <div className="relative aspect-[3/4] bg-neutral-50 rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300 text-3xl font-serif">
                          VEXTO
                        </div>
                      )}

                      {/* Gradient Overlay for visual refinement */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Glassmorphic Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveItem(product._id, itemId);
                        }}
                        title="Remove from wishlist"
                        className="absolute top-4 right-4 w-9 h-9 bg-white/40 hover:bg-white/95 backdrop-blur-md text-neutral-800 hover:text-red-500 border border-white/20 hover:border-red-100/50 shadow-lg rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                      >
                        <TrashIcon />
                      </button>

                      {/* Badge for variant */}
                      {attributesLabel && (
                        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md text-[9px] font-bold text-neutral-700 tracking-wider px-2.5 py-1 rounded-md border border-white/30 uppercase">
                          {attributesLabel}
                        </div>
                      )}

                      {/* Badge for Out of stock */}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-red-500 text-white text-[10px] font-semibold tracking-widest px-4 py-2 rounded-lg shadow-md uppercase">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info Details Section */}
                    <div className="pt-5 pb-2 px-1 flex flex-col flex-1">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3
                          className="text-sm font-semibold text-neutral-900 line-clamp-1 hover:text-neutral-500 transition-colors uppercase tracking-[0.06em]"
                        >
                          {product.title}
                        </h3>
                        <span className="text-sm font-bold text-neutral-900 shrink-0">
                          {formattedPrice}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-5">
                        {product.description || "No description available."}
                      </p>

                      {/* Action Add To Bag Button */}
                      <div className="mt-auto">
                        <button
                          disabled={isOutOfStock || isAddingState === "adding"}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToBag(product._id, item.variant?._id, itemId);
                          }}
                          className={`w-full py-3.5 px-4 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 border shadow-sm
                            ${isAddingState === "success"
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/10"
                              : isOutOfStock
                                ? "bg-neutral-50 border-neutral-100 text-neutral-400 cursor-not-allowed shadow-none"
                                : "bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-850 hover:border-neutral-850 shadow-neutral-900/10 hover:shadow-md active:scale-[0.98]"
                            }`}
                        >
                          {isAddingState === "adding" ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Adding...</span>
                            </>
                          ) : isAddingState === "success" ? (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <BagIcon />
                              <span>Add To Bag</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </main>

      {/* Toast Notification popup */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <Footer />
    </div>
  );
};

export default Wishlist;
