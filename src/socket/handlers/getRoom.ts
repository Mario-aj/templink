import { getFileContent } from "@/utils/fileManipulations";
import { ErrorResponse, Room } from "../types";

interface GetRoomRequest {
  roomId: string;
}

export interface GetRoomResponse extends ErrorResponse {
  data: { offer: Room["offer"] } | null;
}

const getRoom = (
  { roomId }: GetRoomRequest,
  callback: (data: GetRoomResponse) => void
) => {
  if (!roomId || !roomId.trim()) {
    callback({
      error: "Room ID is required",
      data: null,
    });

    return;
  }

  const rooms = getFileContent<Record<string, Room>>("rooms", {});

  if (!rooms[roomId]) {
    callback({
      error: "Invalid room ID",
      data: null,
    });

    return;
  }

  const room = rooms[roomId];

  const { offer, answer, peers } = room;

  console.log("Room details:", { offer, answer, peers });

  callback({
    error: null,
    data: {
      offer,
    },
  });
};

export default getRoom;
