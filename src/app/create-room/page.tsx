"use client";

import { socket } from "@/socket";
import { CreateRoomResponse } from "@/socket/handlers/createRoom";
import { NICKNAME_STORAGE_KEY } from "@/utils/constants";
import { Copy, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import webRTC from "@/webrtc";
import { GetRoomResponse } from "@/socket/handlers/getRoom";

export default function CreateRoomPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [joining, setJoining] = useState(false);

  const [roomId, setRoomId] = useState("");
  const [nickname, setNickname] = useState("");

  const setupPeerConnection = useCallback(() => {
    webRTC.dataChannel!.onopen = () => {
      console.log("Data channel is open");
    };

    webRTC.dataChannel!.onclose = () => {
      console.log("Data channel is closed");
    };

    webRTC.dataChannel!.onmessage = (event) => {
      console.log("Message from data channel:", event.data);
    };
  }, []);

  const handleCreateRoom = useCallback(async () => {
    if (!webRTC.peerConnection) {
      alert(
        "Peer connection is not established, please try again. If the issue persists, please refresh the page."
      );
      return;
    }

    setCreating(true);

    const offer = await webRTC.peerConnection.createOffer();
    await webRTC.peerConnection.setLocalDescription(offer);

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
  }, [nickname]);

  const handleJoinRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setJoining(true);

    const form = new FormData(event.currentTarget);
    const roomCode = form.get("roomCode")?.toString().trim() as string;

    if (!roomCode) {
      alert("Please enter a room code");
      setJoining(false);
      return;
    }

    socket.emit("get-room", { roomId: roomCode });

    socket.on("get-room-response", (response: GetRoomResponse) => {
      if (response.error) {
        alert(response.error);
        return;
      }

      const { offer } = response.data!;

      webRTC.peerConnection!.setRemoteDescription(offer);

      webRTC
        .peerConnection!.createAnswer()
        .then((answer) => {
          webRTC.peerConnection!.setLocalDescription(answer);
          socket.emit("send-answer", {
            roomId: roomCode,
            answer,
            nickname,
          });
        })
        .catch((error) => {
          alert("Error creating answer:" + JSON.stringify(error, null, 2));
          setJoining(false);
        })
        .finally(() => {
          router.replace(`/room/${roomCode}`);
        });
    });
  };

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
    if (nickname && webRTC.peerConnection) {
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
            className="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-violet-600 text-white py-3 rounded-lg font-semibold disabled:cursor-not-allowed shadow hover:scale-105 transition-transform disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Room Code"}
          </button>

          {roomId && (
            <div className="bg-green-100 p-4 rounded-lg border border-green-300 text-center">
              <p className="font-medium text-green-800 mb-2">
                Copy and share this room code with your friend, once him/her
                join the room, you will be redirected to the room to start
                chatting.
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
                  className="bg-blue-500 text-white py-2 px-4 cursor-copy disabled:bg-gray-400 disabled:cursor-all-scroll rounded-lg text-sm font-semibold hover:bg-blue-600"
                >
                  <Copy className="inline" size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {!roomId && (
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Join Room</h2>
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <input
                type="text"
                required
                name="roomCode"
                disabled={!isConnected || joining}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter Room Code"
              />
              <button
                disabled={!isConnected || joining}
                type="submit"
                className="w-full cursor-pointer disabled:cursor-all-scroll bg-gray-800 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
              >
                Join Room
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
