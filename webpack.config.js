/**
 * External dependencies
 */
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

/**
 * WordPress dependencies
 */
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

/**
 * Custom webpack configuration
 */
module.exports = {
  ...defaultConfig,
  entry: {
    index: path.resolve(process.cwd(), "src", "index.js"),
  },
  plugins: [
    ...defaultConfig.plugins,
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!fonts/**", "!images/**"],
    }),
  ],
};
