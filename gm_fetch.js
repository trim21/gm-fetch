var GM_fetch = (function () {
  'use strict';

  function parseRawHeaders(h) {
      const s = h.trim();
      if (!s) {
          return new Headers();
      }
      const array = s.split("\r\n").map((value) => {
          let s = value.split(":");
          return [s[0].trim(), s[1].trim()];
      });
      return new Headers(array);
  }
  function parseGMResponse(res) {
      const r = new Response(res.response, {
          statusText: res.statusText,
          status: res.status,
          headers: parseRawHeaders(res.responseHeaders),
      });
      Object.defineProperty(r, "url", {
          value: res.finalUrl,
      });
      return r;
  }

  async function GM_fetch(input, init) {
      const request = new Request(input, init);
      let data;
      if (init?.body) {
          data = await request.text();
      }
      return await XHR(request, data);
  }
  function XHR(request, data) {
      return new Promise((resolve, reject) => {
          if (request.signal && request.signal.aborted) {
              return reject(new DOMException("Aborted", "AbortError"));
          }
          GM.xmlHttpRequest({
              url: request.url,
              method: gmXHRMethod(request.method.toUpperCase()),
              headers: toGmHeaders(request.headers),
              data: data,
              responseType: "blob",
              onload(res) {
                  resolve(parseGMResponse(res));
              },
              onabort() {
                  reject(new DOMException("Aborted", "AbortError"));
              },
              ontimeout() {
                  reject(new TypeError("Network request failed, timeout"));
              },
              onerror(err) {
                  reject(new TypeError("Failed to fetch: " + err.finalUrl));
              },
          });
      });
  }
  const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "TRACE", "OPTIONS", "CONNECT"];
  // a ts type helper to narrow type
  function includes(array, element) {
      return array.includes(element);
  }
  function gmXHRMethod(method) {
      if (includes(httpMethods, method)) {
          return method;
      }
      throw new Error(`unsupported http method ${method}`);
  }
  function toGmHeaders(h) {
      if (!h) {
          return undefined;
      }
      const t = {};
      h.forEach((value, key) => {
          t[value] = key;
      });
      return t;
  }

  return GM_fetch;

})();
