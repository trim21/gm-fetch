import GM_fetch from "../src/index.ts";

async function main() {
  const r = await GM_fetch("...");
  const res = await r.text();
  console.log(r);
}

main().catch((e) => {
  throw e;
});
