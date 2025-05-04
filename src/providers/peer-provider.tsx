import Peer, { DataConnection } from "peerjs";
import { ReactNode, useCallback, useLayoutEffect, useState } from "react";

import Context, { Message } from "@/contexts/peer";

const PeerProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [connection, setConnection] = useState<DataConnection | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const connectToOtherPeer = useCallback(
    (id: string, callback: () => void) => {
      if (!peer) {
        alert(
          "Peer not initialized. Please wait a moment, or refresh the page."
        );
        return;
      }

      const currentConnection = peer.connect(id);
      setConnection(currentConnection);

      callback();
    },
    [peer]
  );

  const initialized = useCallback(() => {
    const currentPeer = new Peer({ secure: true });

    setPeer(currentPeer);

    return currentPeer;
  }, []);

  const cleanup = useCallback(() => {
    connection?.close();
    peer?.destroy();

    setPeer(null);
    setUserId(null);
    setConnection(null);
  }, [connection, peer]);

  useLayoutEffect(() => {
    const initPeer = initialized();

    initPeer.on("open", (id) => {
      localStorage.setItem("@templink/user-id", id);

      setUserId(id);
    });

    initPeer.on("connection", (conn) => {
      conn.on("data", (data) => {
        if ((data as Message).message) {
          setMessages((prev) => [...prev, { ...(data as Message) }]);
        }

        console.log("Received data:", data);
      });

      conn.on("close", () => {
        console.log("Connection closed");
        cleanup();
      });

      setConnection(conn);
    });

    initPeer.on("error", (err) => {
      console.error("Peer error:", err);

      alert("PEER Error: " + err.message);
    });

    return () => cleanup();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Context.Provider
      value={{
        userId,
        peer: peer,
        messages,
        connectToOtherPeer,
        connection: connection,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default PeerProvider;
