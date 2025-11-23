import Sidebar from "./sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#1F1F1F]">
      <Sidebar />

      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
