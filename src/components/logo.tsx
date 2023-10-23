"use client";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Montserrat({ weight: "600", subsets: ["latin"] });

const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <div className="relative mr-4">
        <ClipboardList className="text-2xl" />
      </div>
      <h1 className={cn("text-2xl font-bold text-white", font.className)}>
        TMA
      </h1>
    </Link>
  );
};

export default Logo;
