"use strict";

const webpack = require("webpack");
const path = require("path");
const packageData = require("./package.json");

const plugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(packageData.version),
    __NAME__: JSON.stringify(packageData.name)
  })
];

module.exports = {
  context: __dirname + "/src",
  entry: {
    "playkit-related": "index.ts"
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].js",
    library: ["KalturaPlayer", "plugins", "related"]
    //devtoolModuleFilenameTemplate: './dualscreen/[resource-path]'
  },
  devtool: "source-map",
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json"
        },
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
          // {
          //   loader: 'css-loader',
          //   options: {
          //     modules: {
          //       localIdentName: '[name]__[local]___[hash:base64:5]',
          //       exportLocalsConvention: 'camelCase'
          //     }
          //   }
          // },
        ]
      }
    ]
  },
  devServer: {
    contentBase: __dirname + "/src"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  externals: {
    preact: "root KalturaPlayer.ui.preact",
    "kaltura-player-js": ["KalturaPlayer"]
  }
};
