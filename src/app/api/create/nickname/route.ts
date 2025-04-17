import { getFileContent, writeFileContent } from "@/utils/fileManipulations";

export async function POST(req: Request) {
  const { nickname } = await req.json();

  if (!nickname || typeof nickname !== "string") {
    return Response.json({ message: "Invalid nickname" }, { status: 400 });
  }

  try {
    const nicknames = getFileContent<Array<string>>("nicknames", []);

    if (nicknames.includes(nickname)) {
      return Response.json(
        { message: "Nickname is already in use" },
        { status: 409 }
      );
    }

    nicknames.push(nickname);

    writeFileContent("nicknames", nicknames);

    return Response.json(
      { message: "Nickname created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling nickname:", error);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
