# fetch for UserScript

using fetch based on `GM.xmlHttpRequest` in userscript.

## Introduction

```javascript
// ==UserScript==
// @name        new user script
// @namespace   https://trim21.me/
// @description hello
// @version     0.0.1
// @author      Trim21 <trim21me@gmail.com>
// @match       http*://*/*
// @grant       GM.xmlHttpRequest
// @require     https://cdn.jsdelivr.net/npm/@trim21/gm-fetch
// @run-at      document-end
// @connect     httpbin.org
// ==/UserScript==


async () => {
  const res = await GM_fetch("https://httpbin.org/headers", { method: "POST" });
  const data = await res.json();
  console.log(data);
}
```

## if you are using js bundler

esm is support:

```javascript
import GM_fetch from "@trim21/gm-fetch";
```

CommonJS is not supported.

## Licence

MIT
