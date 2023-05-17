const typescript = require("rollup-plugin-typescript2");
const pkg = require("./package.json");

module.exports = {
  input: "./src/index.ts",
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
      tsconfigOverride: {
        compilerOptions: {
          rootDir: "./src/",
          outDir: "./dist/tmp/",
          declarationDir: "./dist/type/",
        },
        exclude: ["./dist/", "./tests/"],
      },
    }),
  ],
  output: [
    // ES module (for bundlers) build.
    {
      format: "esm",
      file: pkg.module,
      exports: "default",
      sourcemap: true,
      sourcemapExcludeSources: false,
    },
    // CommonJS (for Node) build.
    {
      format: "cjs",
      file: pkg.main,
      exports: "default",
      sourcemap: true,
      sourcemapExcludeSources: false,
    },
    // jsdelivr IIFE build.
    {
      format: "iife",
      name: "GM_fetch",
      file: pkg.jsdelivr,
    },
  ],
};
