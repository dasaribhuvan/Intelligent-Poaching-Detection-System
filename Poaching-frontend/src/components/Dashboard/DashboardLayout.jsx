import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#0B1F1A] text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {children}
      </div>

    </div>
  );
};

export default DashboardLayout;