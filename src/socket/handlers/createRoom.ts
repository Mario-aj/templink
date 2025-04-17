/// <reference lib="dom" />
import crypto from "crypto";
import {
  getFileContent,
  writeFileContent,
} from "../../utils/fileManipulations";
import { ErrorResponse, Room } from "../types";

interface CreateRoomParams {
  offer: RTCSessionDescriptionInit;
  nickname: string;
}

export interface CreateRoomResponse extends ErrorResponse {
  data: {
    roomId: string;
  } | null;
}

const createRoom = (
  { nickname, offer }: CreateRoomParams,
  callback: (data: CreateRoomResponse) => void
) => {
  const nicknames = getFileContent<Array<string>>("nicknames", []); // Use an empty array as the default content

  if (!nickname || !nickname.trim() || !nicknames.includes(nickname)) {
    callback({
      error: "Nickname not found",
      data: {
        roomId: "",
      },
    });
  }

  const roomId = crypto.randomUUID();
  const rooms = getFileContent<Record<string, Room>>("rooms", {}); // Use an empty object as the default content

  rooms[roomId] = {
    offer,
    answer: null,
    peers: [nickname],
  };

  writeFileContent("rooms", rooms);

  callback({
    error: "",
    data: {
      roomId,
    },
  });
};

export default createRoom;
