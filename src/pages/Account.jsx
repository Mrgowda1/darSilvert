import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FaUser, FaLock, FaBoxOpen, FaMapMarkerAlt,
    FaEdit, FaTrash, FaPlus, FaCheckCircle,
    FaEye, FaEyeSlash, FaChevronRight, FaSignOutAlt
} from "react-icons/fa";

// ── Sidebar tabs ───────────────────────────────────────────────────────────
const TABS = [
    { id: "profile",   label: "Profile",        icon: FaUser         },
    { id: "password",  label: "Password",        icon: FaLock         },
    { id: "orders",    label: "Order History",   icon: FaBoxOpen      },
    { id: "addresses", label: "Addresses",       icon: FaMapMarkerAlt },
];

// ── Section card wrapper ───────────────────────────────────────────────────
function Card({ title, sub, children }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/8">
                <h2 className="font-bold text-base text-white">{title}</h2>
                {sub && <p className="text-xs text-white/40 mt-0.5">{sub}</p>}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

// ── Input ──────────────────────────────────────────────────────────────────
function Input({ label, value, onChange, type = "text", placeholder, disabled, suffix }) {
    return (
        <div>
            <label className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-1.5">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full bg-white/5 border border-white/12 focus:border-[#b11226]/60 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(177,18,38,0.15)]"
                />
                {suffix && <div className="absolute right-4 top-1/2 -translate-y-1/2">{suffix}</div>}
            </div>
        </div>
    );
}

// ── Toast ──────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0b1f3a] border border-green-500/30 rounded-xl px-5 py-3 shadow-2xl">
            <FaCheckCircle className="text-green-400" size={14} />
            <span className="text-sm text-white">{msg}</span>
        </div>
    );
}

