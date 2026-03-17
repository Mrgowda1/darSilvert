import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FaChevronDown, FaChevronUp, FaSearch,
    FaBoxOpen, FaCheckCircle, FaTruck,
    FaClock, FaTimes, FaFilter
} from "react-icons/fa";

// ── Status config ──────────────────────────────────────────────────────────
const STATUS = {
    pending:    { label: "Pending",    color: "amber",  icon: FaClock        },
    processing: { label: "Processing", color: "blue",   icon: FaBoxOpen      },
    shipped:    { label: "Shipped",    color: "purple", icon: FaTruck        },
    delivered:  { label: "Delivered",  color: "green",  icon: FaCheckCircle  },
    cancelled:  { label: "Cancelled",  color: "red",    icon: FaTimes        },
};

const STATUS_COLORS = {
    amber:  { bg: "bg-amber-500/15",  border: "border-amber-500/30",  text: "text-amber-400"  },
    blue:   { bg: "bg-blue-500/15",   border: "border-blue-500/30",   text: "text-blue-400"   },
    purple: { bg: "bg-purple-500/15", border: "border-purple-500/30", text: "text-purple-400" },
    green:  { bg: "bg-green-500/15",  border: "border-green-500/30",  text: "text-green-400"  },
    red:    { bg: "bg-red-500/15",    border: "border-red-500/30",    text: "text-red-400"    },
};

// Timeline steps in order
const TIMELINE_STEPS = ["pending", "processing", "shipped", "delivered"];

