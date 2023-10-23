"use client";
import { Button } from "@/components/ui/button";
import Logo from "../logo";
import { Separator } from "../ui/separator";
import { signIn, signOut } from "next-auth/react";

export const MainNavbar = async ({ currentUser }: any) => {
  return (
    <nav className="p-4 bg-transparent flex items-center justify-between text-white">
      <Logo />
      <div className="flex items-center gap-x-2">
        {currentUser !== null ? (
          <>
            Welcome {currentUser.username}
            <Separator orientation="vertical" />
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => signIn()}
          >
            Get Started
          </Button>
        )}
      </div>
    </nav>
  );
};
