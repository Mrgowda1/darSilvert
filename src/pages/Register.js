import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaUser, FaCheckCircle } from "react-icons/fa";

export default function Register() {
    const [username, setUsername]   = useState("");
    const [password, setPassword]   = useState("");
    const [confirm, setConfirm]     = useState("");
    const [showPwd, setShowPwd]     = useState(false);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState("");
    const [success, setSuccess]     = useState(false);
    const navigate                  = useNavigate();

    const pwdStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const strengthLabel = ["", "Weak", "Good", "Strong"];
    const strengthColor = ["", "bg-red-500", "bg-amber-400", "bg-green-500"];

    const register = async () => {
        if (!username || !password || !confirm) { setError("Please fill in all fields."); return; }
        if (password !== confirm) { setError("Passwords do not match."); return; }
        if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
        setLoading(true); setError("");
        try {
            const res = await axios.post("http://localhost:5000/register", { username, password });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch {
            setError("Registration failed. Username may already be taken.");
        } finally {
            setLoading(false);
        }
    };

    if (success) return (
        <div className="bg-[#060f1e] min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle size={26} className="text-green-400" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">Account Created!</h2>
                <p className="text-white/40 text-sm">Redirecting you to sign in...</p>
            </div>
        </div>
    );

    return (
        <div className="relative bg-[#060f1e] min-h-screen flex items-center justify-center px-4">

            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#b11226]/12 blur-[140px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/">
                        <img
                            src="https://my.juliussilvert.com/media/logo/websites/1/Resized_Silvert-White_with_1915_.png"
                            className="h-8 mx-auto mb-6 object-contain"
                            alt="Julius Silvert"
                        />
                    </Link>
                    <h1 className="text-2xl font-black text-white tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                        Create an account
                    </h1>
                    <p className="text-white/40 text-sm mt-2">Join thousands of food professionals</p>
                </div>

                {/* Card */}
                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#b11226] to-transparent rounded-full" />

                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Username */}
                    <div className="mb-4">
                        <label className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-1.5">Username</label>
                        <div className="relative">
                            <FaUser size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                            <input
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/12 focus:border-[#b11226]/60 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(177,18,38,0.15)]"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-2">
                        <label className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-1.5">Password</label>
                        <div className="relative">
                            <FaLock size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                            <input
                                type={showPwd ? "text" : "password"}
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/12 focus:border-[#b11226]/60 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:bg-white/8 focus:shadow-[0_0_0_3px_rgba(177,18,38,0.15)]"
                            />
                            <button
                                onClick={() => setShowPwd(s => !s)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition"
                            >
                                {showPwd ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                            </button>
                        </div>
                    </div>

                    {/* Password strength */}
                    {password.length > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex gap-1 flex-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwdStrength ? strengthColor[pwdStrength] : "bg-white/10"}`} />
                                ))}
                            </div>
                            <span className={`text-xs font-semibold ${pwdStrength === 1 ? "text-red-400" : pwdStrength === 2 ? "text-amber-400" : "text-green-400"}`}>
                                {strengthLabel[pwdStrength]}
                            </span>
                        </div>
                    )}

                    {/* Confirm password */}
                    <div className="mb-6">
                        <label className="block text-xs uppercase tracking-widest text-white/40 font-semibold mb-1.5">Confirm Password</label>
                        <div className="relative">
                            <FaLock size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                            <input
                                type="password"
                                placeholder="Repeat your password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && register()}
                                className={`w-full bg-white/5 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:bg-white/8
                                    ${confirm && confirm !== password ? "border-red-500/50 focus:border-red-500/70" : "border-white/12 focus:border-[#b11226]/60 focus:shadow-[0_0_0_3px_rgba(177,18,38,0.15)]"}`}
                            />
                        </div>
                        {confirm && confirm !== password && (
                            <p className="text-xs text-red-400 mt-1.5">Passwords do not match</p>
                        )}
                    </div>

                    <button
                        onClick={register}
                        disabled={loading}
                        className="w-full py-3.5 bg-[#b11226] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-widest rounded-xl transition shadow-[0_4px_20px_rgba(177,18,38,0.35)]"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>

                    <p className="text-center text-sm text-white/30 mt-5">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#b11226] hover:text-red-400 font-semibold transition">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}