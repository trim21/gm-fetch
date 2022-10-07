const path = require("path");

const pkg = require("./package.json");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    library: {
      name: "GM_fetch",
      type: "global",
      export: "default",
    },
    path: path.join(__dirname, "dist"),
    filename: path.basename(pkg.jsdelivr),
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        use: {
          loader: "esbuild-loader",
          options: {
            loader: "ts",
            target: "ES2020",
          },
        },
      },
    ],
  },
};
