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

export function parseGMResponse(req: Request, res: GM.Response<any>): Response {
  return new ResImpl(res.response as Blob, {
    statusCode: res.status,
    statusText: res.statusText,
    headers: parseRawHeaders(res.responseHeaders),
    finalUrl: res.finalUrl,
    redirected: res.finalUrl === req.url,
  });
}

interface ResInit {
  redirected: boolean;
  headers: Headers;
  statusCode: number;
  statusText: string;
  finalUrl: string;
}

class ResImpl implements Response {
  private _bodyUsed: boolean;
  private readonly rawBody: Blob;
  private readonly init: ResInit;

  readonly body: ReadableStream<Uint8Array> | null;
  readonly headers: Headers;
  readonly redirected: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly type: ResponseType;
  readonly url: string;

  constructor(body: Blob, init: ResInit) {
    this.rawBody = body;
    this.init = init;

    this.body = toReadableStream(body);
    const { headers, statusCode, statusText, finalUrl, redirected } = init;
    this.headers = headers;
    this.status = statusCode;
    this.statusText = statusText;
    this.url = finalUrl;
    this.type = "basic";
    this.redirected = redirected;
    this._bodyUsed = false;
  }

  get bodyUsed(): boolean {
    return this._bodyUsed;
  }

  get ok(): boolean {
    return this.status < 300;
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    if (this.bodyUsed) {
      throw new TypeError("Failed to execute 'arrayBuffer' on 'Response': body stream already read");
    }
    this._bodyUsed = true;
    return this.rawBody.arrayBuffer();
  }

  blob(): Promise<Blob> {
    if (this.bodyUsed) {
      throw new TypeError("Failed to execute 'blob' on 'Response': body stream already read");
    }
    this._bodyUsed = true;
    // `slice` will use empty string as default value, so need to pass all arguments.
    return Promise.resolve(this.rawBody.slice(0, this.rawBody.size, this.rawBody.type));
  }

  clone(): Response {
    if (this.bodyUsed) {
      throw new TypeError("Failed to execute 'clone' on 'Response': body stream already read");
    }
    return new ResImpl(this.rawBody, this.init);
  }

  formData(): Promise<FormData> {
    if (this.bodyUsed) {
      throw new TypeError("Failed to execute 'formData' on 'Response': body stream already read");
    }
    this._bodyUsed = true;
    return this.rawBody.text().then(decode);
  }

  async json(): Promise<any> {
    if (this.bodyUsed) {
      throw new TypeError("Failed to execute 'json' on 'Response': body stream already read");
    }
    this._bodyUsed = true;
    return JSON.parse(await this.rawBody.text());
  }

  text(): Promise<string> {
    if (this.bodyUsed) {
      throw new TypeError("Failed to execute 'text' on 'Response': body stream already read");
    }
    this._bodyUsed = true;
    return this.rawBody.text();
  }
}

function decode(body: string) {
  const form = new FormData();

  body
    .trim()
    .split("&")
    .forEach(function (bytes) {
      if (bytes) {
        const split = bytes.split("=");
        const name = split.shift()?.replace(/\+/g, " ");
        const value = split.join("=").replace(/\+/g, " ");
        form.append(decodeURIComponent(name!), decodeURIComponent(value));
      }
    });

  return form;
}

function toReadableStream(value: Blob) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(value);
      controller.close();
    },
  });
}
