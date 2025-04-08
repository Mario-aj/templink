import fs from "fs";
import path from "path";

const NICKNAMES_FILE = path.join(process.cwd(), "tmp", "nicknames.json");

export async function POST(req: Request) {
  const { nickname } = await req.json();

  if (!nickname || typeof nickname !== "string") {
    return Response.json({ message: "Invalid nickname" }, { status: 400 });
  }

  try {
    if (!fs.existsSync(path.dirname(NICKNAMES_FILE))) {
      fs.mkdirSync(path.dirname(NICKNAMES_FILE), { recursive: true });
    }

    let nicknames = [];

    if (fs.existsSync(NICKNAMES_FILE)) {
      const fileContent = fs.readFileSync(NICKNAMES_FILE, "utf-8");
      nicknames = JSON.parse(fileContent);
    }

    console.log("Nicknames:", nicknames);

    if (nicknames.includes(nickname)) {
      return Response.json(
        { message: "Nickname is already in use" },
        { status: 409 }
      );
    }

    nicknames.push(nickname);
    fs.writeFileSync(NICKNAMES_FILE, JSON.stringify(nicknames, null, 2));

    return Response.json(
      { message: "Nickname created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling nickname:", error);

    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
