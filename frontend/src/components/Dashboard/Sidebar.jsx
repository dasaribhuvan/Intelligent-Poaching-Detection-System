import {
  LayoutDashboard,
  UploadCloud,
  AlertTriangle,
  LogOut,
  ShieldCheck
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../../services/api";

const Sidebar = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const menu = [

    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },

    { name: "Upload Detection", path: "/upload", icon: UploadCloud },

    { name: "Alerts", path: "/alerts", icon: AlertTriangle }

  ];

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const res = await API.get("/auth/me");
        setUser(res.data);

      } catch (err) {

        console.log("Auth error");

      }

    };

    fetchUser();

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");
    navigate("/");

  };

  return (

    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 h-screen flex flex-col
      backdrop-blur-xl bg-gradient-to-b
      from-slate-900 via-slate-900 to-emerald-950
      border-r border-white/10 relative shadow-xl"
    >

      {/* Background glow */}

      <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/20 blur-[120px] rounded-full"></div>

      {/* Logo */}

      <div className="p-6 flex items-center gap-3 relative z-10">

        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className="bg-gradient-to-br from-emerald-400 to-green-600
          p-2 rounded-xl text-black shadow-lg"
        >

          <ShieldCheck size={22} />

        </motion.div>

        <span className="font-bold text-lg tracking-wide text-white">
          IPDS AI
        </span>

      </div>



      {/* Navigation */}

      <nav className="flex-1 px-3 space-y-2 mt-6 relative z-10">

        {menu.map((item) => {

          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (

            <Link key={item.name} to={item.path}>

              <motion.div
                whileHover={{ scale: 1.05, x: 6 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all relative
                ${
                  active
                    ? "bg-gradient-to-r from-emerald-500/30 to-green-400/20 text-emerald-300 border border-emerald-400/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >

                {/* Active Indicator */}

                {active && (

                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 h-full w-1 bg-emerald-400 rounded-r"
                  />

                )}

                <Icon size={18} />

                <span className="font-medium">

                  {item.name}

                </span>

              </motion.div>

            </Link>

          );

        })}

      </nav>



      {/* Bottom Section */}

      <div className="border-t border-white/10 p-4 relative z-10">

        {user && (

          <div className="mb-4 p-3 bg-white/5 backdrop-blur-xl
          rounded-xl border border-white/10">

            <p className="text-xs text-gray-400">
              Logged in as
            </p>

            <p className="font-semibold text-emerald-400">
              {user.full_name}
            </p>

          </div>

        )}



        {/* Logout */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3
          rounded-xl text-red-400 hover:bg-red-500/10
          transition font-semibold text-sm"
        >

          <LogOut size={18} />

          Logout

        </motion.button>

      </div>

    </motion.div>

  );

};

export default Sidebar;