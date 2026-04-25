import React, { useEffect, useState } from 'react';
import { useProduct } from '../hook/useProduct';
import { useNavigate, useParams } from 'react-router';
import Footer from '../../shared/Footer';

const SellerProductDetails = () => {
    const { handleGetProductById, handleCreateProductVariant, handleUpdateVariantStock } = useProduct();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    // New Variant Form State
    const [images, setImages] = useState([]);
    const [stock, setStock] = useState('');
    const [priceAmount, setPriceAmount] = useState('');
    const [priceCurrency, setPriceCurrency] = useState('INR');
    const [attributes, setAttributes] = useState([{ key: '', value: '' }]);
    const [isCreatingVariant, setIsCreatingVariant] = useState(false);

    // Stock Management State
    const [stockUpdates, setStockUpdates] = useState({});

    const fetchProduct = async () => {
        setLoading(true);
        const data = await handleGetProductById(id);
        setProduct(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleAddAttribute = () => setAttributes([...attributes, { key: '', value: '' }]);
    
    const handleAttributeChange = (index, field, val) => {
        const newAttrs = [...attributes];
        newAttrs[index][field] = val;
        setAttributes(newAttrs);
    };

    const handleCreateVariant = async (e) => {
        e.preventDefault();
        setIsCreatingVariant(true);

        const formData = new FormData();
        formData.append('stock', stock);
        formData.append('priceAmount', priceAmount);
        formData.append('priceCurrency', priceCurrency);

        // Convert attributes array to object
        const attrObj = {};
        attributes.forEach(attr => {
            if (attr.key && attr.value) {
                attrObj[attr.key] = attr.value;
            }
        });

        formData.append('attributes', JSON.stringify(attrObj));

        // Add images
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        await handleCreateProductVariant(id, formData);
        
        // Reset form and refetch product
        setImages([]);
        setStock('');
        setPriceAmount('');
        setAttributes([{ key: '', value: '' }]);
        setIsCreatingVariant(false);
        fetchProduct();
    };

    const handleUpdateStock = async (variantId, currentStock) => {
        // If the user hasn't typed anything, fallback to current stock
        let newStock = stockUpdates[variantId];
        if (newStock === undefined || newStock === '') {
            newStock = currentStock;
        }

        await handleUpdateVariantStock(id, variantId, newStock);
        fetchProduct(); // Refresh
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    if (!product) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Product not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex-1 p-8">
                <div className="max-w-6xl mx-auto space-y-12">
                {/* Product Overview */}
                <div className="bg-white border border-gray-200 p-8 rounded-2xl flex gap-8 shadow-sm">
                    <div className="w-1/3">
                        {product.images && product.images.length > 0 ? (
                            <img src={product.images[0].url} alt={product.title} className="w-full h-auto object-cover rounded-xl" />
                        ) : (
                            <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">No Image</div>
                        )}
                    </div>
                    <div className="w-2/3 space-y-4">
                        <h1 className="text-4xl font-semibold tracking-wide text-gray-900">{product.title}</h1>
                        <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                        <p className="text-2xl text-gray-900 font-medium">
                            {product.price?.amount} {product.price?.currency}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Existing Variants */}
                    <div className="space-y-6">
                        <h2 className="text-2xl tracking-wide text-gray-900 border-b border-gray-200 pb-4">Product Variants</h2>
                        {product.variants && product.variants.length > 0 ? (
                            <div className="space-y-6">
                                {product.variants.map((variant, idx) => (
                                    <div key={variant._id || idx} className="bg-white border border-gray-200 rounded-xl p-6 flex gap-6 shadow-sm">
                                        <div className="w-24 h-24 shrink-0">
                                            {variant.images && variant.images.length > 0 ? (
                                                <img src={variant.images[0].url} alt="Variant" className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 rounded-lg"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-lg font-medium text-gray-900">{variant.price?.amount} {variant.price?.currency}</p>
                                                    {variant.attributes && Object.keys(variant.attributes).length > 0 && (
                                                        <div className="mt-2 text-sm text-gray-600">
                                                            {Object.entries(variant.attributes).map(([k, v]) => (
                                                                <span key={k} className="mr-3 bg-gray-100 px-2 py-1 rounded">{k}: {v}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Stock Manager */}
                                            <div className="flex items-end gap-4 pt-4 border-t border-gray-200">
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Current Stock</label>
                                                    <div className="text-lg text-gray-900">{variant.stock}</div>
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                    <label className="text-xs text-gray-500 uppercase tracking-wide">Update Stock</label>
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="number" 
                                                            min="0"
                                                            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors"
                                                            placeholder={variant.stock}
                                                            value={stockUpdates[variant._id] !== undefined ? stockUpdates[variant._id] : ''}
                                                            onChange={(e) => setStockUpdates({...stockUpdates, [variant._id]: e.target.value})}
                                                        />
                                                        <button 
                                                            onClick={() => handleUpdateStock(variant._id, variant.stock)}
                                                            className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                                        >
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No variants created yet.</p>
                        )}
                    </div>

                    {/* Create New Variant Form */}
                    <div>
                        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 sticky top-8">
                            <h2 className="text-2xl tracking-wide text-gray-900 mb-8">Add New Variant</h2>
                            <form onSubmit={handleCreateVariant} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600 tracking-wide">Price Amount</label>
                                        <input type="number" required value={priceAmount} onChange={e => setPriceAmount(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-black transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-600 tracking-wide">Stock Quantity</label>
                                        <input type="number" required value={stock} onChange={e => setStock(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-black transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm text-gray-600 tracking-wide">Attributes</label>
                                    {attributes.map((attr, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <input type="text" placeholder="Key (e.g. Size)" value={attr.key} onChange={e => handleAttributeChange(idx, 'key', e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors" />
                                            <input type="text" placeholder="Value (e.g. XL)" value={attr.value} onChange={e => handleAttributeChange(idx, 'value', e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-black transition-colors" />
                                        </div>
                                    ))}
                                    <button type="button" onClick={handleAddAttribute} className="text-sm text-gray-500 hover:text-black transition-colors">+ Add another attribute</button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-600 tracking-wide">Images</label>
                                    <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-black transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-black hover:file:bg-gray-200" />
                                </div>

                                <button type="submit" disabled={isCreatingVariant} className="w-full bg-black text-white py-4 rounded-xl font-medium tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50">
                                    {isCreatingVariant ? 'Creating...' : 'Create Variant'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <Footer />
        </div>
    );
};

export default SellerProductDetails;