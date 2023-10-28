import { merge } from "webpack-merge";

import ESLintPlugin from "eslint-webpack-plugin";
import { Configuration } from "webpack";

import common from "./webpack.common";

const config: Configuration = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new ESLintPlugin({
      extensions: ["ts"],
      cache: true,
      threads: true,
      emitWarning: true,
    }),
  ],
  devServer: {
    hot: false,
    devMiddleware: { writeToDisk: true },
  },
});

export default config;
