"use client";

import { socket } from "@/socket";
import { CreateRoomResponse } from "@/socket/handlers/createRoom";
import { NICKNAME_STORAGE_KEY } from "@/utils/constants";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export default function CreateRoomPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  const [roomId, setRoomId] = useState("");
  const [nickname, setNickname] = useState("");

  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  const setupPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection();
    const dc = pc.createDataChannel("templink-chat-channel");

    setDataChannel(dc);
    setPeerConnection(pc);

    dc.onopen = () => {
      console.log("Data channel is open");
    };

    dc.onclose = () => {
      console.log("Data channel is closed");
    };

    dc.onmessage = (event) => {
      console.log("Message from data channel:", event.data);
    };
  }, []);

  // create the webRTC peer connection offer
  const handleCreateRoom = useCallback(async () => {
    if (!peerConnection) {
      alert(
        "Peer connection is not established, please try again. If the issue persists, please refresh the page."
      );
      return;
    }

    setCreating(true);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log("Creating room with offer:", offer);

    socket.emit("create-room", {
      offer,
      nickname,
    });

    socket.on("room-created", (response: CreateRoomResponse) => {
      if (response.error) {
        alert(response.error);
        setCreating(false);
        return;
      }

      setRoomId(response.data!.roomId);
      setCreating(false);
      console.log("Room created with ID:", response.data!.roomId);
    });
  }, [peerConnection, nickname]);

  const handleJoinRoom = useCallback(() => {}, []);

  const handleCopy = useCallback(() => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [roomId]);

  useLayoutEffect(() => {
    if (typeof localStorage !== "undefined") {
      const nickname = localStorage.getItem(NICKNAME_STORAGE_KEY);

      if (!nickname) {
        localStorage.removeItem(NICKNAME_STORAGE_KEY);

        router.replace("/");
        return;
      }

      setNickname(nickname);
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (nickname) {
      if (socket.connected) {
        onConnect();
      }

      function onConnect() {
        setIsConnected(true);
        setupPeerConnection();
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
    }
  }, [nickname, setupPeerConnection]);

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
            disabled={!isConnected || creating || !!roomId}
            className="w-full bg-gradient-to-r from-blue-500 to-violet-600 text-white py-3 rounded-lg font-semibold disabled:cursor-not-allowed shadow hover:scale-105 transition-transform disabled:opacity-50"
          >
            {creating ? "Creating..." : "Generate Room Code"}
          </button>

          {roomId && (
            <div className="bg-green-100 p-4 rounded-lg border border-green-300 text-center">
              <p className="text-lg font-medium text-green-800 mb-2">
                Room Code:
              </p>
              <div className="flex items-center justify-between space-x-2">
                <input
                  type="text"
                  value={roomId}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none bg-white text-gray-700"
                />
                <button
                  disabled={copied}
                  title={copied ? "Room code copied to clipboard" : ""}
                  onClick={handleCopy}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-600"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}
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
