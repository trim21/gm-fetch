import { describe, it, expect } from "@jest/globals";
import { Blob } from "buffer";

import { parseRawHeaders } from "../src/utils";
import GM_fetch from "../src";

describe("parse header", () => {
  it("empty", () => {
    expect(parseRawHeaders("")).toEqual(new Headers({}));
  });
});

type GmXhr = (details: GM.Request) => void;

describe("call", function () {
  it("should return ok", async function () {
    let realCall: GM.Request | undefined;
    const xmlHttpRequest: GmXhr = (option) => {
      realCall = option;
      setTimeout(() => {
        option?.onload?.({
          finalUrl: "https://example.com/u",
          readyState: 4,
          responseHeaders: "origin: example.com\r\ndate: Tue, 22 Nov 2022 15:59:43 GMT",
          responseText: "test",
          status: 200,
          responseXML: false,
          statusText: "",
          response: new Blob([Buffer.from("test", "utf8")]),
          context: undefined,
        });
      });
    };
    // @ts-ignore
    global.GM = {
      xmlHttpRequest,
    };

    const res = await GM_fetch("https://example.com/", { method: "POST" });

    expect(res.url).toBe("https://example.com/u");
    expect(await res.text()).toBe("test");
    expect(realCall?.method).toBe("POST");
  });

  it("should send headers", async function () {
    let realHeader = null;
    const xmlHttpRequest: GmXhr = (option) => {
      realHeader = option.headers;

      option?.onload?.({
        finalUrl: "https://example.com/u",
        readyState: 4,
        responseHeaders: "origin: example.com\r\ndate: Tue, 22 Nov 2022 15:59:43 GMT",
        responseText: "test",
        status: 200,
        responseXML: false,
        statusText: "",
        response: new Blob([Buffer.from("test", "utf8")]),
        context: undefined,
      });
    };
    // @ts-ignore
    global.GM = {
      xmlHttpRequest,
    };

    const res = await GM_fetch("https://example.com/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer xxxxxx",
      },
    });

    expect(res.url).toBe("https://example.com/u");
    expect(await res.text()).toBe("test");
    expect(realHeader).toMatchObject({
      "content-type": "application/json",
      authorization: "Bearer xxxxxx",
    });
  });

  it("should handle abort signal", async function () {
    const abortController = new AbortController();
    let abortCalled = false;
    let onabortHandler: ((response: GM.Response<any>) => void) | undefined;

    const xmlHttpRequest: GmXhr = (option) => {
      onabortHandler = option.onabort;
      // Return a mock object with abort method
      return {
        abort: () => {
          abortCalled = true;
          // Call the onabort handler when abort is called
          if (onabortHandler) {
            onabortHandler({} as GM.Response<any>);
          }
        },
      } as any;
    };

    // @ts-ignore
    global.GM = {
      xmlHttpRequest,
    };

    const promise = GM_fetch("https://example.com/", {
      signal: abortController.signal,
    });

    // Abort the request
    abortController.abort();

    // Should reject with AbortError
    await expect(promise).rejects.toThrow("Aborted");
    expect(abortCalled).toBe(true);
  });

  it("should reject immediately if signal already aborted", async function () {
    const abortController = new AbortController();
    abortController.abort();

    let xmlHttpRequestCalled = false;
    const xmlHttpRequest: GmXhr = (option) => {
      xmlHttpRequestCalled = true;
      return {} as any;
    };

    // @ts-ignore
    global.GM = {
      xmlHttpRequest,
    };

    const promise = GM_fetch("https://example.com/", {
      signal: abortController.signal,
    });

    // Should reject with AbortError
    await expect(promise).rejects.toThrow("Aborted");
    // Should not call xmlHttpRequest if signal is already aborted
    expect(xmlHttpRequestCalled).toBe(false);
  });
});
