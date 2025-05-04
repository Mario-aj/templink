import Peer, { DataConnection } from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 *
 * @param autoConnect refers to whether the peer should automatically initialize.
 */

const useConnection = (autoConnect = true) => {
  const peer = useRef<Peer | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [connection, setConnection] = useState<DataConnection | undefined>(
    undefined
  );

  const connect = useCallback((id: string, callback?: () => void) => {
    if (!peer.current) {
      alert("Peer not initialized. Please wait a moment, or refresh the page.");
      return;
    }

    const dataConnection = peer.current?.connect(id);

    dataConnection?.on("open", () => {
      callback?.();
    });

    setConnection(dataConnection);
  }, []);

  const initializePeer = useCallback((id?: string) => {
    peer.current = id
      ? new Peer(id, { secure: true })
      : new Peer({ secure: true });

    peer.current.on("open", (id) => {
      setUserId(id);

      localStorage.setItem("@templink/user-id", peer.current!.id);
    });

    peer.current.on("connection", (conn) => {
      conn.on("data", (data) => {
        console.log("Received data:", data);
      });

      conn.on("close", () => {
        conn.close();
        peer.current?.disconnect();
      });
    });

    peer.current.on("error", (err) => {
      alert("PEER Error: " + err.message);
      console.error("Peer error:", err);
    });
  }, []);

  useEffect(() => {
    if (peer.current) return;

    if (autoConnect) {
      initializePeer();
    }

    return () => {
      peer.current?.destroy();
      peer.current = null;
      setUserId(null);
      setConnection(undefined);
    };
  }, [autoConnect, initializePeer]);

  return {
    peer,
    userId,
    connect,
    connection,
    initializePeer,
  };
};

export default useConnection;
