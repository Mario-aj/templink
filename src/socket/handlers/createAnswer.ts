import { getFileContent, writeFileContent } from "@/utils/fileManipulations";
import { ErrorResponse, Room } from "../types";

interface CreateAnswerParams {
  roomId: string;
  answer: RTCSessionDescriptionInit;
  nickname: string;
}

export interface CreateAnswerResponse extends ErrorResponse {
  data: {
    roomId: string;
    answer: RTCSessionDescriptionInit;
    socketId: string;
  } | null;
}

const createAnswer = async (
  { answer, nickname, roomId }: CreateAnswerParams,
  callback: (data: CreateAnswerResponse) => void
) => {
  if (!roomId || !roomId.trim()) {
    callback({
      error: "Room ID is required",
      data: null,
    });

    return;
  }

  if (!answer) {
    callback({
      error: "Answer is required",
      data: null,
    });

    return;
  }

  if (!nickname || !nickname.trim()) {
    callback({
      error: "Nickname is required",
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
  const { offer, answer: existingAnswer } = room;

  if (!offer) {
    callback({
      error: "No offer found for this room",
      data: null,
    });

    return;
  }

  if (existingAnswer) {
    callback({
      error: "sorry, we just support two users in a room and this room is full",
      data: null,
    });

    return;
  }

  room.answer = answer;

  room.peers.push(nickname);

  rooms[roomId] = room;

  const targetSocketId = crypto.randomUUID();
  const response = {
    error: null,
    data: {
      roomId,
      answer,
      socketId: targetSocketId,
    },
  };

  writeFileContent("rooms", rooms);

  callback(response);
};

export default createAnswer;
