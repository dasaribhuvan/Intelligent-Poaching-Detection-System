import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import API from "../services/api";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        full_name: name,
        email: email,
        password: password,
      });

      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.detail || "Registration failed");
      } else {
        toast.error("Server not reachable. Check backend.");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 overflow-hidden">

      {/* Background glow */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-emerald-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-green-400/20 blur-[120px] rounded-full"></div>

      {/* Forest Image */}
      <img
        src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        alt="forest"
      />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
      >

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-4 rounded-full bg-emerald-500/20 text-emerald-400 mb-4">
            <UserPlus size={36} />
          </div>

          <h2 className="text-3xl font-bold text-white tracking-tight">
            Officer Registration
          </h2>

          <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest">
            Secure Surveillance Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-emerald-400 uppercase block mb-1">
              Full Name
            </label>

            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={18} />

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Officer Name"
                className="w-full bg-black/30 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-emerald-400 uppercase block mb-1">
              Officer Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={18} />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@forest.gov"
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

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            className="w-full bg-emerald-400 hover:bg-emerald-300 text-black font-bold py-3 rounded-lg transition-all"
          >
            REQUEST ACCESS
          </motion.button>

        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-emerald-400 font-bold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
};

export default Signup;