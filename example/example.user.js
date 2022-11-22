// ==UserScript==
// @name         test gm-fetch master branch
// @require      https://github.com/trim21/gm-fetch/raw/gh-pages/gm_fetch.js
// @namespace    https://trim21.me/
// @version      0.0.1
// @author       Trim21 <trim21me@gmail.com>
// @license      MIT
// @match        http://example.com/*
// @grant        GM.xmlHttpRequest
// @connect      httpbin.org
// ==/UserScript==

async function main() {
  {
    const res = await GM_fetch("https://httpbin.org/get", { method: "get" });
    console.log(res.url);
    if (!res.ok) {
      throw new Error("GM_fetch error");
    }
    console.log(await res.json());
  }
  {
    const res = await GM_fetch("https://httpbin.org/put", { method: "put" });
    console.log(res.url);
    if (!res.ok) {
      throw new Error("GM_fetch error");
    }
    console.log(await res.json());
  }

  {
    const res = await GM_fetch("https://httpbin.org/uuid");
    const data = await res.json();
    if (!res.ok) {
      throw new Error("GM_fetch error");
    }
    console.assert("uuid" in data, JSON.stringify(data));
  }

  {
    const res = await GM_fetch("https://httpbin.org/anything", {
      method: "POST",
      body: JSON.stringify({ hello: "world" }),
      headers: { "content-type": "application/json" },
    });

    const data = await res.json();

    console.log(data);
  }
}

main().catch((e) => {
  throw e;
});
