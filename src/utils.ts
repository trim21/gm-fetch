export function parseRawHeaders(h: string): Headers {
  const s = h.trim();
  if (!s) {
    return new Headers();
  }

  const array: [string, string][] = s.split("\r\n").map((value) => {
    let s = value.split(":");
    return [s[0].trim(), s[1].trim()];
  });

  return new Headers(array);
}

export function parseGMResponse(res: GM.Response<any>): Response {
  const r = new Response(res.response as ArrayBuffer, {
    statusText: res.statusText,
    status: res.status,
    headers: parseRawHeaders(res.responseHeaders),
  });

  Object.defineProperty(r, "url", {
    value: res.finalUrl,
  });

  return r;
}
