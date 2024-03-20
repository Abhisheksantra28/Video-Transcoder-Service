"use client";
import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import useAuthStore from "@/zustand/authStore";

const Header = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="w-full">
      <header className="flex h-16 items-center justify-between  border-b border-gray-200 px-4 md:px-6 dark:border-gray-800">
        <Link className="text-[1.6rem] font-bold" href="/">
          Transcoder
        </Link>

        <div className="flex gap-4">
          <Button
            className="text-lg hover:bg-gray-800 hover:text-white transition-all duration-300"
            variant="secondary"
            onClick={() => router.push("/signin")}
          >
            {isAuthenticated?"Sign out":"SignIn"}
          </Button>

          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </header>
    </div>
  );
};

export default Header;
