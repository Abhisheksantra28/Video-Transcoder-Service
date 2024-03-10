import Sidebar from "@/components/Sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen relative ">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
        <Sidebar />
      </div>
      {/* <main className="md:pl-72 ">{children}</main> */}
     <div className="md:pl-72 h-full bg-[#f3f4f6]">{children}</div>
    </div>
  );
};

export default DashboardLayout;
