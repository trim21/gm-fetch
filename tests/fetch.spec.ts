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
    const xmlHttpRequest: GmXhr = (option) => {
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

    const res = await GM_fetch("https://example.com/");

    expect(res.url).toBe("https://example.com/u");
    expect(await res.text()).toBe("test");
  });
});
