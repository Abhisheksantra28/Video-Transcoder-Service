"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { RootState } from "@/redux/reducer/userReducer";
import React from "react";
import { useSelector } from "react-redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loader } = useSelector(
    (state: RootState) => state.userReducer
  );
  let isLoggedIn = false;
  if (user != null) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }
  return (
    <div className="flex flex-col h-screen relative w-full overflow-hidden ">
      <Header isLoggedIn={isLoggedIn} loader={loader} />
   
      <main className="flex-1 flex">
        <Sidebar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
