"use client";

import { socket } from "@/socket";
import { NICKNAME_STORAGE_KEY } from "@/utils/constants";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

export default function CreateRoomPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isConnected, setIsConnected] = useState(false);

  const [loading, setLoading] = useState(true);

  const [roomId, setRoomId] = useState("");
  const [creating, setCreating] = useState(false);
  const [nickname] = useState(searchParams.get("nickname") || "");

  const handleCreateRoom = async () => {
    setCreating(true);

    try {
      const response = await fetch("/api/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: searchParams.get("nickname") }),
      });

      const data = await response.json();

      if (data.roomId) {
        router.push(
          `/chat/${data.roomId}?nickname=${encodeURIComponent(nickname)}`
        );
      }
    } catch (err) {
      console.error("Error creating room:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) return;

    router.push(`/chat/${roomId}?nickname=${encodeURIComponent(nickname)}`);
  };

  // TODO: We should control the nickname from the server and compare it with the one in the localStorage and in URL
  useLayoutEffect(() => {
    if (typeof localStorage !== "undefined") {
      const localNickname = localStorage.getItem(NICKNAME_STORAGE_KEY);

      if (nickname !== localNickname) {
        localStorage.removeItem(NICKNAME_STORAGE_KEY);

        router.replace("/");
        return;
      }

      setLoading(false);
    }
  }, [nickname, router]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={54} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8 space-y-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Create or Join a Room
        </h1>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Create Room</h2>
          <button
            title={!isConnected ? "Connecting to socket server" : ""}
            onClick={handleCreateRoom}
            disabled={!isConnected || creating}
            className="w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white py-3 rounded-lg font-semibold disabled:cursor-not-allowed shadow hover:scale-105 transition-transform disabled:opacity-50"
          >
            {creating ? "Creating..." : "Generate Room Code"}
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Join Room</h2>
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter Room Code"
            />
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
