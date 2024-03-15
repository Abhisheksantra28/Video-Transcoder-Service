import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen relative w-full overflow-hidden ">
      <Header />
      <main className="flex-1 flex">
        <Sidebar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
