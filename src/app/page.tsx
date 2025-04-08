"use client";

import { Loader } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NICKNAME_STORAGE_KEY } from "@/utils/constants";

export default function HomePage() {
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (!nickname.trim()) {
      setError("Please enter a nickname");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/create/nickname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });

      const data = await response.json();

      if (response.ok) {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(NICKNAME_STORAGE_KEY, nickname);
        }

        router.replace(`/create-room?nickname=${nickname}`);
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset>
            <label htmlFor="nickname" className="inline-block mb-2">
              Nickname
            </label>

            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                error ? "border-red-500" : ""
              }`}
              placeholder="Your nickname"
            />
          </fieldset>

          {error ? (
            <p className="text-red-500 text-sm -mt-4">{error}</p>
          ) : (
            <p className="text-gray-500 text-sm -mt-4">
              This will be your display name for the duration of the chat.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white py-3 rounded-lg font-semibold shadow cursor-pointer hover:shadow-lg transition duration-300 ease-in-out disabled:bg-gradient-to-r disabled:from-gray-200 disabled:to-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading && (
              <Loader
                className="inline-block animate-spin"
                size={22}
                color="white"
              />
            )}{" "}
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
