import * as path from "path";

import ESLintPlugin from "eslint-webpack-plugin";
import { Configuration } from "webpack";
import "webpack-dev-server";
import { UserscriptPlugin } from "webpack-userscript";

const config: Configuration = {
  entry: path.resolve(__dirname, "src", "index.ts"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      extensions: ["ts"],
      cache: true,
      threads: true,
      emitWarning: true,
    }),
    new UserscriptPlugin({
      headers: {
        name: "Danbooru - Blacklist2",
        match: "*://*.donmai.us/*",
        namespace: "danbooru.hdk5",
        grant: "none",
        homepageURL: "https://github.com/hdk5/danbooru-blacklist2",
        supportURL: "https://github.com/hdk5/danbooru-blacklist2/issues",
        installURL:
          "https://github.com/hdk5/danbooru-blacklist2/raw/master/dist/danbooru-blacklist2.user.js",
        updateURL:
          "https://github.com/hdk5/danbooru-blacklist2/raw/master/dist/danbooru-blacklist2.user.js",
      },
      proxyScript: {},
    }),
  ],
  resolve: {
    extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "danbooru-blacklist2.user.js",
  },
  devtool: "source-map",
  devServer: {
    hot: false,
    devMiddleware: { writeToDisk: true },
  },
};

export default config;
