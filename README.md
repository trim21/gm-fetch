# fetch for UserScript

using fetch based on `GM.xmlHttpRequest` in userscript.

**Don't forget to add `@grant GM.xmlHttpRequest` and `@connect` in your metadata**

## Introduction

It's not 100% same with fetch API because some security limit like corss site request doesn't exist on `GM.xmlHttpRequest`.

You can set some HTTP headers allowed by `GM.xmlHttpRequest` but not allowed by standard fetch API.

This package doesn't include a polyfill, so requires browser with fetch API support.

https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#browser_compatibility

## Example

```javascript
// ==UserScript==
// @name        new user script
// @version     0.0.1
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
};
```

## if you are using js bundler

ES Module:

```javascript
import GM_fetch from "@trim21/gm-fetch";
```

CommonJS:

```javascript
const GM_fetch = require("@trim21/gm-fetch");
```

## Licence

MIT
