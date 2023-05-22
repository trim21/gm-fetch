const path = require("path");
const url = require("url");

const banner2 = require("rollup-plugin-banner2");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { userscriptMetadataGenerator } = require("userscript-metadata-generator");

const prod = require("../rollup.config.cjs");

const body_output_path = path.resolve(__dirname, "../dist/body.dev.user.js");

module.exports = [
  {
    input: path.resolve(__dirname, "empty.mjs"),
    output: {
      format: "iife",
      file: path.resolve(__dirname, "../dist/dev.user.js"),
      plugins: [
        banner2(
          () =>
            userscriptMetadataGenerator({
              name: "hello",
              version: "0.0.1",
              connect: "httpbin.org",
              "run-at": "document-end",
              match: "http*://*/*",
              grant: "GM.xmlHttpRequest",
              require: url.pathToFileURL(body_output_path).href,
            }) + "\n\n",
        ),
      ],
    },
  },
  {
    input: path.resolve(__dirname, "body.mjs"),
    plugins: [...prod.plugins, nodeResolve()],
    output: {
      format: "iife",
      file: body_output_path,
    },
  },
];
