import { describe, it, expect } from "@jest/globals";

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
          response: Buffer.from("test", "utf8"),
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
        response: Buffer.from("test", "utf8"),
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
});
