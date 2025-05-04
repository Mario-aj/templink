import context from "@/contexts/peer";
import { useContext } from "react";

const usePeer = () => {
  const ctx = useContext(context);

  if (!ctx) {
    throw new Error("usePeer must be used inside PeerProvider component.");
  }

  return ctx;
};

export default usePeer;
