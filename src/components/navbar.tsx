"use client";
import { signOut } from "next-auth/react";
import Logo from "./logo";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { Button } from "./ui/button";
import MainNav from "./mainNav";

const Navbar = ({ currentUser }: any) => {
  return (
    <nav className="border-b bg-slate-900 text-white">
      <div className="flex items-center h-16 px-4">
        <div>
          <Logo />
        </div>
        <Separator orientation="vertical" className="mx-4" />
        <MainNav />
        <div className="flex items-center ml-auto space-x-4">
          {currentUser !== null ? (
            <p>Welcome {currentUser.username}</p>
          ) : (
            <Link href="/login">Login</Link>
          )}

          <Button variant="secondary" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
