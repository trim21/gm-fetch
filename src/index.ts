export default async function GM_fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
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
      method: gmXHRMethod(request.method.toUpperCase()),
      headers: toGmHeaders(request.headers),
      data: data,
      onload: (res) => resolve(parseGMResponse(res)),
      onerror: (err) => reject(new TypeError("Failed to fetch: " + err.finalUrl)),
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

const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "TRACE", "OPTIONS", "CONNECT"] as const;

// a ts type helper to narrow type
function includes<T extends U, U>(array: ReadonlyArray<T>, element: U): element is T {
  return array.includes(element as T);
}

function gmXHRMethod(method: string): typeof httpMethods[number] {
  if (includes(httpMethods, method)) {
    return method;
  }

  throw new Error(`unsupported http method ${method}`);
}

function toGmHeaders(h: Headers | undefined): { [header: string]: string } | undefined {
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
  const array: [string, string][] = h
    .trim()
    .split("\r\n")
    .map((value) => {
      let s = value.split(": ");
      return [s[0], s[1]];
    });

  return new Headers(array);
}
