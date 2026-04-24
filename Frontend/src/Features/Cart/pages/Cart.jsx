import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../Hook/useCart'
import { useNavigate } from 'react-router'

/* ── Icons ── */
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);
const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const BagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);
const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);
const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

/* ── Helpers ── */
const formatPrice = (amount, currency = "INR") => {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getVariantData = (item) => {
  if (!item.variant || !item.product?.variants) return null;
  return item.product.variants.find(v => v._id === item.variant);
};

const getItemImages = (item) => {
  const variant = getVariantData(item);
  if (variant?.images?.length > 0) return variant.images;
  if (item.product?.images?.length > 0) return item.product.images;
  return [];
};

const getItemPrice = (item) => {
  const variant = getVariantData(item);
  return variant?.price?.amount ?? item.product?.price?.amount ?? 0;
};

const getItemCurrency = (item) => {
  const variant = getVariantData(item);
  return variant?.price?.currency || item.product?.price?.currency || "INR";
};

const getVariantLabel = (item) => {
  const variant = getVariantData(item);
  if (!variant?.attributes || Object.keys(variant.attributes).length === 0) return null;
  return Object.entries(variant.attributes)
    .map(([key, value]) => `${value}`)
    .join(" · ");
};

const getVariantStock = (item) => {
  const variant = getVariantData(item);
  return variant?.stock;
};


/* ── Cart Item Component ── */
const CartItem = ({ item, onRemove, onUpdateQuantity, removingId }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  
  const images = getItemImages(item);
  const hasMultiple = images.length > 1;
  const price = getItemPrice(item);
  const currency = getItemCurrency(item);
  const variantLabel = getVariantLabel(item);
  const stock = getVariantStock(item);
  const lineTotal = price * item.quantity;
  const isRemoving = removingId === item._id;

  const prev = (e) => { e.stopPropagation(); setImgIdx(i => (i === 0 ? images.length - 1 : i - 1)); };
  const next = (e) => { e.stopPropagation(); setImgIdx(i => (i === images.length - 1 ? 0 : i + 1)); };

  return (
    <div
      className={`group transition-all duration-500 ease-out ${isRemoving ? 'opacity-0 scale-95 max-h-0 -mb-6' : 'opacity-100 scale-100 max-h-[300px]'}`}
    >
      <div className="flex gap-5 sm:gap-7">
        {/* Image */}
        <div 
          className="relative w-[100px] h-[130px] sm:w-[130px] sm:h-[165px] bg-neutral-100 rounded-lg overflow-hidden shrink-0"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {images.length > 0 ? (
            <img
              src={images[imgIdx]?.url}
              alt={item.product?.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300 text-2xl">
              🖼
            </div>
          )}

          {/* Mini carousel arrows */}
          {hasMultiple && (
            <div className={`absolute inset-0 flex items-center justify-between px-1 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
              <button onClick={prev} className="p-1 bg-white/80 hover:bg-white text-neutral-800 rounded-full backdrop-blur-sm transition-colors shadow-sm">
                <ChevronLeftIcon />
              </button>
              <button onClick={next} className="p-1 bg-white/80 hover:bg-white text-neutral-800 rounded-full backdrop-blur-sm transition-colors shadow-sm">
                <ChevronRightIcon />
              </button>
            </div>
          )}

          {/* Image dots */}
          {hasMultiple && (
            <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`block w-1 h-1 rounded-full transition-all ${i === imgIdx ? 'bg-white w-2.5' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-[0.08em] truncate">
                  {item.product?.title}
                </h3>
                {variantLabel && (
                  <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-[0.15em] font-medium">
                    {variantLabel}
                  </p>
                )}
              </div>
              <button
                onClick={() => onRemove(item._id)}
                className="p-1.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 shrink-0"
                title="Remove item"
              >
                <TrashIcon />
              </button>
            </div>

            <div className="mt-2 flex items-center gap-2.5">
              <span className="text-sm font-medium text-neutral-700">
                {formatPrice(price, currency)}
              </span>
              {stock != null && stock > 0 && stock <= 5 && (
                <span className="text-[9px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Only {stock} left
                </span>
              )}
              {stock === 0 && (
                <span className="text-[9px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Out of stock
                </span>
              )}
            </div>
          </div>

          {/* Quantity + Line Total */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-0 border border-neutral-200 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                disabled={item.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <MinusIcon />
              </button>
              <span className="w-9 h-8 flex items-center justify-center text-xs font-semibold text-neutral-900 border-x border-neutral-200">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                disabled={stock != null && item.quantity >= stock}
                className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <PlusIcon />
              </button>
            </div>
            <span className="text-sm font-bold text-neutral-900 tracking-tight">
              {formatPrice(lineTotal, currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ── Empty Cart ── */
const EmptyCart = ({ navigate }) => (
  <div className="flex flex-col items-center justify-center py-24 sm:py-36">
    <div className="text-neutral-200 mb-8 animate-pulse">
      <BagIcon />
    </div>
    <h2 className="font-serif text-3xl sm:text-4xl text-neutral-900 mb-3 tracking-[-0.02em]">Your bag is empty</h2>
    <p className="text-sm text-neutral-400 mb-12 max-w-sm text-center leading-relaxed">
      Looks like you haven't added anything yet. Explore our curated collection and find something you love.
    </p>
    <button
      onClick={() => navigate("/")}
      className="text-xs font-semibold bg-neutral-900 text-white px-10 py-4 rounded-md hover:bg-neutral-800 transition-all uppercase tracking-[0.2em] shadow-lg hover:-translate-y-0.5 transform duration-200"
    >
      Explore Collection
    </button>
  </div>
);


/* ── Order Summary ── */
const OrderSummary = ({ items, navigate }) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + getItemPrice(item) * item.quantity;
  }, 0);
  
  const currency = items.length > 0 ? getItemCurrency(items[0]) : "INR";
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingProgress = Math.min(100, (subtotal / 1000) * 100);

  return (
    <div className="lg:sticky lg:top-24">
      {/* Summary Card */}
      <div className="bg-neutral-50 rounded-xl p-6 sm:p-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-400 mb-8">
          Order Summary
        </h2>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Subtotal · {itemCount} {itemCount === 1 ? "item" : "items"}</span>
            <span className="font-semibold text-neutral-900">{formatPrice(subtotal, currency)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-neutral-500">Shipping</span>
            {shipping === 0 ? (
              <span className="font-semibold text-emerald-600">Free</span>
            ) : (
              <span className="font-semibold text-neutral-900">{formatPrice(shipping, currency)}</span>
            )}
          </div>
          
          {shipping > 0 && (
            <div className="bg-white rounded-lg px-4 py-3.5 border border-dashed border-neutral-200/80">
              <p className="text-xs text-neutral-400 leading-relaxed">
                Add <span className="font-bold text-neutral-900">{formatPrice(1000 - subtotal, currency)}</span> more for <span className="font-bold text-emerald-600">free shipping</span>
              </p>
              <div className="mt-2.5 h-1 bg-neutral-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-neutral-900 to-neutral-600 rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-neutral-200/80 my-6" />

        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-semibold uppercase tracking-[0.1em] text-neutral-900">Total</span>
          <span className="text-xl font-bold text-neutral-900 tracking-tight">{formatPrice(total, currency)}</span>
        </div>

        <button
          className="w-full bg-neutral-900 text-white py-4 rounded-lg font-semibold text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-900/10 hover:-translate-y-0.5 transform duration-200 flex items-center justify-center gap-2"
        >
          <LockIcon />
          Secure Checkout
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 bg-white text-neutral-700 py-3.5 rounded-lg font-semibold text-xs uppercase tracking-[0.15em] border border-neutral-200 hover:border-neutral-400 hover:text-neutral-900 transition-all"
        >
          Continue Shopping
        </button>
      </div>

      {/* Trust Badges */}
      <div className="mt-5 flex items-center justify-center gap-8 py-5">
        <div className="flex items-center gap-2 text-neutral-400">
          <ShieldIcon />
          <span className="text-[10px] font-medium uppercase tracking-[0.15em]">Secure</span>
        </div>
        <div className="w-px h-4 bg-neutral-200" />
        <div className="flex items-center gap-2 text-neutral-400">
          <TruckIcon />
          <span className="text-[10px] font-medium uppercase tracking-[0.15em]">Fast</span>
        </div>
        <div className="w-px h-4 bg-neutral-200" />
        <div className="flex items-center gap-2 text-neutral-400">
          <RefreshIcon />
          <span className="text-[10px] font-medium uppercase tracking-[0.15em]">Returns</span>
        </div>
      </div>
    </div>
  );
};


/* ── Main Cart Page ── */
const Cart = () => {
  const cartItems = useSelector(state => state.cart.items)
  const cartLoading = useSelector(state => state.cart.loading)
  const navigate = useNavigate()
  const { handleGetCart, handleRemoveItem, handleUpdateQuantity } = useCart()
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    handleGetCart()
  }, [])

  const onRemove = async (itemId) => {
    setRemovingId(itemId)
    setTimeout(async () => {
      await handleRemoveItem(itemId)
      setRemovingId(null)
    }, 450)
  }

  const onUpdateQuantity = (itemId, quantity) => {
    handleUpdateQuantity(itemId, quantity)
  }

  // Loading state
  if (cartLoading && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-7 h-7 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin"></div>
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">Loading your bag</span>
        </div>
      </div>
    );
  }

  const itemCount = (cartItems || []).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900 selection:bg-neutral-200">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            <BackIcon /> Back
          </button>
          <span
            onClick={() => navigate("/")}
            className="font-serif font-bold text-xl tracking-[-0.02em] text-black cursor-pointer"
          >
            VEXTO
          </span>
          <div className="w-16" />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-12 pb-24">

        {/* Page Header */}
        <div className="mb-10 sm:mb-14">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-neutral-400 mb-4">
            Shopping Bag
          </p>
          <div className="flex items-baseline gap-4">
            <h1 className="font-serif text-3xl sm:text-[2.5rem] text-neutral-900 leading-tight tracking-[-0.02em]">
              Your Bag
            </h1>
            {cartItems && cartItems.length > 0 && (
              <span className="text-xs font-normal text-neutral-400">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {!cartItems || cartItems.length === 0 ? (
          <EmptyCart navigate={navigate} />
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

            {/* Left: Cart Items */}
            <div className="flex-1 min-w-0">
              {/* Column Headers - Desktop */}
              <div className="hidden sm:flex items-center text-[9px] font-semibold uppercase tracking-[0.25em] text-neutral-300 pb-4 border-b border-neutral-100 mb-2">
                <span className="flex-1">Product</span>
                <span className="w-28 text-center">Quantity</span>
                <span className="w-24 text-right">Total</span>
              </div>
              
              <div className="divide-y divide-neutral-100/80">
                {cartItems.map((item) => (
                  <div key={item._id} className="py-6 first:pt-4">
                    <CartItem
                      item={item}
                      onRemove={onRemove}
                      onUpdateQuantity={onUpdateQuantity}
                      removingId={removingId}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="w-full lg:w-[360px] xl:w-[380px] shrink-0">
              <OrderSummary items={cartItems} navigate={navigate} />
            </div>

          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-neutral-50 border-t border-neutral-100 mt-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-serif font-bold text-xl tracking-[-0.02em] text-neutral-900">
            VEXTO
          </span>
          <p className="text-[10px] text-neutral-400 tracking-[0.2em] uppercase">
            © 2026 VEXTO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Cart