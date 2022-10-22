const typescript = require("rollup-plugin-typescript2");
const pkg = require("./package.json");

module.exports = {
  input: "./src/index.ts",
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
      // useTsconfigDeclarationDir: true,
    }),
  ],
  output: [
    // ES module (for bundlers) build.
    {
      format: "esm",
      file: pkg.module,
    },
    // CommonJS (for Node) build.
    {
      format: "cjs",
      file: pkg.main,
    },
    {
      format: "umd",
      name: "GM_fetch",
      file: pkg.jsdelivr,
      sourcemap: "inline",
    },
  ],
};
