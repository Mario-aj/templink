/* eslint-disable no-var */

declare global {
  var peerConnection: RTCPeerConnection;
  var dataChannel: RTCDataChannel;
}

const peerConnection = globalThis.peerConnection || new RTCPeerConnection();

const webRTC = {
  peerConnection: peerConnection,
  dataChannel: peerConnection.createDataChannel("templink-chat-channel"),
}

if (process.env.NODE_ENV === 'development') {
  globalThis.peerConnection = webRTC.peerConnection;
  globalThis.dataChannel = webRTC.dataChannel;
}

export default webRTC;