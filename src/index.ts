export default async function GM_fetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const request = new Request(input, init);

  let data: string | undefined;
  if (init?.body) {
    data = await request.text();
  }

  return await XHR(request, data);
}

function XHR(request: Request, data: string | undefined): Promise<Response> {
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      url: request.url,
      method: gmXHRMethod(request.method),
      headers: toGmHeaders(request.headers),
      data: data,
      onload: (res) => resolve(parseGMResponse(res)),
      onerror: reject,
    });
  });
}

function parseGMResponse(res: GM.Response<any>): Response {
  return new Response(res.responseText, {
    statusText: res.statusText,
    status: res.status,
    headers: parseRawHeaders(res.responseHeaders),
  });
}

function gmXHRMethod(
  method: string
):
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "TRACE"
  | "OPTIONS"
  | "CONNECT" {
  if (
    method === "GET" ||
    method === "POST" ||
    method === "PUT" ||
    method === "DELETE" ||
    method === "PATCH" ||
    method === "HEAD" ||
    method === "TRACE" ||
    method === "OPTIONS" ||
    method === "CONNECT"
  ) {
    return method;
  }

  throw new Error("");
}

function toGmHeaders(
  h: Headers | undefined
): { [header: string]: string } | undefined {
  if (!h) {
    return undefined;
  }

  const t: { [header: string]: string } = {};
  h.forEach((value, key) => {
    t[value] = key;
  });

  return t;
}

function parseRawHeaders(h: string): Headers {
  const array = h
    .trim()
    .split("\r\n")
    .map((value) => {
      let s = value.split(": ");
      return [s[0], s[1]];
    });

  return new Headers(array);
}
