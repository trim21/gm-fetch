# fetch for UserScript

using fetch based on `GM.xmlHttpRequest` in userscript.

**Don't forget to add `@grant GM.xmlHttpRequest` and `@connect` in your metadata**

## Introduction

It's not 100% same with fetch API because some security limit like cors site request doesn't exist on `GM.xmlHttpRequest`.

And `AbortSignal` is not supported very well due to the limitation of `GM.xmlHttpRequest`.

You can set some HTTP headers allowed by `GM.xmlHttpRequest` but not allowed by standard fetch API.

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

(you can't use `@require https://cdn.jsdelivr.net/npm/@trim21/gm-fetch` directly if you want to upload your script to GreasyFork,
you will need to specify version you want to use, for example `@require https://cdn.jsdelivr.net/npm/@trim21/gm-fetch@0.1.15`)

## if you are using js bundler

ES Module:

```javascript
import GM_fetch from "@trim21/gm-fetch";
```

CommonJS (not recommended):

```javascript
const GM_fetch = require("@trim21/gm-fetch");
```

## Browser Compatibility

This package is using `Request` and `Response` class, it so requires a browser with fetch API support.

## Licence

MIT
