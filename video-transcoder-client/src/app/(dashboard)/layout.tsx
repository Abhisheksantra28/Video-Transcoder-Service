"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {
  RootState,
  userExist,
  userNotExist,
} from "@/redux/reducer/userReducer";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(
        `https://ecezbkpsc5.execute-api.ap-south-1.amazonaws.com/api/v1/user/current-user`,
        {
          withCredentials: true,
        }
      )
      .then((res) => dispatch(userExist(res.data.data)))
      .catch((err) => dispatch(userNotExist()));
  }, [dispatch]);

  const { user } = useSelector((state: RootState) => state.userReducer);

  return (
    <div className="flex flex-col h-screen relative w-full overflow-hidden ">
      <Header user={user} />

      <main className="flex-1 flex">
        <Sidebar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
