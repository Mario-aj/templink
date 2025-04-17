/* eslint-disable no-var */
"use client";

declare global {
  var peerConnection: RTCPeerConnection | undefined;
  var dataChannel: RTCDataChannel | undefined;
}

const isBrowser = typeof window !== "undefined";

const peerConnection = isBrowser
  ? globalThis.peerConnection || new RTCPeerConnection()
  : undefined;

const webRTC = isBrowser
  ? {
      peerConnection: peerConnection!,
      dataChannel: peerConnection!.createDataChannel("templink-chat-channel"),
    }
  : {
      peerConnection: undefined,
      dataChannel: undefined,
    };

if (isBrowser && process.env.NODE_ENV === "development") {
  globalThis.peerConnection = webRTC.peerConnection;
  globalThis.dataChannel = webRTC.dataChannel;
}

export default webRTC;
