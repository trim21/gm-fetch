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

GM_fetch("https://httpbin.org/headers", { method: "POST" })
  .then((res) => res.json())
  .then(console.log);
```

## if you are using js bundler

```javascript
const GM_fetch = require("@trim21/gm-fetch");
```

esm support:

```javascript
import GM_fetch from "@trim21/gm-fetch";
```

## Licence

MIT
