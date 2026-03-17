import { createContext, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa";
import { WishlistContext } from "../context/WishlistContext";

// ── WishlistContext ────────────────────────────────────────────────────────
// Add this export to a new file: src/context/WishlistContext.jsx
// and wrap in index.js alongside CartProvider.
// For now it's self-contained here for easy copy-paste.


// ── Wishlist page ──────────────────────────────────────────────────────────
export default function Wishlist() {
    const { wishlist, removeFromWishlist } = useContext(WishlistContext);
    const { addToCart }                    = useContext(CartContext);
    const navigate                         = useNavigate();
    const [added, setAdded]                = useState({});

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        setAdded(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => setAdded(prev => ({ ...prev, [product.id]: false })), 2000);
    };

    return (
        <div className="relative bg-[#060f1e] text-white min-h-screen">

            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-1/3 w-[400px] h-[400px] bg-[#b11226]/8 blur-[140px] rounded-full" />
                <div className="absolute bottom-20 right-1/3 w-[400px] h-[400px] bg-blue-600/8 blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-[-0.5px]" style={{ fontFamily: "'Georgia', serif" }}>
                            My Wishlist
                        </h1>
                        <p className="text-white/40 text-sm mt-1">
                            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/products")}
                        className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition"
                    >
                        <FaArrowLeft size={12} /> Browse products
                    </button>
                </div>

                {/* Empty state */}
                {wishlist.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 bg-white/5 border border-white/10 rounded-2xl">
                        <div className="w-20 h-20 rounded-full bg-[#b11226]/10 border border-[#b11226]/20 flex items-center justify-center mb-6">
                            <FaHeart size={30} className="text-[#b11226]/40" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
                        <p className="text-white/30 text-sm mb-8">Save items you love and come back to them anytime.</p>
                        <Link to="/products">
                            <button className="px-8 py-3 bg-[#b11226] hover:bg-red-700 text-white font-bold text-sm tracking-widest rounded-xl transition">
                                Browse Products
                            </button>
                        </Link>
                    </div>
                )}

                {/* Grid */}
                {wishlist.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {wishlist.map(product => (
                                <div
                                    key={product.id}
                                    className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#b11226]/30 hover:shadow-[0_0_20px_rgba(177,18,38,0.15)] transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative overflow-hidden">
                                        <Link to={`/product/${product.id}`}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </Link>

                                        {/* Remove button */}
                                        <button
                                            onClick={() => removeFromWishlist(product.id)}
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#060f1e]/80 border border-white/15 flex items-center justify-center text-[#b11226] hover:bg-[#b11226] hover:text-white hover:border-[#b11226] transition"
                                            title="Remove from wishlist"
                                        >
                                            <FaHeart size={12} />
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="flex flex-col flex-1 p-4">
                                        <Link to={`/product/${product.id}`}>
                                            <h3 className="text-sm font-semibold line-clamp-2 hover:text-red-300 transition mb-1">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        {product.category && (
                                            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
                                                {product.category}
                                            </p>
                                        )}

                                        <p className="text-[#b11226] font-black text-base mt-auto mb-3">
                                            ₹ {product.price}
                                        </p>

                                        <div className="flex gap-2">
                                            {/* Add to cart */}
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold tracking-wide transition
                                                    ${added[product.id]
                                                    ? "bg-green-500/20 border border-green-500/40 text-green-400"
                                                    : "bg-[#b11226]/20 border border-[#b11226]/40 text-white hover:bg-[#b11226] hover:border-[#b11226]"}`}
                                            >
                                                {added[product.id]
                                                    ? <><FaShoppingCart size={11} /> Added!</>
                                                    : <><FaShoppingCart size={11} /> Add to Cart</>
                                                }
                                            </button>

                                            {/* Remove */}
                                            <button
                                                onClick={() => removeFromWishlist(product.id)}
                                                className="w-9 flex items-center justify-center rounded-xl border border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/30 hover:bg-red-500/8 transition"
                                                title="Remove"
                                            >
                                                <FaTrash size={11} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bulk actions */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/8">
                            <p className="text-xs text-white/30">{wishlist.length} items in your wishlist</p>
                            <button
                                onClick={() => wishlist.forEach(p => addToCart(p, 1))}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#b11226] hover:bg-red-700 text-white text-sm font-bold tracking-widest rounded-xl transition"
                            >
                                <FaShoppingCart size={12} /> Add All to Cart
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}