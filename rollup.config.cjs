const typescript = require("rollup-plugin-typescript2");
const pkg = require("./package.json");
const path = require("path");

const sourcemapPathTransform = (relativeSourcePath, sourcemapPath) => {
  // 将会把相对路径替换为绝对路径
  return path.relative(__dirname, path.resolve(path.dirname(sourcemapPath), relativeSourcePath));
};

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
      exports: "default",
      sourcemap: true,
      sourcemapExcludeSources: false,
      sourcemapPathTransform,
    },
    // CommonJS (for Node) build.
    {
      format: "cjs",
      file: pkg.main,
      exports: "default",
      sourcemap: true,
      sourcemapExcludeSources: false,
      sourcemapPathTransform,
    },
    // jsdelivr IIFE build.
    {
      format: "iife",
      name: "GM_fetch",
      file: pkg.jsdelivr,
    },
  ],
};
