import fs from "fs";
import util from "util";

const readFile  = util.promisify(fs.readFile );
const writeFile = util.promisify(fs.writeFile);

const main = async () => {
  const x = (await readFile("index-builder.html")).toString();
  const y = (await readFile("main.js")).toString();
  const res = x.replace('/*put main.js here*/',y);
  await writeFile("index.html", res);
};

main();