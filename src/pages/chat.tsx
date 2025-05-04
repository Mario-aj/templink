import { useMemo } from "react";
import { Link, useLoaderData } from "react-router";

import usePeer from "@/hooks/usePeer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUp, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function Chat() {
  const { user, peerId } = useLoaderData();
  const { connection, userId, messages } = usePeer();

  const connected = useMemo(() => !!connection?.peer, [connection]);

  console.log("Chat messages", connection);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const message = formData.get("message")?.toString();

    if (!message) return;

    connection?.send({
      sender: {
        username: user.username,
        userId: userId,
      },
      message,
    });

    e.currentTarget.reset();
  };

  const handleLeaveChat = () => {
    connection?.close();

    localStorage.removeItem("@templink/user-id");
    localStorage.removeItem("@templink/username");

    window.location.reload();
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b flex items-center justify-between bg-white">
        <h1 className="text-2xl font-semibold">
          Temp<span className="text-violet-600">Link</span>
        </h1>
        <span className="text-gray-600">
          <strong>Connection</strong>: {userId}{" "}
          <strong className="text-xl">to</strong> {peerId}
        </span>

        <div className="flex items-center gap-1">
          <div
            className={cn(
              "w-3 h-3 rounded-full bg-green-600",
              connected ? "animate-pulse" : "bg-gray-400"
            )}
          />
          <span className="text-sm  ml-1">{connected ? "On" : "Off"}</span>
        </div>
      </header>

      <div className="flex flex-row flex-1 w-full">
        {/* Sidebar */}
        <div className="flex flex-col space-y-4 p-4 w-xs h-full bg-white border-r">
          <h2 className="text-xl font-semibold">Chat Room</h2>

          <Button
            className="mt-auto"
            variant="outline"
            onClick={handleLeaveChat}
          >
            <LogOut className="text-red-500" />
            <span className="text-red-500">Leave Room</span>
          </Button>
        </div>

        <div className="overflow-y-auto flex flex-col p-4 pb-2 w-full max-w-4xl mx-auto">
          <div className="space-y-4 flex-1">
            {!!messages.length &&
              messages.map((message, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-start gap-2",
                    message.sender.userId === userId
                      ? "justify-end"
                      : "justify-start"
                  )}
                >
                  <Card
                    className={cn(
                      "max-w-sm p-3 px-4",
                      message.sender.userId === userId
                        ? "bg-blue-100"
                        : "bg-white"
                    )}
                  >
                    <CardContent className="px-0">
                      <p
                        className={cn(
                          "text-xs",
                          message.sender.userId === userId
                            ? "text-blue-600 text-right"
                            : "text-gray-400"
                        )}
                      >
                        {message.sender.username}
                      </p>
                      <p>{message.message}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}

            <div />
          </div>

          <form
            onSubmit={handleSubmit}
            aria-disabled={!connected}
            className="p-4 flex gap-2 items-center rounded-md relative"
          >
            <Textarea
              rows={3}
              id="message"
              name="message"
              disabled={!connected}
              placeholder="Type your message..."
            />
            <button
              type="submit"
              disabled={!connected}
              className="absolute bottom-7 right-7 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 ease-in-out"
            >
              <ArrowUp className="!w-4 !h-4" />
            </button>
          </form>

          <span className="text-xs text-gray-400 text-center -mt-1">
            Built with ❤️ by{" "}
            <Link
              className="text-blue-500 hover:text-blue-600 transition-colors duration-300 ease-in-out cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
              to="https://www.linkedin.com/in/m%C3%A1rio-alfredo-jorge-0370b61b4/"
            >
              Mário Jorge
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
