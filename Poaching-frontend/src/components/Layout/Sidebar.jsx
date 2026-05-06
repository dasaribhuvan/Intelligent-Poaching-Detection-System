import {
  LayoutDashboard,
  UploadCloud,
  AlertTriangle,
  FileBarChart,
  Settings,
  LogOut,
  ShieldCheck
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = () => {

  const location = useLocation();

  const menuItems = [

    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },

    { name: "Upload Detection", icon: UploadCloud, path: "/upload" },

    { name: "Alerts", icon: AlertTriangle, path: "/alerts" },

    { name: "Reports", icon: FileBarChart, path: "/reports" },

    { name: "Settings", icon: Settings, path: "/settings" },

  ];

  return (

    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 h-screen flex flex-col relative backdrop-blur-xl
      bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950
      border-r border-white/10 shadow-xl"
    >

      {/* glowing gradient */}

      <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/20 blur-[120px] rounded-full"></div>


      {/* logo */}

      <div className="p-6 flex items-center gap-3 relative z-10">

        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className="bg-gradient-to-br from-emerald-400 to-green-600
          p-2 rounded-xl text-black shadow-lg"
        >

          <ShieldCheck size={24} />

        </motion.div>

        <span className="font-bold text-xl tracking-wide text-white">

          IPDS AI

        </span>

      </div>



      {/* navigation */}

      <nav className="flex-1 px-3 space-y-2 mt-6 relative z-10">

        {menuItems.map((item) => {

          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (

            <Link key={item.name} to={item.path}>

              <motion.div
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl relative transition-all
                ${
                  active
                    ? "bg-gradient-to-r from-emerald-500/30 to-green-400/20 text-emerald-300 border border-emerald-400/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >

                {/* active bar */}

                {active && (

                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-0 h-full w-1 bg-emerald-400 rounded-r"
                  />

                )}

                <Icon size={20} />

                <span className="font-medium">

                  {item.name}

                </span>

              </motion.div>

            </Link>

          );

        })}

      </nav>



      {/* logout */}

      <div className="p-4 border-t border-white/10 relative z-10">

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >

          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3
            text-red-400 hover:bg-red-500/10 rounded-xl transition"
          >

            <LogOut size={20} />

            Logout

          </Link>

        </motion.div>

      </div>

    </motion.aside>

  );

};

export default Sidebar;