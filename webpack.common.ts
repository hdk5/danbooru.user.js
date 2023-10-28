import * as path from "path";

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
    new UserscriptPlugin({
      headers: {
        name: "Danbooru - Blacklist2",
        match: "*://*.donmai.us/*",
        namespace: "danbooru.hdk5",
        grant: "none",
        homepageURL: "https://github.com/hdk5/danbooru-blacklist2",
        supportURL: "https://github.com/hdk5/danbooru-blacklist2/issues",
      },
      downloadBaseURL:
        "https://github.com/hdk5/danbooru-blacklist2/raw/master/dist/",
    }),
  ],
  resolve: {
    extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json"],
  },
  output: {
    filename: "danbooru-blacklist2.user.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};

export default config;
