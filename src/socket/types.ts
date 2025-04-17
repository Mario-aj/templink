export interface Room {
  offer: RTCSessionDescriptionInit;
  answer: RTCSessionDescriptionInit | null;
  peers: string[];
}

export interface ErrorResponse {
  error: string | null;
}
