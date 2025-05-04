import Peer, { DataConnection } from "peerjs";
import { createContext } from "react";

export interface Message {
  sender: {
    username: string;
    userId: string;
  };
  message: string;
}

interface PeerContext {
  peer: Peer | null;
  userId: string | null;
  messages: Message[];
  connection: DataConnection | null;
  connectToOtherPeer: (id: string, callback: () => void) => void;
}

const context = createContext<PeerContext>({} as PeerContext);

export default context;
