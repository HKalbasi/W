import fs from "fs";
import util from "util";

const readFile  = util.promisify(fs.readFile );
const writeFile = util.promisify(fs.writeFile);

const names = [
  'home',
  'backuper',
  'graphic-engine',
  'wiki',
  'wikiedit',
];

const main = async () => {
  const l = await Promise.all(
    names.map(x=>readFile(`${x}.js`).then(y=>[x,y.toString()]))
  );
  await writeFile("pack.json", JSON.stringify(l));
};

main();