"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export const MainHero = ({currentUser} : any) => {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-white font-bold py-36 text-center space-y-5 mx-4">
        <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold pb-4">
          <h1>Task Management App</h1>
        </div>
        <div className="text-xl font-light text-zinc-400 text-center max-w-3xl pb-8">
          Boost productivity with our Task Management App. Effortlessly create,
          track, and organize tasks. Stay in control, meet deadlines, and
          collaborate seamlessly.
        </div>
        <div>
          {currentUser ? (
            <Button
              variant="secondary"
              className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
              onClick={() => router.push("/dashboard")}
            >
              Start Generating
            </Button>
          ) : (
            <Button
              variant="secondary"
              className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
              onClick={() => signIn()}
            >
              Get Started
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
