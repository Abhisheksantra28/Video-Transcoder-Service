import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { useDispatch} from "react-redux";
import { userNotExist } from "@/redux/reducer/userReducer";

interface HeaderProps {
  isLoggedIn: boolean;
  loader: boolean;
}

const Header = ({ isLoggedIn, loader }: HeaderProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      const { data } = await axios.get(
        "https://ecezbkpsc5.execute-api.ap-south-1.amazonaws.com/api/v1/user/logout",
        { withCredentials: true }
      );
      dispatch(userNotExist());
      toast({ title: data.message });
    } catch (error) {
      // Handle error
      console.error("Error occurred during sign out:", error);
      // Optionally, show error message to the user
    }
  };

  return (
    <div className="w-full">
      <header className="flex h-16 items-center justify-between  border-b border-gray-200 px-4 md:px-6 dark:border-gray-800">
        <Link className="text-[1.6rem] font-bold" href="/">
          Transcoder
        </Link>

        <div className="flex gap-4">
     
          {isLoggedIn ? (
            <Button
              className="text-lg hover:bg-gray-800 hover:text-white transition-all duration-300"
              variant="secondary"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          ) : (
            <Button
              className="text-lg hover:bg-gray-800 hover:text-white transition-all duration-300"
              variant="secondary"
              onClick={() => router.push("/signin")}
            >
              Sign In
            </Button>
          )}

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
