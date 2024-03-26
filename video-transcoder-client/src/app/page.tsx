"use client";
import { Button } from "@/components/ui/button";
import { RootState, userExist, userNotExist } from "@/redux/reducer/userReducer";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const page = () => {
  const router = useRouter();
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
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.userReducer
  );

  return (
    <div className="h-screen flex items-center justify-center">
      {isAuthenticated ? (
        <Button onClick={() => router.push("/upload")}>Get started</Button>
      ) : (
        <Button onClick={() => router.push("/signin")}>Get started</Button>
      )}
    </div>
  );
};

export default page;
