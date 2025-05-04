# TempLink

TempLink is a secure, ephemeral messaging platform that allows users to create temporary chat rooms for real-time, peer-to-peer communication. No sign-ups, no traces—just private conversations that disappear after use.

## Features

- **Secure Messaging**: Peer-to-peer communication through WebRTC ensures privacy.
- **No Sign-Ups**: Start chatting instantly without creating an account.
- **User-Friendly Interface**: Simple and intuitive design for seamless interaction.
- **Create and Join Rooms**: Generate a unique room code and share it with the user you want to connect for a real-time chat session.
- **Ephemeral Data**: No room data is stored because the connection is directly between the users. Once the room is empty, all nicknames are deleted.
- **Peer-to-Peer Communication**: Powered by WebRTC for direct peer-to-peer (P2P) communication, ensuring fast and secure chat.
- **Text**: Send text messages through WebRTC's Data Channel.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org) (v18 or later)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/temp-link.git
   cd temp-link
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

### Running the Development Server

Start the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

## Future Enhancements

- **Audio**: Add support for audio message.

- **File Sharing**: Add support for file sharing (images, documents, etc.).

- **Group Chats**: Implement support for group chats with multiple participants.

## Acknowledgements

- Thanks to PeerJS for providing peer-to-peer communication.

- Inspired by minimalistic, modern chat apps for seamless user experiences.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
