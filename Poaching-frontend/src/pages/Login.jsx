import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import API from "../services/api";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email: officerId,
        password: password,
      });

      localStorage.setItem("token", response.data.access_token);

      toast.success("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid Credentials ❌");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 overflow-hidden">

      {/* Glow background */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-emerald-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-green-400/20 blur-[120px] rounded-full"></div>

      {/* Forest background */}
      <img
        src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        alt="forest"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
      >

        {/* Header */}
        <div className="text-center mb-8">

          <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
            <ShieldCheck size={36} />
          </div>

          <h2 className="text-3xl font-bold text-white tracking-tight">
            IPDS Secure Portal
          </h2>

          <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest">
            Forest Officer Authentication
          </p>

        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-emerald-400 uppercase block mb-1">
              Officer Email
            </label>

            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={18} />

              <input
                type="email"
                required
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="officer@email.com"
                className="w-full bg-black/30 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-emerald-400 uppercase block mb-1">
              Security Key
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/30 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="w-full bg-emerald-400 hover:bg-emerald-300 text-black font-bold py-3 rounded-lg shadow-lg shadow-emerald-500/20 transition-all"
          >
            ACCESS COMMAND CENTER
          </motion.button>

        </form>

        {/* Signup Link */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">

          <p className="text-gray-400 text-sm">
            New to the system?{" "}
            <Link
              to="/signup"
              className="text-emerald-400 font-bold hover:underline"
            >
              Register for first time
            </Link>
          </p>

        </div>

      </motion.div>

    </div>
  );
};

export default Login;