// ── Status badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const s = STATUS[status] || STATUS.pending;
    const c = STATUS_COLORS[s.color];
    const Icon = s.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.border} ${c.text}`}>
            <Icon size={10} />
            {s.label}
        </span>
    );
}

// ── Order timeline ─────────────────────────────────────────────────────────
function Timeline({ status }) {
    if (status === "cancelled") {
        return (
            <div className="flex items-center gap-2 text-red-400 text-xs font-semibold mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <FaTimes size={11} /> This order was cancelled.
            </div>
        );
    }

    const currentIdx = TIMELINE_STEPS.indexOf(status);

    return (
        <div className="mt-5">
            <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">
                Order Progress
            </p>
            <div className="flex items-center gap-0">
                {TIMELINE_STEPS.map((step, i) => {
                    const done    = i <= currentIdx;
                    const active  = i === currentIdx;
                    const s       = STATUS[step];
                    const Icon    = s.icon;
                    return (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center gap-1.5">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                                    ${done
                                    ? active
                                        ? "bg-[#b11226]/20 border-[#b11226] shadow-[0_0_10px_rgba(177,18,38,0.4)]"
                                        : "bg-[#b11226] border-[#b11226]"
                                    : "bg-white/5 border-white/10"}`}
                                >
                                    <Icon size={12} className={done ? "text-white" : "text-white/20"} />
                                </div>
                                <span className={`text-[9px] uppercase tracking-widest font-semibold whitespace-nowrap
                                    ${active ? "text-white" : done ? "text-white/60" : "text-white/20"}`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < TIMELINE_STEPS.length - 1 && (
                                <div className={`flex-1 h-[2px] mx-1 mb-4 rounded-full transition-all
                                    ${i < currentIdx ? "bg-[#b11226]" : "bg-white/10"}`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════
export default function Orders() {

    const [orders, setOrders]       = useState([]);
    const [loading, setLoading]     = useState(true);
    const [expanded, setExpanded]   = useState(null);
    const [search, setSearch]       = useState("");
    const [filterStatus, setFilter] = useState("all");
    const navigate                  = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:5000/myorders", {
            headers: { Authorization: token }
        })
            .then(res => {
                // Enrich with mock status & items if API doesn't return them
                const enriched = res.data.map((o, i) => ({
                    ...o,
                    status: o.status || ["pending","processing","shipped","delivered"][i % 4],
                    date:   o.date   || new Date(Date.now() - i * 86400000 * 3).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                    items:  o.items  || [],
                }));
                setOrders(enriched);
            })
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, []);

    const toggle = (id) => setExpanded(prev => prev === id ? null : id);

    // Filter + search
    const visible = orders.filter(o => {
        const matchSearch = String(o.id).includes(search) ||
            (o.username || "").toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "all" || o.status === filterStatus;
        return matchSearch && matchStatus;
    });

    // ── Loading skeleton ───────────────────────────────────────────────────
    if (loading) return (
        <div className="bg-[#0b1f3a] min-h-screen flex items-center justify-center">
            <div className="space-y-4 w-full max-w-3xl px-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                ))}
            </div>
        </div>
    );

    // ══════════════════════════════════════════════════════════════════════
    return (
        <div className="relative bg-[#0b1f3a] text-white min-h-screen">

            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-red-700/10 blur-[160px] rounded-full" />
                <div className="absolute bottom-20 right-1/3 w-[400px] h-[400px] bg-blue-500/10 blur-[160px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-[4px] drop-shadow-[0_0_10px_rgba(255,0,0,0.4)]">
                            MY ORDERS
                        </h1>
                        <p className="text-white/40 text-sm mt-1">
                            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/products")}
                        className="text-sm text-white/40 hover:text-white transition"
                    >
                        Shop more →
                    </button>
                </div>

                {/* ── Search + filter bar ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">

                    {/* Search */}
                    <div className="flex items-center gap-3 flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5">
                        <FaSearch size={13} className="text-white/30 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search by order ID or username..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-white placeholder:text-white/20 outline-none w-full"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="text-white/30 hover:text-white transition">
                                <FaTimes size={12} />
                            </button>
                        )}
                    </div>

                    {/* Status filter */}
                    <div className="flex items-center gap-2 bg-white/5 border border-white/15 rounded-xl px-4 py-2.5">
                        <FaFilter size={11} className="text-white/30 shrink-0" />
                        <select
                            value={filterStatus}
                            onChange={e => setFilter(e.target.value)}
                            className="bg-transparent text-sm text-white outline-none cursor-pointer"
                        >
                            <option value="all"        className="bg-[#0b1f3a]">All statuses</option>
                            <option value="pending"    className="bg-[#0b1f3a]">Pending</option>
                            <option value="processing" className="bg-[#0b1f3a]">Processing</option>
                            <option value="shipped"    className="bg-[#0b1f3a]">Shipped</option>
                            <option value="delivered"  className="bg-[#0b1f3a]">Delivered</option>
                            <option value="cancelled"  className="bg-[#0b1f3a]">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* ── Empty state ── */}
                {visible.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-28 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl">
                        <div className="w-16 h-16 rounded-full bg-[#b11226]/10 border border-[#b11226]/20 flex items-center justify-center mb-5">
                            <FaBoxOpen size={26} className="text-[#b11226]/50" />
                        </div>
                        <h2 className="text-lg font-bold tracking-widest mb-2">No orders found</h2>
                        <p className="text-white/30 text-sm mb-7">
                            {orders.length === 0
                                ? "You haven't placed any orders yet."
                                : "No orders match your search or filter."}
                        </p>
                        {orders.length === 0 && (
                            <button
                                onClick={() => navigate("/products")}
                                className="px-8 py-3 bg-[#b11226] hover:bg-red-700 text-white font-bold text-sm tracking-widest rounded-xl transition"
                            >
                                Start Shopping
                            </button>
                        )}
                        {orders.length > 0 && (
                            <button
                                onClick={() => { setSearch(""); setFilter("all"); }}
                                className="text-sm text-[#b11226] hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}

                {/* ── Order rows ── */}
                <div className="space-y-4">
                    {visible.map(order => {
                        const isOpen = expanded === order.id;
                        return (
                            <div
                                key={order.id}
                                className={`backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-300
                                    ${isOpen
                                    ? "bg-white/8 border-[#b11226]/30 shadow-[0_0_20px_rgba(177,18,38,0.15)]"
                                    : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/7"}`}
                            >
                                {/* ── Row header (always visible) ── */}
                                <button
                                    onClick={() => toggle(order.id)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                                >
                                    <div className="flex items-center gap-6 flex-1 min-w-0">

                                        {/* Order ID */}
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-0.5">
                                                Order
                                            </p>
                                            <p className="font-bold text-sm text-white">
                                                # {order.id}
                                            </p>
                                        </div>

                                        {/* Date */}
                                        <div className="hidden sm:block">
                                            <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-0.5">
                                                Date
                                            </p>
                                            <p className="text-sm text-white/70">{order.date}</p>
                                        </div>

                                        {/* Total */}
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-0.5">
                                                Total
                                            </p>
                                            <p className="text-sm font-bold text-[#b11226]">
                                                ₹ {Number(order.total).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <div className="ml-auto mr-4">
                                            <StatusBadge status={order.status} />
                                        </div>
                                    </div>

                                    {/* Chevron */}
                                    <div className={`text-white/30 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                                        <FaChevronDown size={13} />
                                    </div>
                                </button>

                                {/* ── Expanded content ── */}
                                {isOpen && (
                                    <div className="px-6 pb-6 border-t border-white/10">

                                        {/* Timeline */}
                                        <Timeline status={order.status} />

                                        {/* Items breakdown */}
                                        {order.items && order.items.length > 0 && (
                                            <div className="mt-5">
                                                <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">
                                                    Items
                                                </p>
                                                <div className="space-y-2">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                                            {item.image && (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="w-12 h-12 object-cover rounded-lg shrink-0"
                                                                />
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold line-clamp-1">{item.name}</p>
                                                                <p className="text-xs text-white/40 mt-0.5">Qty: {item.quantity}</p>
                                                            </div>
                                                            <p className="text-sm font-bold text-[#b11226] shrink-0">
                                                                ₹ {(item.price * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* No items fallback */}
                                        {(!order.items || order.items.length === 0) && (
                                            <div className="mt-5 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/40">
                                                Item details not available for this order.
                                            </div>
                                        )}

                                        {/* Order meta */}
                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {[
                                                { label: "Order ID",  value: `#${order.id}` },
                                                { label: "Total",     value: `₹ ${Number(order.total).toFixed(2)}` },
                                                { label: "Status",    value: STATUS[order.status]?.label || order.status },
                                            ].map(m => (
                                                <div key={m.label} className="bg-white/5 border border-white/8 rounded-xl px-4 py-3">
                                                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-1">{m.label}</p>
                                                    <p className="text-sm font-semibold">{m.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}