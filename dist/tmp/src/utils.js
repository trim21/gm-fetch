export function parseRawHeaders(h) {
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
export function parseGMResponse(req, res) {
    return new ResImpl(res.response, {
        statusCode: res.status,
        statusText: res.statusText,
        headers: parseRawHeaders(res.responseHeaders),
        finalUrl: res.finalUrl,
        redirected: res.finalUrl === req.url,
    });
}
class ResImpl {
    constructor(body, init) {
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
    get bodyUsed() {
        return this._bodyUsed;
    }
    get ok() {
        return this.status < 300;
    }
    arrayBuffer() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'arrayBuffer' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return this.rawBody.arrayBuffer();
    }
    blob() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'blob' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return Promise.resolve(this.rawBody.slice(0, this.rawBody.length, this.rawBody.type));
    }
    clone() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'clone' on 'Response': body stream already read");
        }
        return new ResImpl(this.rawBody, this.init);
    }
    formData() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'formData' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return this.rawBody.text().then(decode);
    }
    async json() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'json' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return JSON.parse(await this.rawBody.text());
    }
    text() {
        if (this.bodyUsed) {
            throw new TypeError("Failed to execute 'text' on 'Response': body stream already read");
        }
        this._bodyUsed = true;
        return this.rawBody.text();
    }
}
function decode(body) {
    const form = new FormData();
    body
        .trim()
        .split("&")
        .forEach(function (bytes) {
        if (bytes) {
            const split = bytes.split("=");
            const name = split.shift()?.replace(/\+/g, " ");
            const value = split.join("=").replace(/\+/g, " ");
            form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
    });
    return form;
}
function toReadableStream(value) {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(value);
            controller.close();
        },
    });
}
//# sourceMappingURL=utils.js.map