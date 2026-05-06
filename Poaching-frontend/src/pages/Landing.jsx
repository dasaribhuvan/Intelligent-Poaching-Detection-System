import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Eye, Bell, BarChart3, ChevronRight, Play, Globe, Mail, X } from "lucide-react";
import { motion } from "framer-motion";
import poachingVideo from "../assets/Poaching video.mp4";

const Landing = () => {

  const detectionSlides = [
    {
      url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46",
      label: "98.2% Elephant Detected",
      color: "border-emerald-500",
      bg: "bg-emerald-500"
    },
    {
      url: "https://images.unsplash.com/photo-1543946207-39bd91e70ca7",
      label: "96.8% Deer Detected",
      color: "border-emerald-500",
      bg: "bg-emerald-500"
    },
    {
      url: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56",
      label: "87.4% Lion Detected",
      color: "border-emerald-500",
      bg: "bg-emerald-500"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % detectionSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white min-h-screen font-sans"
    >

      {/* VIDEO MODAL */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsVideoOpen(false)}
          ></div>

          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-500 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            <video controls autoPlay muted className="w-full h-full object-cover">
              <source src={poachingVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="sticky top-4 z-50 flex justify-between items-center p-6 max-w-7xl mx-auto backdrop-blur-lg bg-black/30 border border-white/10 rounded-xl">

        <div className="flex items-center gap-2">
          <Shield className="text-emerald-400" size={32} />
          <span className="text-2xl font-bold tracking-tighter">IPDS</span>
        </div>

        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-6 py-2 rounded-full bg-emerald-400 text-black font-bold hover:bg-emerald-300 transition-all"
          >
            Signup
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center text-center px-4 overflow-hidden">

        {/* Glow blobs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/20 blur-[150px] rounded-full"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-green-400/20 blur-[150px] rounded-full"></div>

        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070"
            className="w-full h-full object-cover opacity-30"
            alt="forest"
          />
        </div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            The Future of <span className="text-emerald-400">Wildlife Protection</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            AI powered surveillance detecting poachers and threats in real time
            protecting endangered wildlife across forest regions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link
              to="/signup"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-400 text-black font-bold rounded-xl text-lg hover:scale-105 active:scale-95 transition-all"
            >
              Get Started <ChevronRight size={20} />
            </Link>

            <button
              onClick={() => setIsVideoOpen(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-lg hover:bg-white/10 transition-all"
            >
              <Play size={20} fill="currentColor" /> Watch Demo
            </button>

          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-24 max-w-7xl mx-auto px-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {[
            {
              icon: <Eye />,
              title: "Live Monitoring",
              desc: "Computer vision detects unauthorized movement instantly."
            },
            {
              icon: <Bell />,
              title: "Instant Alerts",
              desc: "Notifications sent to patrol teams in real time."
            },
            {
              icon: <BarChart3 />,
              title: "Deep Analytics",
              desc: "Detailed insights on wildlife activity and threats."
            }
          ].map((feature, i) => (

            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="group p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-emerald-400/40 transition-all"
            >

              <div className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>

              <p className="text-gray-400">{feature.desc}</p>

            </motion.div>

          ))}

        </div>
      </motion.section>

      {/* AI PREVIEW */}
      <section className="py-20 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Detection Feed */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-80">

            {detectionSlides.map((slide, index) => (

              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >

                <img
                  src={slide.url}
                  alt=""
                  className="w-full h-full object-cover opacity-60"
                />

                <div
                  className={`absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 ${slide.color} rounded animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.7)]`}
                >
                  <span
                    className={`absolute -top-6 left-0 ${slide.bg} text-black text-[10px] font-bold px-2 py-0.5 rounded`}
                  >
                    {slide.label}
                  </span>
                </div>

              </div>

            ))}

          </div>

          {/* Alerts */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-3">

            {[
              "Human Detected - Sector B",
              "Vehicle Spotted - Sector A",
              "Weapon Identified - Sector D",
              "Poacher detected - Sector C"
            ].map((alert, idx) => (

              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10"
              >
                <span className="text-xs font-bold">{alert}</span>
                <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.9)]"></span>
              </div>

            ))}

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black/40 border-t border-white/10 pt-16 pb-8 px-6">

        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-emerald-400" size={24} />
              <span className="text-xl font-bold">IPDS</span>
            </div>

            <p className="text-gray-500 text-sm">
              AI powered monitoring platform designed to prevent wildlife
              poaching and protect endangered animals.
            </p>
          </div>

          <div>
            <h4 className="text-emerald-400 mb-4 font-bold">Resources</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/login">Officer Portal</Link></li>
              <li><Link to="/signup">Registration</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-emerald-400 mb-4 font-bold">Security</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Privacy Policy</li>
              <li>Data Encryption</li>
            </ul>
          </div>

          <div>
            <h4 className="text-emerald-400 mb-4 font-bold">Contact</h4>
            <div className="text-gray-400 text-sm space-y-2">
              <p className="flex items-center gap-2">
                <Mail size={16} /> support@forestai.gov
              </p>
              <p className="flex items-center gap-2">
                <Globe size={16} /> Central Command, India
              </p>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 text-xs text-gray-600 text-center">
          © 2026 IPDS Intelligent Poaching Detection System
        </div>

      </footer>

    </motion.div>
  );
};

export default Landing;