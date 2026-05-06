import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const MainLayout = ({ children }) => {

  return (

    <div className="flex h-screen text-slate-100 overflow-hidden
    bg-gradient-to-br from-slate-950 via-emerald-950 to-black relative">

      {/* glow background */}

      <div className="absolute -top-40 -left-40 w-[400px] h-[400px]
      bg-emerald-500/20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px]
      bg-green-400/20 blur-[120px] rounded-full"></div>



      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">

        <TopNavbar />

        <main className="flex-1 overflow-hidden p-6">

          {children}

        </main>

      </div>

    </div>

  );

};

export default MainLayout;