const path = require("path");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/client/ts/main.ts",
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {},
    ],
  },
  resolve: {},
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "assets", "js"),
    clean: true,
  },
};
