import * as path from 'node:path'
import 'webpack-dev-server'
import { merge } from 'webpack-merge'
import { UserscriptPlugin } from 'webpack-userscript'

import type { Configuration } from 'webpack'
import type { UserscriptOptions } from 'webpack-userscript'

// TODO: replace webpack with rollup
export default (env: Record<string, string>, args: Record<string, string>) => {
  const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14)

  const commonUserscriptOptions: UserscriptOptions = {
    headers: {
      version: `${timestamp}`,
      match: '*://*.donmai.us/*',
      namespace: 'https://github.com/hdk5/danbooru.user.js',
      grant: 'none',
      homepageURL: 'https://github.com/hdk5/danbooru.user.js',
      supportURL: 'https://github.com/hdk5/danbooru.user.js/issues',
    },
    downloadBaseURL:
    'https://github.com/hdk5/danbooru.user.js/raw/master/dist/',
  }

  const commonConfig: Configuration = {
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                'solid',
              ],
            },
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: 'css-loader',
              options: {
                exportType: 'string',
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.wasm', '.ts', '.tsx', '.mjs', '.cjs', '.js', '.json'],
    },
    externals: {
      jquery: '$',
      lodash: '_',
    },
  }

  const developmentConfig: Configuration = {
    devtool: 'inline-source-map',
    devServer: {
      hot: false,
      devMiddleware: { writeToDisk: true },
    },
  }

  const productionConfig: Configuration = {}

  const blacklist2Config = {
    entry: path.resolve(__dirname, 'src', 'blacklist2.user.ts'),
    plugins: [
      new UserscriptPlugin(
        merge(commonUserscriptOptions, {
          headers: {
            name: 'Danbooru - Blacklist2',
          },
        }),
      ),
    ],
    output: {
      filename: 'blacklist2.user.js',
      path: path.resolve(__dirname, 'dist'),
    },
  }

  const tagPreviewConfig = {
    entry: path.resolve(__dirname, 'src', 'tag-preview.user.tsx'),
    plugins: [
      new UserscriptPlugin(
        merge(commonUserscriptOptions, {
          headers: {
            name: 'Danbooru - Tag Preview',
            grant: ['GM_addStyle'],
          },
        }),
      ),
    ],
    output: {
      filename: 'tag-preview.user.js',
      path: path.resolve(__dirname, 'dist'),
    },
    // externals: {
    //   'solid-js': 'import https://esm.sh/solid-js',
    //   'solid-js/web': 'import https://esm.sh/solid-js/web',
    // },
    // experiments: { outputModule: true },
    // target: 'es2020',
  }

  let config = commonConfig

  switch (args['mode']) {
    case 'development':
      config = merge(config, developmentConfig)
      break
    case 'production':
      config = merge(config, productionConfig)
      break
  }

  switch (env['target']) {
    case 'blacklist2':
      config = merge(config, blacklist2Config)
      break
    case 'tag-preview':
      config = merge(config, tagPreviewConfig)
      break
  }

  return config
}
