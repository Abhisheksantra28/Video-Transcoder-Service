"use client";

import { cn } from "@/lib/utils";
import {
  Code,
  FileVideoIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  Settings,
  UploadCloudIcon,
  User,
  VideoIcon,
} from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { number } from "zod";


const monsterrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const routes = [

  {
    label: "Upload",
    icon: UploadCloudIcon,
    href: "/upload",
    color: "text-blue-500",
  },

  {
    label: "Assets",
    icon: FileVideoIcon,
    href: "/assets",
    color: "text-violet-500",
  },


  {
    label: "User",
    icon: User,
    href: "/user",
    color: "text-sky-500",
  },

  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];


const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="space-y-4 py-4 flex flex-col  h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1 ">
        <Link href="/" className="flex items-center pl-3 mb-14 ">
          {/* <div className="relative w-8 h-8 mr-4">
            <Image fill alt="logo" src="/logo.png" />
          </div> */}
          <h1 className={cn(`text-2xl ml-4 font-bold`, monsterrat.className)}>
            Transcoder
          </h1>
        </Link>

        <div className="space-y-1 flex flex-col">
          {routes.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                `text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition`,
                pathname === item.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <item.icon className={cn("h-5 w-5 mr-3", item.color)} />
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
