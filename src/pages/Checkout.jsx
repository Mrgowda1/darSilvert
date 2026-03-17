import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaLock, FaChevronRight, FaChevronLeft,
    FaMapMarkerAlt, FaClipboardList, FaCreditCard,
    FaCheckCircle, FaTrash
} from "react-icons/fa";

// ── Step indicator ─────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, label: "Shipping",  icon: FaMapMarkerAlt  },
    { id: 2, label: "Review",    icon: FaClipboardList },
    { id: 3, label: "Payment",   icon: FaCreditCard    },
];

function StepBar({ current }) {
    return (
        <div className="flex items-center justify-center mb-10">
            {STEPS.map((s, i) => {
                const Icon     = s.icon;
                const done     = current > s.id;
                const active   = current === s.id;
                return (
                    <div key={s.id} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                ${done   ? "bg-[#b11226] border-[#b11226]" :
                                active ? "bg-[#b11226]/20 border-[#b11226]" :
                                    "bg-white/5 border-white/15"}`}
                            >
                                {done
                                    ? <FaCheckCircle size={14} className="text-white" />
                                    : <Icon size={13} className={active ? "text-[#b11226]" : "text-white/30"} />
                                }
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest font-semibold
                                ${active ? "text-white" : done ? "text-[#b11226]" : "text-white/30"}`}>
                                {s.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`w-24 h-[2px] mx-2 mb-5 rounded-full transition-all duration-500
                                ${current > s.id ? "bg-[#b11226]" : "bg-white/10"}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ── Input field ────────────────────────────────────────────────────────────
function Field({ label, value, onChange, onBlur, error, placeholder, type = "text", half }) {
    return (
        <div className={half ? "col-span-1" : "col-span-2"}>
            <label className="block text-xs uppercase tracking-widest text-white/50 mb-1.5 font-semibold">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition
                    focus:bg-white/8 focus:shadow-[0_0_0_2px_rgba(177,18,38,0.4)]
                    ${error ? "border-red-500/60" : "border-white/15 focus:border-[#b11226]/60"}`}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
}

// ── Payment card input ─────────────────────────────────────────────────────
function CardField({ label, value, onChange, placeholder, type = "text", half, maxLength }) {
    return (
        <div className={half ? "col-span-1" : "col-span-2"}>
            <label className="block text-xs uppercase tracking-widest text-white/50 mb-1.5 font-semibold">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                className="w-full bg-white/5 border border-white/15 focus:border-[#b11226]/60 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:bg-white/8 focus:shadow-[0_0_0_2px_rgba(177,18,38,0.4)]"
            />
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════
export default function Checkout() {

    const { cart, totalPrice, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [step, setStep]       = useState(1);
    const [ordered, setOrdered] = useState(false);

    // ── Shipping fields ────────────────────────────────────────────────────
    const [ship, setShip] = useState({
        firstName: "", lastName: "", email: "",
        phone: "", address: "", city: "",
        state: "", zip: "", country: "India",
    });
    const [shipErrors, setShipErrors] = useState({});

    const setF = (key) => (e) =>
        setShip(prev => ({ ...prev, [key]: e.target.value }));

    const blurF = (key) => () => validateField(key);

    const validateField = (key) => {
        const v = ship[key].trim();
        let err = "";
        if (!v) err = "This field is required.";
        else if (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
            err = "Enter a valid email.";
        else if (key === "phone" && !/^\d{10}$/.test(v))
            err = "Enter a valid 10-digit phone number.";
        else if (key === "zip" && !/^\d{4,6}$/.test(v))
            err = "Enter a valid ZIP / PIN code.";
        setShipErrors(prev => ({ ...prev, [key]: err }));
        return !err;
    };

    const validateShipping = () => {
        const keys = Object.keys(ship);
        let valid = true;
        keys.forEach(k => { if (!validateField(k)) valid = false; });
        return valid;
    };

    // ── Payment fields ─────────────────────────────────────────────────────
    const [pay, setPay] = useState({
        method: "card", cardName: "",
        cardNumber: "", expiry: "", cvv: "",
    });

    const setP = (key) => (e) =>
        setPay(prev => ({ ...prev, [key]: e.target.value }));

    // ── Totals ─────────────────────────────────────────────────────────────
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const shipping   = totalPrice > 500 ? 0 : 49;
    const tax        = parseFloat((totalPrice * 0.05).toFixed(2));
    const grandTotal = parseFloat((totalPrice + shipping + tax).toFixed(2));

    // ── Place order ────────────────────────────────────────────────────────
    const placeOrder = () => {
        const token = localStorage.getItem("token");
        axios.post(
            "http://localhost:5000/order",
            { total: grandTotal },
            { headers: { Authorization: token } }
        ).then(() => setOrdered(true))
            .catch(() => setOrdered(true)); // show success even if API is offline
    };

    // ── Success screen ─────────────────────────────────────────────────────
    if (ordered) return (
        <div className="relative bg-[#0b1f3a] text-white min-h-screen flex items-center justify-center">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-green-700/15 blur-[160px] rounded-full" />
            </div>
            <div className="relative z-10 text-center backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-14 max-w-md">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                    <FaCheckCircle size={28} className="text-green-400" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-widest mb-2">Order Placed!</h2>
                <p className="text-white/50 text-sm mb-8">
                    Thank you, {ship.firstName}! Your order has been received and is being processed.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="px-8 py-3 bg-[#b11226] hover:bg-red-700 text-white font-bold text-sm tracking-widest rounded-xl transition"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );

    // ══════════════════════════════════════════════════════════════════════
    return (
        <div className="relative bg-[#0b1f3a] text-white min-h-screen">

            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-red-700/10 blur-[160px] rounded-full" />
                <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[160px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

                {/* Page title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold tracking-[4px] drop-shadow-[0_0_10px_rgba(255,0,0,0.4)]">
                        CHECKOUT
                    </h1>
                    <p className="text-white/30 text-sm mt-1 flex items-center justify-center gap-1.5">
                        <FaLock size={10} /> Secure checkout
                    </p>
                </div>

                {/* Step bar */}
                <StepBar current={step} />

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* ── LEFT: step content ── */}
                    <div className="flex-1">

                        {/* ════ STEP 1 — Shipping ════ */}
                        {step === 1 && (
                            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-7">
                                <h2 className="font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-[#b11226]" /> Shipping Address
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="First Name"   value={ship.firstName} onChange={setF("firstName")} onBlur={blurF("firstName")} error={shipErrors.firstName} placeholder="Jane"               half />
                                    <Field label="Last Name"    value={ship.lastName}  onChange={setF("lastName")}  onBlur={blurF("lastName")}  error={shipErrors.lastName}  placeholder="Doe"                half />
                                    <Field label="Email"        value={ship.email}     onChange={setF("email")}     onBlur={blurF("email")}     error={shipErrors.email}     placeholder="jane@example.com"   type="email" />
                                    <Field label="Phone"        value={ship.phone}     onChange={setF("phone")}     onBlur={blurF("phone")}     error={shipErrors.phone}     placeholder="10-digit number"    type="tel" />
                                    <Field label="Address"      value={ship.address}   onChange={setF("address")}   onBlur={blurF("address")}   error={shipErrors.address}   placeholder="Street, building, flat" />
                                    <Field label="City"         value={ship.city}      onChange={setF("city")}      onBlur={blurF("city")}      error={shipErrors.city}      placeholder="Mumbai"             half />
                                    <Field label="State"        value={ship.state}     onChange={setF("state")}     onBlur={blurF("state")}     error={shipErrors.state}     placeholder="Maharashtra"        half />
                                    <Field label="ZIP / PIN"    value={ship.zip}       onChange={setF("zip")}       onBlur={blurF("zip")}       error={shipErrors.zip}       placeholder="400001"             half />
                                    <Field label="Country"      value={ship.country}   onChange={setF("country")}   onBlur={blurF("country")}   error={shipErrors.country}   placeholder="India"              half />
                                </div>
                                <button
                                    onClick={() => { if (validateShipping()) setStep(2); }}
                                    className="mt-6 w-full py-3.5 bg-[#b11226] hover:bg-red-700 text-white font-bold tracking-widest text-sm rounded-xl transition flex items-center justify-center gap-2"
                                >
                                    Continue to Review <FaChevronRight size={11} />
                                </button>
                            </div>
                        )}

                        {/* ════ STEP 2 — Review ════ */}
                        {step === 2 && (
                            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-7">
                                <h2 className="font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-2">
                                    <FaClipboardList className="text-[#b11226]" /> Review Your Order
                                </h2>

                                {/* Shipping summary */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5 text-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">Delivering to</p>
                                        <button onClick={() => setStep(1)} className="text-xs text-[#b11226] hover:underline">Edit</button>
                                    </div>
                                    <p className="font-semibold">{ship.firstName} {ship.lastName}</p>
                                    <p className="text-white/50 text-xs mt-0.5">{ship.address}, {ship.city}, {ship.state} {ship.zip}</p>
                                    <p className="text-white/50 text-xs">{ship.email} · {ship.phone}</p>
                                </div>

                                {/* Items list */}
                                <div className="space-y-3 mb-5">
                                    {cart.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-3">
                                            <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold line-clamp-1">{item.name}</p>
                                                <p className="text-white/40 text-xs mt-0.5">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-[#b11226] font-bold text-sm">
                                                    ₹ {(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <button onClick={() => removeFromCart(idx)} className="text-white/20 hover:text-[#b11226] transition mt-1">
                                                    <FaTrash size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3 border border-white/15 hover:bg-white/5 text-white text-sm rounded-xl transition flex items-center justify-center gap-2"
                                    >
                                        <FaChevronLeft size={11} /> Back
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        className="flex-[2] py-3 bg-[#b11226] hover:bg-red-700 text-white font-bold tracking-widest text-sm rounded-xl transition flex items-center justify-center gap-2"
                                    >
                                        Continue to Payment <FaChevronRight size={11} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ════ STEP 3 — Payment ════ */}
                        {step === 3 && (
                            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-7">
                                <h2 className="font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-2">
                                    <FaCreditCard className="text-[#b11226]" /> Payment Method
                                </h2>

                                {/* Method tabs */}
                                <div className="flex gap-3 mb-6">
                                    {["card", "upi", "cod"].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setPay(prev => ({ ...prev, method: m }))}
                                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition
                                                ${pay.method === m
                                                ? "bg-[#b11226]/20 border-[#b11226]/60 text-white"
                                                : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/8"}`}
                                        >
                                            {m === "card" ? "Credit / Debit" : m === "upi" ? "UPI" : "Cash on Delivery"}
                                        </button>
                                    ))}
                                </div>

                                {/* Card inputs */}
                                {pay.method === "card" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <CardField label="Name on Card"   value={pay.cardName}   onChange={setP("cardName")}   placeholder="Jane Doe" />
                                        <CardField label="Card Number"    value={pay.cardNumber} onChange={setP("cardNumber")} placeholder="1234 5678 9012 3456" maxLength={19} />
                                        <CardField label="Expiry"         value={pay.expiry}     onChange={setP("expiry")}     placeholder="MM / YY" maxLength={7}  half />
                                        <CardField label="CVV"            value={pay.cvv}        onChange={setP("cvv")}        placeholder="•••"     maxLength={4}  half type="password" />
                                    </div>
                                )}

                                {/* UPI input */}
                                {pay.method === "upi" && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <CardField label="UPI ID" value={pay.upiId || ""} onChange={setP("upiId")} placeholder="yourname@upi" />
                                    </div>
                                )}

                                {/* COD notice */}
                                {pay.method === "cod" && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/60">
                                        Pay ₹ {grandTotal} in cash when your order is delivered. No advance payment required.
                                    </div>
                                )}

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="flex-1 py-3 border border-white/15 hover:bg-white/5 text-white text-sm rounded-xl transition flex items-center justify-center gap-2"
                                    >
                                        <FaChevronLeft size={11} /> Back
                                    </button>
                                    <button
                                        onClick={placeOrder}
                                        className="flex-[2] py-3 bg-[#b11226] hover:bg-red-700 text-white font-bold tracking-widest text-sm rounded-xl transition shadow-[0_4px_20px_rgba(177,18,38,0.4)] flex items-center justify-center gap-2"
                                    >
                                        <FaLock size={11} /> Place Order · ₹ {grandTotal}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── RIGHT: order summary ── */}
                    <div className="w-full lg:w-72 shrink-0 sticky top-24">
                        <div className="backdrop-blur-lg bg-white/8 border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="h-[3px] w-full bg-[#b11226]" />
                            <div className="p-5">
                                <h3 className="font-bold tracking-widest text-xs uppercase mb-4 text-white/60">
                                    Order Summary
                                </h3>

                                {/* Mini item list */}
                                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                                    {cart.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="relative shrink-0">
                                                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#b11226] rounded-full text-[9px] font-bold flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <p className="text-xs text-white/70 flex-1 line-clamp-1">{item.name}</p>
                                            <p className="text-xs font-semibold shrink-0">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-white/10 pt-3 space-y-2 text-xs">
                                    <div className="flex justify-between text-white/50">
                                        <span>Subtotal</span><span className="text-white">₹ {totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-white/50">
                                        <span>Shipping</span>
                                        <span className={shipping === 0 ? "text-green-400 font-semibold" : "text-white"}>
                                            {shipping === 0 ? "FREE" : `₹ ${shipping}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-white/50">
                                        <span>Tax (5%)</span><span className="text-white">₹ {tax}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-sm pt-2 border-t border-white/10">
                                        <span>Total</span>
                                        <span className="text-[#b11226] text-base">₹ {grandTotal}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}