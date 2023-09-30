import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  // To check if user is signed in - auth is a utility class
  const isAuth = !!userId;
  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Div to center all the content */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
            <UserButton afterSignOutUrl="/"></UserButton>
          </div>

          <div className="flex mt-2">
            {/* conditionally rendering the buuton,only when the user is signed in */}
            {isAuth && <Button>Go to Chats</Button>}
          </div>

          <p className="text-lg mt-1 max-w-xl text-slate-800">
            Join thousands of students, researchers and professionals to
            instantly answer questions and understand research with AI
          </p>

          <div className="w-full mt-4">
            {isAuth ? (
              <h1>fileupload</h1>
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started
                  <LogIn className="w-4 h-4 ml-2"></LogIn>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
