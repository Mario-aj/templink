import fs from "fs";
import path from "path";

export function getFileContent(fileName: string) {
  const NICKNAMES_FILE = path.join(process.cwd(), "tmp", `${fileName}.json`);

  if (!fs.existsSync(path.dirname(NICKNAMES_FILE))) {
    fs.mkdirSync(path.dirname(NICKNAMES_FILE), { recursive: true });
  }

  let nicknames = [];

  if (fs.existsSync(NICKNAMES_FILE)) {
    const fileContent = fs.readFileSync(NICKNAMES_FILE, "utf-8");
    nicknames = JSON.parse(fileContent);
  }

  return nicknames;
}

export function writeFileContent(fileName: string, data: unknown) {
  const NICKNAMES_FILE = path.join(process.cwd(), "tmp", `${fileName}.json`);

  if (!fs.existsSync(path.dirname(NICKNAMES_FILE))) {
    fs.mkdirSync(path.dirname(NICKNAMES_FILE), { recursive: true });
  }

  fs.writeFileSync(NICKNAMES_FILE, JSON.stringify(data, null, 2));
}
