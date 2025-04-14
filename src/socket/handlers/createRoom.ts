/// <reference lib="dom" />
import crypto from "crypto";
import {
  getFileContent,
  writeFileContent,
} from "../../utils/fileManipulations";

interface CreateRoomParams {
  offer: RTCSessionDescriptionInit;
  nickname: string;
}

export interface CreateRoomResponse {
  error: string | null;
  data: {
    roomId: string;
  } | null;
}

const createRoom = (
  { nickname, offer }: CreateRoomParams,
  callback: (data: CreateRoomResponse) => void
) => {
  const nicknames = getFileContent("nicknames");

  if (!nickname || !nickname.trim() || !nicknames.includes(nickname)) {
    callback({
      error: "Nickname not found",
      data: {
        roomId: "",
      },
    });
  }

  const roomId = crypto.randomUUID();
  const rooms = getFileContent("rooms");

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
