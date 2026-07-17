import React, { useEffect, useState } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { useCart } from '../Hook/useCart'
import Navbar from '../../shared/Navbar'
import Footer from '../../shared/Footer'
import Loader from '../../shared/Loader'

/* ── Custom SVG Icons ── */
const CheckIcon = () => (
    <svg className="w-10 h-10 text-[#a6825c] animate-[scaleIn_0.5s_ease-out_forwards]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" strokeDasharray="30" strokeDashoffset="30" style={{
            animation: 'drawCheck 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards'
        }} />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
    </svg>
);

const CopiedCheckIcon = () => (
    <svg className="text-emerald-600" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="text-[#a6825c] w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
    </svg>
);

const ShieldCheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-600 inline-block mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
);

const OrderSuccesss = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { handleGetPaymentOrderDetails } = useCart();

    const orderId = searchParams.get('order_id') || '—';
    const paymentId = searchParams.get('payment_id') || '—';
    const initialItems = location.state?.items || [];

    const [copiedOrder, setCopiedOrder] = useState(false);
    const [copiedPayment, setCopiedPayment] = useState(false);

    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);

    // Clear cart in Redux on successful checkout
    useEffect(() => {
        const fetchOrderData = async () => {
            if (initialItems && initialItems.length > 0) {
                const tempSubtotal = initialItems.reduce((sum, item) => {
                    const variant = item.variant && item.product?.variants
                        ? (Array.isArray(item.product.variants)
                            ? item.product.variants.find(v => v._id === item.variant)
                            : item.product.variants)
                        : null;
                    const priceVal = variant?.price?.amount ?? item.product?.price?.amount ?? 0;
                    return sum + priceVal * item.quantity;
                }, 0);
                const firstItem = initialItems[0];
                const tempCurrency = initialItems.length > 0
                    ? (firstItem.variant && firstItem.product?.variants
                        ? (Array.isArray(firstItem.product.variants)
                            ? firstItem.product.variants.find(v => v._id === firstItem.variant)?.price?.currency
                            : firstItem.product.variants.price?.currency)
                        : null) || firstItem.product?.price?.currency || "INR"
                    : "INR";

                setOrderData({
                    items: initialItems,
                    price: { amount: tempSubtotal, currency: tempCurrency },
                    status: 'paid'
                });
                return;
            }

            if (orderId && orderId !== '—') {
                setLoading(true);
                const payment = await handleGetPaymentOrderDetails(orderId);
                if (payment) {
                    // Normalize backend payment order items format to UI items format
                    const normalizedItems = payment.orderItems.map(item => ({
                        _id: item._id,
                        quantity: item.quantity,
                        variant: item.variantId || item.variant,
                        product: {
                            _id: item.productId,
                            title: item.title,
                            images: item.images,
                            description: item.description,
                            price: item.price,
                            variants: item.variantId ? [{
                                _id: item.variantId,
                                price: item.price,
                                images: item.images
                            }] : []
                        }
                    }));
                    setOrderData({
                        items: normalizedItems,
                        price: payment.price,
                        status: payment.status,
                        address: payment.address
                    });
                }
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [orderId, dispatch]);

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'order') {
            setCopiedOrder(true);
            setTimeout(() => setCopiedOrder(false), 2000);
        } else {
            setCopiedPayment(true);
            setTimeout(() => setCopiedPayment(false), 2000);
        }
    };

    const getVariantData = (item) => {
        if (!item.variant || !item.product?.variants) return null;
        if (Array.isArray(item.product.variants)) {
            return item.product.variants.find(v => v._id === item.variant);
        }
        if (item.product.variants._id === item.variant) {
            return item.product.variants;
        }
        return item.product.variants;
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
        return Object.values(variant.attributes)
            .join(" · ");
    };

    const getItemImages = (item) => {
        const variant = getVariantData(item);
        if (variant?.images?.length > 0) return variant.images;
        if (item.product?.images?.length > 0) return item.product.images;
        return [];
    };

    const displayItems = orderData?.items || [];
    const displayPrice = orderData?.price ? orderData.price.amount : 0;
    const displayCurrency = orderData?.price ? orderData.price.currency : "INR";
    const displayShipping = displayPrice > 999 ? 0 : (displayItems.length > 0 ? 99 : 0);
    const displayTotal = displayPrice + displayShipping;

    const formatPrice = (amount, curr = "INR") => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: curr,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "long"
    }).format(new Date());

    const getDeliveryDateRange = () => {
        const start = new Date();
        start.setDate(start.getDate() + 3);
        const end = new Date();
        end.setDate(end.getDate() + 5);
        const options = { month: 'short', day: 'numeric' };
        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    };

    if (loading) {
        return <Loader text="Retrieving order details" />;
    }

    return (
        <div className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col selection:bg-neutral-200">

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes drawCheck {
          0% { stroke-dashoffset: 30; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          0% { transform: translateY(15px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}} />

            {/* Navbar */}
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto px-6 sm:px-10 py-12 w-full flex flex-col items-center">

                {/* Animated Checkmark Circle */}
                <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#d4af8a]/15 border border-[#d4af8a]/35 flex items-center justify-center shadow-sm">
                        <CheckIcon />
                    </div>
                </div>

                {/* Heading */}
                <div className="text-center mb-10 animate-[slideUp_0.6s_ease-out_forwards]">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#a6825c] mb-3">
                        Payment Successful
                    </p>
                    <h1 className="font-serif text-3xl sm:text-[2.5rem] text-neutral-900 leading-tight tracking-[-0.02em] mb-4">
                        Thank you for your order
                    </h1>
                    <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                        Your payment was completed successfully. An email containing your receipt has been dispatched to your inbox.
                    </p>
                </div>

                {/* Horizontal Progress Tracker */}
                <div className="w-full max-w-lg mb-10 bg-neutral-50/70 border border-neutral-100 rounded-2xl p-5 sm:p-6 animate-[slideUp_0.6s_ease-out_forwards]">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-5 px-1">
                        <span>Order Progress</span>
                        <span className="text-[#a6825c] font-bold">Processing</span>
                    </div>

                    <div className="relative flex justify-between items-center w-full px-4 mb-2">
                        {/* Timeline Line */}
                        <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-neutral-200 -translate-y-1/2 -z-10 rounded-full">
                            <div className="h-full w-1/3 bg-neutral-900 rounded-full"></div>
                        </div>

                        {/* Step 1 */}
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-white border border-neutral-900 flex items-center justify-center shadow-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900"></div>
                            </div>
                            <span className="text-[9px] font-semibold tracking-wider text-neutral-800 mt-2 uppercase">Confirmed</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-white border border-neutral-900 flex items-center justify-center shadow-sm animate-pulse">
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900"></div>
                            </div>
                            <span className="text-[9px] font-semibold tracking-wider text-neutral-800 mt-2 uppercase">Processing</span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                            </div>
                            <span className="text-[9px] font-semibold tracking-wider text-neutral-400 mt-2 uppercase">Shipped</span>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-transparent"></div>
                            </div>
                            <span className="text-[9px] font-semibold tracking-wider text-neutral-400 mt-2 uppercase">Delivered</span>
                        </div>
                    </div>
                </div>

                {/* Meta Cards Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 animate-[slideUp_0.7s_ease-out_forwards]">

                    {/* Card 1: Identifiers */}
                    <div className="bg-neutral-50/70 border border-neutral-100 rounded-2xl p-6 hover:border-neutral-200 transition-all duration-300 flex flex-col justify-between">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-4">
                            Receipt Details
                        </h3>
                        <div className="space-y-4">
                            {/* Order ID */}
                            <div>
                                <span className="block text-[9px] text-neutral-400 uppercase tracking-widest mb-1">Order ID</span>
                                <div className="flex items-center justify-between bg-white border border-neutral-200/60 rounded-lg px-3 py-2">
                                    <code className="text-xs text-neutral-800 font-semibold break-all mr-2">{orderId}</code>
                                    <button
                                        onClick={() => copyToClipboard(orderId, 'order')}
                                        className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                                        title="Copy Order ID"
                                    >
                                        {copiedOrder ? <CopiedCheckIcon /> : <CopyIcon />}
                                    </button>
                                </div>
                            </div>

                            {/* Payment ID */}
                            <div>
                                <span className="block text-[9px] text-neutral-400 uppercase tracking-widest mb-1">Payment ID</span>
                                <div className="flex items-center justify-between bg-white border border-neutral-200/60 rounded-lg px-3 py-2">
                                    <code className="text-xs text-neutral-800 font-semibold break-all mr-2">{paymentId}</code>
                                    <button
                                        onClick={() => copyToClipboard(paymentId, 'payment')}
                                        className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                                        title="Copy Payment ID"
                                    >
                                        {copiedPayment ? <CopiedCheckIcon /> : <CopyIcon />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Ship Dates */}
                    <div className="bg-neutral-50/70 border border-neutral-100 rounded-2xl p-6 hover:border-neutral-200 transition-all duration-300 flex flex-col justify-between">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-4">
                            Delivery Information
                        </h3>
                        <div className="space-y-4 text-xs font-semibold text-neutral-700">
                            <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200/60">
                                <span className="text-neutral-400 font-normal uppercase tracking-wider text-[10px]">Purchase Date</span>
                                <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-center justify-between pb-2.5 border-b border-neutral-200/60">
                                <span className="text-neutral-400 font-normal uppercase tracking-wider text-[10px]">Estimated Delivery</span>
                                <div className="flex items-center gap-1.5 font-bold text-amber-700">
                                    <CalendarIcon />
                                    <span>{getDeliveryDateRange()}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-0.5">
                                <span className="text-neutral-400 font-normal uppercase tracking-wider text-[10px]">Shipping Method</span>
                                <span>Standard Secured Delivery</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Item Summary Details */}
                {displayItems.length > 0 && (
                    <div className="w-full border border-neutral-100 rounded-2xl p-6 sm:p-8 bg-white shadow-sm mb-8 animate-[slideUp_0.8s_ease-out_forwards]">
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-5">
                            Purchased Summary ({displayItems.reduce((sum, item) => sum + item.quantity, 0)} Items)
                        </h3>
                        <div className="divide-y divide-neutral-100">
                            {displayItems.map((item) => {
                                const images = getItemImages(item);
                                const price = getItemPrice(item);
                                const curr = getItemCurrency(item);
                                const label = getVariantLabel(item);

                                return (
                                    <div key={item._id} className="py-4 flex gap-4 items-center group">
                                        <div className="w-12 h-16 bg-neutral-50 rounded-lg overflow-hidden border border-neutral-100 shrink-0">
                                            {images.length > 0 ? (
                                                <img src={images[0]?.url} alt={item.product?.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-neutral-300">🖼</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-800 truncate">
                                                {item.product?.title}
                                            </h4>
                                            {label && (
                                                <span className="inline-block mt-1 text-[9px] font-bold tracking-widest uppercase text-[#a6825c] bg-[#d4af8a]/15 border border-[#d4af8a]/30 px-2 py-0.5 rounded">
                                                    {label}
                                                </span>
                                            )}
                                            <p className="text-[10px] text-neutral-400 mt-1">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <span className="text-xs font-semibold text-neutral-950 shrink-0">
                                            {formatPrice(price * item.quantity, curr)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Calculations breakdown */}
                        <div className="h-px bg-neutral-100 my-5" />
                        <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between text-neutral-500">
                                <span>Subtotal</span>
                                <span className="font-semibold text-neutral-900">{formatPrice(displayPrice, displayCurrency)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-500">
                                <span>Shipping</span>
                                {displayShipping === 0 ? (
                                    <span className="font-semibold text-emerald-600">Free Shipping</span>
                                ) : (
                                    <span className="font-semibold text-neutral-900">{formatPrice(displayShipping, displayCurrency)}</span>
                                )}
                            </div>
                            <div className="h-px bg-neutral-100 my-4" />
                            <div className="flex justify-between text-sm font-bold text-neutral-950 uppercase tracking-widest pt-0.5">
                                <span>Total Paid</span>
                                <span>{formatPrice(displayTotal, displayCurrency)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Security / Insured details */}
                <div className="w-full flex items-center justify-center gap-2 text-center text-[10px] text-neutral-400 py-4 border-t border-b border-neutral-100 mb-8 animate-[slideUp_0.8s_ease-out_forwards]">
                    <ShieldCheckIcon />
                    <span>If you need support, please contact us at <a href="mailto:support@vexto.com" className="text-neutral-800 underline font-semibold hover:text-neutral-500 transition-colors">support@vexto.com</a></span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:justify-center animate-[slideUp_0.9s_ease-out_forwards]">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex-1 sm:flex-initial bg-neutral-900 text-white text-xs font-semibold uppercase tracking-[0.2em] px-10 py-4 rounded-xl hover:bg-neutral-800 transition-all hover:shadow-md hover:-translate-y-0.5 duration-200"
                    >
                        Continue Shopping
                    </button>
                    <button
                        onClick={() => navigate('/account')}
                        className="flex-1 sm:flex-initial bg-white border border-neutral-200 hover:border-neutral-900 text-neutral-900 text-xs font-semibold uppercase tracking-[0.15em] px-10 py-4 rounded-xl hover:bg-neutral-50 transition-all duration-200"
                    >
                        View My Orders
                    </button>
                </div>

            </main>

            {/* Footer */}
            <Footer />
        </div>
    )
}

export default OrderSuccesss