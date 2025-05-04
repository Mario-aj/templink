import { z } from "zod";
import { useLayoutEffect, useState } from "react";

import Connection from "@/components/connection";
import { UsernameForm } from "@/components/username-form";
import { USERNAME_STORAGE_KEY, usernameFormSchema } from "@/lib/utils";

export default function HomePage() {
  const [username, setUsername] = useState("");

  const handleSubmit = async (values: z.infer<typeof usernameFormSchema>) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(USERNAME_STORAGE_KEY, values.username);
    }

    setUsername(values.username);
  };

  useLayoutEffect(() => {
    if (typeof localStorage !== "undefined") {
      const storedUsername = localStorage.getItem(USERNAME_STORAGE_KEY);
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-900 font-sans">
      <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg flex items-center justify-center">
            <div className="absolute w-1.5 h-4 bg-white rotate-45 top-2 left-2 rounded-sm"></div>
            <div className="absolute w-1.5 h-4 bg-white -rotate-45 bottom-2 right-2 rounded-sm"></div>
            <div className="absolute bottom-[-6px] left-[12px] w-3 h-3 bg-gradient-to-br from-blue-500 to-violet-500 rotate-45 shadow-md"></div>
          </div>

          <h1 className="text-2xl font-semibold">
            Temp<span className="text-violet-600">Link</span>
          </h1>
        </div>
      </header>

      <section className="flex flex-col items-center justify-center text-center px-6 py-6 sm:py-12 md:py-16">
        <h2 className="text-4xl font-bold mb-4">
          One Link. One Room. Then Gone.
        </h2>

        <p className="text-lg text-gray-600 max-w-xl">
          TempLink lets you connect in real-time through secure, peer-to-peer
          messaging. No sign-ups. No traces. Just ephemeral conversations.
        </p>
      </section>

      <div className="flex align-center justify-center shadow-lg w-[fit-content] m-auto p-4 rounded-lg inset-shadow-xs">
        {username ? (
          <Connection username={username} />
        ) : (
          <UsernameForm onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}
