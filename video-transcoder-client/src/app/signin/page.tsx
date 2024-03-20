"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
// import useAuthStore from "@/zustand/authStore";

const SignUpPage = () => {
  const router = useRouter();
  // const authStore = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      window.open(
        "https://ecezbkpsc5.execute-api.ap-south-1.amazonaws.com/api/v1/user/login",
        "_self"
      );

    
      toast({ title: "login successful!" });

      // router.push("/upload");
    } catch (error: any) {
      console.error("Login failed", error);
      setError("Login failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-lg p-6">
        <CardHeader className="flex flex-col items-center space-y-2">
          <h2 className="text-lg font-bold tracking-tighter">
            Login with Google
          </h2>
          <div>Click below to login with your Google account</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