// ══════════════════════════════════════════════════════════════════════════
export default function Account() {
    const navigate  = useNavigate();
    const token     = localStorage.getItem("token");
    const [tab, setTab]     = useState("profile");
    const [toast, setToast] = useState("");

    const success = (msg) => setToast(msg);

    useEffect(() => { if (!token) navigate("/login"); }, []);

    // ── Profile state ──────────────────────────────────────────────────────
    const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", phone: "" });
    const setP = (k) => (e) => setProfile(prev => ({ ...prev, [k]: e.target.value }));

    // ── Password state ─────────────────────────────────────────────────────
    const [pwd, setPwd]           = useState({ current: "", next: "", confirm: "" });
    const [showPwd, setShowPwd]   = useState({ current: false, next: false, confirm: false });
    const [pwdError, setPwdError] = useState("");
    const setPW = (k) => (e) => setPwd(prev => ({ ...prev, [k]: e.target.value }));
    const toggleShow = (k) => setShowPwd(prev => ({ ...prev, [k]: !prev[k] }));

    const pwdStrength = pwd.next.length === 0 ? 0 : pwd.next.length < 6 ? 1 : pwd.next.length < 10 ? 2 : 3;
    const strengthColor = ["", "bg-red-500", "bg-amber-400", "bg-green-500"];
    const strengthLabel = ["", "Weak", "Good", "Strong"];

    const changePassword = () => {
        if (!pwd.current || !pwd.next || !pwd.confirm) { setPwdError("Please fill all fields."); return; }
        if (pwd.next !== pwd.confirm) { setPwdError("New passwords don't match."); return; }
        if (pwd.next.length < 6)     { setPwdError("Password must be at least 6 characters."); return; }
        setPwdError("");
        setPwd({ current: "", next: "", confirm: "" });
        success("Password updated successfully!");
    };

    // ── Orders state ───────────────────────────────────────────────────────
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        if (tab !== "orders") return;
        axios.get("http://localhost:5000/myorders", { headers: { Authorization: token } })
            .then(res => setOrders(res.data))
            .catch(() => setOrders([]));
    }, [tab]);

    const STATUS_STYLE = {
        pending:    "bg-amber-500/15 text-amber-400 border-amber-500/30",
        processing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
        shipped:    "bg-purple-500/15 text-purple-400 border-purple-500/30",
        delivered:  "bg-green-500/15 text-green-400 border-green-500/30",
        cancelled:  "bg-red-500/15 text-red-400 border-red-500/30",
    };

    // ── Addresses state ────────────────────────────────────────────────────
    const [addresses, setAddresses] = useState([
        { id: 1, label: "Home",   name: "Jane Doe",  line1: "123 Main St",    city: "Philadelphia", state: "PA", zip: "19103", country: "USA", default: true  },
        { id: 2, label: "Office", name: "Jane Doe",  line1: "456 Market Ave", city: "Philadelphia", state: "PA", zip: "19104", country: "USA", default: false },
    ]);
    const [addrForm, setAddrForm]   = useState(null); // null = closed, {} = new, {id} = edit
    const [addrData, setAddrData]   = useState({ label: "", name: "", line1: "", city: "", state: "", zip: "", country: "USA" });
    const setAD = (k) => (e) => setAddrData(prev => ({ ...prev, [k]: e.target.value }));

    const openAddrForm = (addr = null) => {
        setAddrData(addr ? { ...addr } : { label: "", name: "", line1: "", city: "", state: "", zip: "", country: "USA" });
        setAddrForm(addr ? addr.id : "new");
    };

    const saveAddr = () => {
        if (addrForm === "new") {
            setAddresses(prev => [...prev, { ...addrData, id: Date.now(), default: prev.length === 0 }]);
        } else {
            setAddresses(prev => prev.map(a => a.id === addrForm ? { ...a, ...addrData } : a));
        }
        setAddrForm(null);
        success("Address saved!");
    };

    const deleteAddr  = (id) => setAddresses(prev => prev.filter(a => a.id !== id));
    const setDefault  = (id) => setAddresses(prev => prev.map(a => ({ ...a, default: a.id === id })));

    const logout = () => { localStorage.removeItem("token"); navigate("/"); window.location.reload(); };

    // ══════════════════════════════════════════════════════════════════════
    return (
        <div className="relative bg-[#060f1e] text-white min-h-screen">
            {toast && <Toast msg={toast} onClose={() => setToast("")} />}

            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-[#b11226]/8 blur-[140px] rounded-full" />
                <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-blue-600/8 blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-[-0.5px]" style={{ fontFamily: "'Georgia', serif" }}>
                        My Account
                    </h1>
                    <p className="text-white/40 text-sm mt-1">Manage your profile, security and addresses</p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">

                    {/* ── Sidebar ── */}
                    <aside className="w-full md:w-56 shrink-0">
                        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                            {TABS.map((t, i) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition
                                        ${tab === t.id
                                        ? "bg-[#b11226]/20 text-white border-l-2 border-[#b11226]"
                                        : "text-white/50 hover:text-white hover:bg-white/5"}
                                        ${i < TABS.length - 1 ? "border-b border-white/5" : ""}`}
                                >
                                    <t.icon size={13} className={tab === t.id ? "text-[#b11226]" : "text-white/30"} />
                                    {t.label}
                                </button>
                            ))}
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition border-t border-white/5"
                            >
                                <FaSignOutAlt size={13} />
                                Sign Out
                            </button>
                        </div>
                    </aside>

                    {/* ── Content ── */}
                    <div className="flex-1 space-y-5">

                        {/* ════ PROFILE ════ */}
                        {tab === "profile" && (
                            <Card title="Profile Information" sub="Update your personal details">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    <Input label="First Name" value={profile.firstName} onChange={setP("firstName")} placeholder="Jane" />
                                    <Input label="Last Name"  value={profile.lastName}  onChange={setP("lastName")}  placeholder="Doe"  />
                                    <Input label="Email"      value={profile.email}     onChange={setP("email")}     placeholder="jane@example.com" type="email" />
                                    <Input label="Phone"      value={profile.phone}     onChange={setP("phone")}     placeholder="10-digit number"  type="tel"   />
                                </div>
                                <button
                                    onClick={() => success("Profile updated!")}
                                    className="px-6 py-2.5 bg-[#b11226] hover:bg-red-700 text-white text-sm font-bold tracking-widest rounded-xl transition"
                                >
                                    Save Changes
                                </button>
                            </Card>
                        )}

                        {/* ════ PASSWORD ════ */}
                        {tab === "password" && (
                            <Card title="Change Password" sub="Keep your account secure with a strong password">
                                <div className="space-y-4 max-w-sm">
                                    {/* Current */}
                                    <Input
                                        label="Current Password"
                                        value={pwd.current}
                                        onChange={setPW("current")}
                                        type={showPwd.current ? "text" : "password"}
                                        placeholder="Your current password"
                                        suffix={
                                            <button onClick={() => toggleShow("current")} className="text-white/25 hover:text-white/60 transition">
                                                {showPwd.current ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                                            </button>
                                        }
                                    />

                                    {/* New */}
                                    <Input
                                        label="New Password"
                                        value={pwd.next}
                                        onChange={setPW("next")}
                                        type={showPwd.next ? "text" : "password"}
                                        placeholder="Min. 6 characters"
                                        suffix={
                                            <button onClick={() => toggleShow("next")} className="text-white/25 hover:text-white/60 transition">
                                                {showPwd.next ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                                            </button>
                                        }
                                    />

                                    {/* Strength */}
                                    {pwd.next.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1 flex-1">
                                                {[1,2,3].map(i => (
                                                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwdStrength ? strengthColor[pwdStrength] : "bg-white/10"}`} />
                                                ))}
                                            </div>
                                            <span className={`text-xs font-semibold ${pwdStrength === 1 ? "text-red-400" : pwdStrength === 2 ? "text-amber-400" : "text-green-400"}`}>
                                                {strengthLabel[pwdStrength]}
                                            </span>
                                        </div>
                                    )}

                                    {/* Confirm */}
                                    <Input
                                        label="Confirm New Password"
                                        value={pwd.confirm}
                                        onChange={setPW("confirm")}
                                        type="password"
                                        placeholder="Repeat new password"
                                    />

                                    {pwdError && <p className="text-red-400 text-xs">{pwdError}</p>}

                                    <button
                                        onClick={changePassword}
                                        className="w-full py-3 bg-[#b11226] hover:bg-red-700 text-white text-sm font-bold tracking-widest rounded-xl transition mt-2"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </Card>
                        )}

                        {/* ════ ORDERS ════ */}
                        {tab === "orders" && (
                            <Card title="Order History" sub="Your recent purchases">
                                {orders.length === 0 ? (
                                    <div className="flex flex-col items-center py-12 text-center">
                                        <div className="w-12 h-12 rounded-full bg-[#b11226]/10 border border-[#b11226]/20 flex items-center justify-center mb-4">
                                            <FaBoxOpen size={18} className="text-[#b11226]/50" />
                                        </div>
                                        <p className="text-white/30 text-sm mb-4">No orders yet</p>
                                        <button
                                            onClick={() => navigate("/products")}
                                            className="text-xs text-[#b11226] hover:underline"
                                        >
                                            Start shopping →
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {orders.map(o => {
                                            const status = o.status || "pending";
                                            return (
                                                <div key={o.id} className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl px-5 py-4 hover:border-white/15 transition group">
                                                    <div>
                                                        <p className="text-sm font-semibold">Order #{o.id}</p>
                                                        <p className="text-xs text-white/30 mt-0.5">{o.date || "—"}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <p className="text-sm font-bold text-[#b11226]">₹ {Number(o.total).toFixed(2)}</p>
                                                        <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_STYLE[status] || STATUS_STYLE.pending}`}>
                                                            {status}
                                                        </span>
                                                        <button
                                                            onClick={() => navigate("/orders")}
                                                            className="text-white/20 group-hover:text-white/60 transition"
                                                        >
                                                            <FaChevronRight size={11} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <button
                                            onClick={() => navigate("/orders")}
                                            className="w-full py-2.5 border border-white/10 hover:bg-white/5 text-sm text-white/40 hover:text-white rounded-xl transition mt-2"
                                        >
                                            View all orders →
                                        </button>
                                    </div>
                                )}
                            </Card>
                        )}

                        {/* ════ ADDRESSES ════ */}
                        {tab === "addresses" && (
                            <>
                                <Card title="Saved Addresses" sub="Manage your delivery addresses">
                                    {addresses.length === 0 ? (
                                        <div className="flex flex-col items-center py-10 text-center">
                                            <FaMapMarkerAlt size={24} className="text-white/15 mb-3" />
                                            <p className="text-white/30 text-sm">No addresses saved yet</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {addresses.map(addr => (
                                                <div
                                                    key={addr.id}
                                                    className={`relative flex flex-col gap-2 p-4 rounded-xl border transition
                                                        ${addr.default
                                                        ? "bg-[#b11226]/8 border-[#b11226]/30"
                                                        : "bg-white/5 border-white/10 hover:border-white/20"}`}
                                                >
                                                    {/* Default badge */}
                                                    {addr.default && (
                                                        <span className="absolute top-3 right-3 text-[9px] uppercase tracking-widest font-bold bg-[#b11226]/20 text-[#b11226] border border-[#b11226]/30 px-2 py-0.5 rounded-full">
                                                            Default
                                                        </span>
                                                    )}

                                                    <p className="text-xs uppercase tracking-widest text-white/40 font-bold">{addr.label}</p>
                                                    <p className="text-sm font-semibold">{addr.name}</p>
                                                    <p className="text-xs text-white/50 leading-relaxed">
                                                        {addr.line1}<br />
                                                        {addr.city}, {addr.state} {addr.zip}<br />
                                                        {addr.country}
                                                    </p>

                                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/8">
                                                        <button
                                                            onClick={() => openAddrForm(addr)}
                                                            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition"
                                                        >
                                                            <FaEdit size={10} /> Edit
                                                        </button>
                                                        {!addr.default && (
                                                            <>
                                                                <span className="text-white/15">·</span>
                                                                <button
                                                                    onClick={() => setDefault(addr.id)}
                                                                    className="text-xs text-white/40 hover:text-white transition"
                                                                >
                                                                    Set default
                                                                </button>
                                                                <span className="text-white/15">·</span>
                                                                <button
                                                                    onClick={() => deleteAddr(addr.id)}
                                                                    className="flex items-center gap-1.5 text-xs text-red-400/50 hover:text-red-400 transition"
                                                                >
                                                                    <FaTrash size={9} /> Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => openAddrForm()}
                                        className="mt-5 flex items-center gap-2 px-5 py-2.5 border border-white/15 hover:bg-white/8 text-sm text-white rounded-xl transition"
                                    >
                                        <FaPlus size={11} /> Add New Address
                                    </button>
                                </Card>

                                {/* Address form */}
                                {addrForm !== null && (
                                    <Card
                                        title={addrForm === "new" ? "Add New Address" : "Edit Address"}
                                        sub="Fill in the delivery details"
                                    >
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                            <Input label="Label (e.g. Home)" value={addrData.label}   onChange={setAD("label")}   placeholder="Home" />
                                            <Input label="Full Name"          value={addrData.name}    onChange={setAD("name")}    placeholder="Jane Doe" />
                                            <div className="sm:col-span-2">
                                                <Input label="Address Line"   value={addrData.line1}   onChange={setAD("line1")}   placeholder="Street, building, flat" />
                                            </div>
                                            <Input label="City"               value={addrData.city}    onChange={setAD("city")}    placeholder="Philadelphia" />
                                            <Input label="State"              value={addrData.state}   onChange={setAD("state")}   placeholder="PA" />
                                            <Input label="ZIP / PIN"          value={addrData.zip}     onChange={setAD("zip")}     placeholder="19103" />
                                            <Input label="Country"            value={addrData.country} onChange={setAD("country")} placeholder="USA" />
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={saveAddr}
                                                className="px-6 py-2.5 bg-[#b11226] hover:bg-red-700 text-white text-sm font-bold tracking-widest rounded-xl transition"
                                            >
                                                Save Address
                                            </button>
                                            <button
                                                onClick={() => setAddrForm(null)}
                                                className="px-6 py-2.5 border border-white/15 hover:bg-white/8 text-white text-sm rounded-xl transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </Card>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}