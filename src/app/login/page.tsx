"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Login from "../../components/auth/Login";

export default function LoginPage() {
  const { data: session } = useSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col xl:flex-row h-screen">
      <div className="flex-1 h-1/3 xl:h-auto">
        <div className="relative w-full h-full bg-[#161B24]"></div>
      </div>
      <div className="xl:w-[35%] h-2/3 xl:h-auto flex flex-col justify-center items-center p-8 bg-grey-90">
        <div className="w-full max-w-md">
          <div className="text-center mb-8"></div>
          <Login />
        </div>
      </div>
    </div>
  );
}
