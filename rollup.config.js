// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import del from "rollup-plugin-delete";

const plugins = [
  commonjs(),
  typescript({ tsconfig: "./tsconfig.json" }),
  del({
    targets: "dist/dist",
    hook: "buildEnd",
    verbose: true,
  }),
];

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/gm_fetch.js",
        format: "umd",
        name: "GM_fetch",
        exports: "default",
        sourcemap: true,
      },
    ],
    plugins,
  },
  {
    input: "src/index.ts",
    output: [
      {
        dir: "dist/esm",
        format: "esm",
        exports: "default",
        sourcemap: true,
      },
      {
        dir: "dist",
        format: "commonjs",
        exports: "default",
        sourcemap: true,
      },
    ],
    plugins,
  },
];
