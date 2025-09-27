# fetch for UserScript

using fetch based on `GM.xmlHttpRequest` in userscript.

**Don't forget to add `@grant GM.xmlHttpRequest` and `@connect` in your metadata**

## Example

add this script to UserScript manager and visit <https://example.com/>

```javascript
// ==UserScript==
// @name        new user script
// @version     0.0.1
// @match       https://example.com/*
// @grant       GM.xmlHttpRequest
// @require     https://cdn.jsdelivr.net/npm/@trim21/gm-fetch
// @run-at      document-end
// @connect     httpbin.org
// ==/UserScript==

(async () => {
  const res = await GM_fetch("https://httpbin.org/headers", { method: "GET" });
  const data = await res.json();
  console.log(data);
})();
```

(you can't use `@require https://cdn.jsdelivr.net/npm/@trim21/gm-fetch` directly if you want to upload your script to GreasyFork,
you will need to specify version you want to use, for example `@require https://cdn.jsdelivr.net/npm/@trim21/gm-fetch@0.1.15`)

## if you are using js bundler

ES Module:

```javascript
import GM_fetch from "@trim21/gm-fetch";
```

## Compatibility Differences

This library provides a fetch API based on `GM.xmlHttpRequest`.

It do not behave 100% same as the standard fetch API, because some security limitations like CORS site requests don't exist on `GM.xmlHttpRequest`.

### Key Differences:

- **AbortSignal**: Not fully supported due to the limitations of `GM.xmlHttpRequest`
- **CORS**: Cross-origin requests work without CORS restrictions, unlike standard fetch
- **HTTP Headers**: You can set some HTTP headers that are allowed by `GM.xmlHttpRequest` but not allowed by standard fetch API
- **Redirect Parameter**: The `redirect` parameter `'follow' | 'error' | 'manual'` is not supported. All redirects are automatically followed by `GM.xmlHttpRequest`, similar to `redirect: 'follow'` behavior

## Browser Compatibility

This package is using `Request` and `Response` class, it so requires a browser with fetch API support.

<https://caniuse.com/?search=Blob.stream>

## Licence

MIT
