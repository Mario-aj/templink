import fs from "fs";
import path from "path";

export function getFileContent<T>(fileName: string, defaultContent: T): T {
  const FILE = path.join(process.cwd(), "tmp", `${fileName}.json`);

  if (!fs.existsSync(path.dirname(FILE))) {
    return defaultContent;
  }

  let nicknames = defaultContent;

  if (fs.existsSync(FILE)) {
    const fileContent = fs.readFileSync(FILE, "utf-8");
    nicknames = JSON.parse(fileContent);
  }

  return nicknames;
}

export function writeFileContent(fileName: string, data: unknown) {
  const FILE = path.join(process.cwd(), "tmp", `${fileName}.json`);

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}
