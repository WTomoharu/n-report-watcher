const webpack = require('webpack');

const glob = require("glob")
const dotenv = require('dotenv').config()

function getPaths(patterns) {
  return [].concat(...patterns.map(pattern => glob.sync(pattern)))
}

const manifest = require("./manifest")

const WebpackExtensionManifestPlugin = require("./webpack-plugin/manifest")
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
  // デバッグしやすいように
  mode: 'development',
  devtool: 'inline-source-map',

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: Object.fromEntries(getPaths(
    ["src/*/index.@(js|ts|jsx|tsx)", "src/contents/*/index.@(js|ts|jsx|tsx)"]
  ).map(t => (
    [t.replace(/^src\//gm, "").replace(/\.(ts|js|jsx|tsx)$/gm, ".js"), `./${t}`]
  ))),

  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/dist`,
    // 出力ファイル名
    filename: "[name]"
  },

  plugins: [
    // js・ts以外のファイルをコピー
    new CopyPlugin({
      patterns: getPaths(["@(src|public)/**/*.!(js|ts|jsx|tsx)"])
        .map(t => ({ from: `./${t}`, to: t.replace(/(^src|^public)\//gm, "") }))
    }),
    // manifest.jsonの生成
    new WebpackExtensionManifestPlugin({
      config: {
        base: manifest,
        extend: {
          name: `${manifest.name} ${process.env.BUILD_NAME || ""}`.trim()
        }
      }
    }),
    // 環境変数の注入
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed)
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    alias: {
      "@": `${__dirname}/src`,
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
    },
    extensions: ['.ts', '.js', '.jsx', '.tsx']
  },
}