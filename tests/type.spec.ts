import { test } from "@jest/globals";

import GM_fetch from "../src/index";

test("type checking", function () {
  // type checking if our GM_fetch have save signature as DOM fetch
  let _1: typeof fetch = GM_fetch;
  let _2: typeof GM_fetch = fetch;
});
