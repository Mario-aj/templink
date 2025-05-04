import { Copy, Loader } from "lucide-react";
import { useNavigate } from "react-router";
import { Fragment, useCallback } from "react";

import { Button } from "./ui/button";
import usePeer from "@/hooks/usePeer";

interface ConnectionProps {
  username: string;
}

export default function Connection({ username }: ConnectionProps) {
  const navigate = useNavigate();

  const { connectToOtherPeer, userId, peer } = usePeer();

  const handleCopy = useCallback((id: string) => {
    navigator.clipboard.writeText(id);

    alert("Connection string copied to clipboard");
  }, []);

  const handleConnect = useCallback(() => {
    if (!peer) {
      alert("Peer not initialized. Please wait a moment, or refresh the page.");
      return;
    }

    const code = prompt("Enter the connection string:");

    if (!code?.trim()) {
      alert(
        "No connection string provided. Please, provide your friend's code."
      );
      return;
    }

    connectToOtherPeer(code, () => {
      navigate(`/chat/${code}`, {
        state: {
          userId,
          username,
          peerId: code,
        },
      });
    });
  }, [connectToOtherPeer, navigate, peer, userId, username]);

  return (
    <div className="space-y-4 w-full max-w-md ">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Share the connection string with your friend.
      </h2>

      <div className="text-lg text-gray-600">
        {!userId ? (
          <div className="flex flex-row items-center justify-center">
            <Loader className="animate-spin" size={30} />

            <span className="ml-2">Generating connection string...</span>
          </div>
        ) : (
          <Fragment>
            Your connection string is:
            <div className="w-full bg-green-200/70 flex flex-row p-2 rounded-md justify-between items-center gap-3">
              <span>{userId}</span>

              <Button
                size="icon"
                variant="outline"
                disabled={!userId}
                onClick={() => handleCopy(userId!)}
              >
                <Copy size={20} />
              </Button>
            </div>
          </Fragment>
        )}
      </div>

      <Button disabled={!userId} className="w-full" onClick={handleConnect}>
        Connect to a friend
      </Button>
    </div>
  );
}
