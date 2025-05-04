import { createBrowserRouter, redirect } from "react-router";
import HomePage from "./pages/home";
import Chat from "./pages/chat";

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/chat/:peerId",
    Component: Chat,
    loader: async ({ params }) => {
      const { peerId } = params;

      if (!peerId) {
        console.error("No peerId provided");

        redirect("/");
        return null;
      }

      let user = {} as { username: string; id: string };

      if (localStorage && typeof localStorage !== "undefined") {
        const userId = localStorage.getItem("@templink/user-id");
        const username = localStorage.getItem("@templink/username");

        if (!userId || !username) {
          console.error("No userId or username found in localStorage");
          return redirect("/");
        }

        user = {
          id: userId,
          username,
        };
      }

      return { peerId, user };
    },
  },
]);

export default router;
