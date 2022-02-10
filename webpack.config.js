const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  devtool: "inline-source-map",
  watchOptions: {
    ignored: /node_modules/,
  },
  entry: {
    main: "./src/client/ts/main.ts",
    videoPlayer: "./src/client/ts/videoPlayer.ts",
    videoRecorder: "./src/client/ts/videoRecorder.ts",
    thumbnailVideo: "./src/client/ts/thumbnailVideo.ts",
    comment: "./src/client/ts/comment.ts",
  },
  plugins: [new MiniCssExtractPlugin({ filename: "css/style.css" })],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
};
