import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
    FaShoppingCart, FaTrash, FaMinus, FaPlus,
    FaArrowLeft, FaLock
} from "react-icons/fa";

export default function Cart() {

    const { cart, removeFromCart, updateQuantity, totalPrice } =
        useContext(CartContext);

    const navigate = useNavigate();

    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const shipping   = totalPrice > 500 ? 0 : 49;
    const tax        = parseFloat((totalPrice * 0.05).toFixed(2));
    const grandTotal = parseFloat((totalPrice + shipping + tax).toFixed(2));

    // ── Quantity control ───────────────────────────────────────────────────
    const dec = (idx, qty) => { if (qty > 1) updateQuantity(idx, qty - 1); };
    const inc = (idx, qty) => updateQuantity(idx, qty + 1);

    // ══════════════════════════════════════════════════════════════════════
    return (
        <div className="relative bg-[#0b1f3a] text-white min-h-screen">

            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-red-700/15 blur-[160px] rounded-full" />
                <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-blue-500/15 blur-[160px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

                {/* ── Page header ── */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-[4px] drop-shadow-[0_0_10px_rgba(255,0,0,0.4)]">
                            YOUR CART
                        </h1>
                        <p className="text-white/40 text-sm mt-1">
                            {totalItems} {totalItems === 1 ? "item" : "items"}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/products")}
                        className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition"
                    >
                        <FaArrowLeft size={12} />
                        Continue shopping
                    </button>
                </div>


                {/* ── EMPTY STATE ── */}
                {cart.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl">
                        <div className="w-20 h-20 rounded-full bg-[#b11226]/10 border border-[#b11226]/20 flex items-center justify-center mb-6">
                            <FaShoppingCart size={30} className="text-[#b11226]/60" />
                        </div>
                        <h2 className="text-xl font-bold tracking-widest mb-2">Cart is empty</h2>
                        <p className="text-white/40 text-sm mb-8">
                            Looks like you haven't added anything yet.
                        </p>
                        <Link to="/products">
                            <button className="px-8 py-3 bg-[#b11226] hover:bg-red-700 text-white font-bold text-sm tracking-widest rounded-xl transition">
                                Browse Products
                            </button>
                        </Link>
                    </div>
                )}


                {/* ── CART + SUMMARY ── */}
                {cart.length > 0 && (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* ── Cart items ── */}
                        <div className="flex-1 space-y-4">

                            {/* Free shipping banner */}
                            {shipping > 0 && (
                                <div className="backdrop-blur-md bg-[#b11226]/10 border border-[#b11226]/30 rounded-xl px-5 py-3 text-sm flex items-center justify-between">
                                    <span className="text-white/70">
                                        Add <span className="text-white font-bold">₹{(500 - totalPrice).toFixed(2)}</span> more for free shipping
                                    </span>
                                    <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#b11226] rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((totalPrice / 500) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                            {shipping === 0 && (
                                <div className="backdrop-blur-md bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-3 text-sm text-green-400 font-semibold">
                                    ✓ You qualify for free shipping!
                                </div>
                            )}

                            {/* Items */}
                            {cart.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group flex gap-5 backdrop-blur-md bg-white/8 border border-white/15 rounded-2xl p-4 hover:border-[#b11226]/30 hover:shadow-[0_0_20px_rgba(177,18,38,0.15)] transition-all duration-300"
                                >
                                    {/* Image */}
                                    <Link to={`/product/${item.id}`} className="shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-xl group-hover:scale-105 transition duration-300"
                                        />
                                    </Link>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <Link to={`/product/${item.id}`}>
                                                    <h3 className="font-semibold text-sm leading-snug hover:text-red-300 transition line-clamp-2">
                                                        {item.name}
                                                    </h3>
                                                </Link>
                                                {item.category && (
                                                    <p className="text-[10px] uppercase tracking-widest text-white/30 mt-0.5">
                                                        {item.category}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(idx)}
                                                className="text-white/20 hover:text-[#b11226] transition shrink-0 mt-0.5"
                                            >
                                                <FaTrash size={13} />
                                            </button>
                                        </div>

                                        {/* Price + qty row */}
                                        <div className="flex items-center justify-between mt-4">
                                            {/* Qty controls */}
                                            <div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => dec(idx, item.quantity)}
                                                    disabled={item.quantity <= 1}
                                                    className="px-3 py-2 bg-white/10 hover:bg-[#b11226]/60 disabled:opacity-30 disabled:cursor-not-allowed transition text-white"
                                                >
                                                    <FaMinus size={9} />
                                                </button>
                                                <span className="w-10 text-center text-sm font-semibold py-2">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => inc(idx, item.quantity)}
                                                    className="px-3 py-2 bg-white/10 hover:bg-[#b11226]/60 transition text-white"
                                                >
                                                    <FaPlus size={9} />
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="text-[#b11226] font-bold text-base">
                                                    ₹ {(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                {item.quantity > 1 && (
                                                    <p className="text-white/30 text-xs">
                                                        ₹{item.price} × {item.quantity}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Clear all */}
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={() => cart.forEach((_, i) => removeFromCart(0))}
                                    className="text-xs text-white/30 hover:text-[#b11226] transition flex items-center gap-1.5"
                                >
                                    <FaTrash size={10} />
                                    Clear cart
                                </button>
                            </div>
                        </div>


                        {/* ── Order summary ── */}
                        <div className="w-full lg:w-80 shrink-0 sticky top-24">
                            <div className="backdrop-blur-lg bg-white/8 border border-white/15 rounded-2xl overflow-hidden shadow-2xl">

                                {/* Red top stripe */}
                                <div className="h-[3px] w-full bg-[#b11226]" />

                                <div className="p-6">
                                    <h2 className="font-bold tracking-widest text-sm uppercase mb-5">
                                        Order Summary
                                    </h2>

                                    {/* Line items */}
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between text-white/60">
                                            <span>Subtotal ({totalItems} items)</span>
                                            <span className="text-white">₹ {totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-white/60">
                                            <span>Shipping</span>
                                            <span className={shipping === 0 ? "text-green-400 font-semibold" : "text-white"}>
                                                {shipping === 0 ? "FREE" : `₹ ${shipping}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-white/60">
                                            <span>Tax (5%)</span>
                                            <span className="text-white">₹ {tax}</span>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-white/10 my-4" />

                                    {/* Grand total */}
                                    <div className="flex justify-between items-baseline mb-6">
                                        <span className="font-bold text-sm tracking-widest uppercase">Total</span>
                                        <span className="text-2xl font-extrabold text-[#b11226]">
                                            ₹ {grandTotal}
                                        </span>
                                    </div>

                                    {/* Checkout CTA */}
                                    <Link to="/checkout">
                                        <button className="w-full py-3.5 bg-[#b11226] hover:bg-red-700 text-white font-bold tracking-widest text-sm rounded-xl transition shadow-[0_4px_20px_rgba(177,18,38,0.4)] hover:shadow-[0_4px_30px_rgba(177,18,38,0.6)]">
                                            Proceed to Checkout
                                        </button>
                                    </Link>

                                    {/* Trust badge */}
                                    <div className="flex items-center justify-center gap-2 mt-4 text-white/30 text-xs">
                                        <FaLock size={10} />
                                        <span>Secure checkout</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}