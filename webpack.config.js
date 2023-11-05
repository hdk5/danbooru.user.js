import * as path from 'node:path'
import * as url from 'node:url'
import 'webpack-dev-server'
import { merge } from 'webpack-merge'
import { UserscriptPlugin } from 'webpack-userscript'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default (env, args) => {
  const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14)

  /** @type {import('webpack-userscript').UserscriptOptions} */
  const commonUserscriptOptions = {
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

  /** @type {import('webpack').Configuration} */
  const commonConfig = {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.wasm', '.ts', '.tsx', '.mjs', '.cjs', '.js', '.json'],
    },
  }

  /** @type {import('webpack').Configuration} */
  const developmentConfig = {
    devtool: 'inline-source-map',
    devServer: {
      hot: false,
      devMiddleware: { writeToDisk: true },
    },
  }

  /** @type {import('webpack').Configuration} */
  const productionConfig = {
  }

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

  let config = commonConfig

  switch (args.mode) {
    case 'development':
      config = merge(config, developmentConfig)
      break
    case 'production':
      config = merge(config, productionConfig)
      break
  }

  switch (env.target) {
    case 'blacklist2':
      config = merge(config, blacklist2Config)
      break
  }

  return config
}
