import { Search, Bell, User, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const TopNavbar = () => {

  return (

    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-16 flex items-center justify-between px-8
      backdrop-blur-xl bg-white/5 border-b border-white/10"
    >

      {/* search */}

      <div className="flex-1 max-w-xl">

        <div className="relative">

          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search zones, camera IDs, alerts..."
            className="w-full bg-black/40 border border-white/10 rounded-full
            py-2 pl-10 pr-4 text-sm text-white
            focus:outline-none focus:ring-2 focus:ring-emerald-400
            transition"
          />

        </div>

      </div>



      {/* right section */}

      <div className="flex items-center gap-6">

        <div className="hidden md:flex items-center gap-2 text-emerald-400">

          <MapPin size={16} />

          <span className="text-xs font-bold tracking-widest uppercase">

            Northern Reserve

          </span>

        </div>



        {/* notification */}

        <motion.button
          whileHover={{ scale: 1.1 }}
          className="relative text-gray-400 hover:text-white"
        >

          <Bell size={20} />

          <span className="absolute -top-1 -right-1 bg-red-500
          w-2 h-2 rounded-full"></span>

        </motion.button>



        {/* profile */}

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">

          <div className="text-right hidden sm:block">

            <p className="text-xs font-bold">

              Officer Ashik

            </p>

            <p className="text-[10px] text-emerald-400">

              RNGR-2026

            </p>

          </div>

          <div className="w-10 h-10 rounded-full
          bg-white/10 flex items-center justify-center">

            <User size={20} />

          </div>

        </div>

      </div>

    </motion.header>

  );

};

export default TopNavbar;