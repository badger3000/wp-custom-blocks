/**
 * Custom Blocks Webpack Configuration
 * Basic webpack configuration ensuring all files go to block directories
 */

const path = require("path");
const fs = require("fs");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const CopyPlugin = require("copy-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

/**
 * Get entry points for all blocks
 */
function getEntryPoints() {
  const entryPoints = {};
  const blocksDir = path.resolve(process.cwd(), "src", "blocks");

  if (fs.existsSync(blocksDir)) {
    const blockFolders = fs
      .readdirSync(blocksDir, {withFileTypes: true})
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // Add each block's index.js as an entry point
    blockFolders.forEach((blockName) => {
      const blockIndexPath = path.resolve(blocksDir, blockName, "index.js");
      if (fs.existsSync(blockIndexPath)) {
        entryPoints[`blocks/${blockName}/index`] = blockIndexPath;
      }
    });
  }

  return entryPoints;
}

/**
 * Custom plugin to clean any files in the build root directory
 */
class CleanRootFilesPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap("CleanRootFilesPlugin", (compilation) => {
      const buildDir = path.resolve(process.cwd(), "build");

      if (fs.existsSync(buildDir)) {
        // Read all items in the build directory
        const items = fs.readdirSync(buildDir);

        items.forEach((item) => {
          const itemPath = path.join(buildDir, item);
          const isDirectory = fs.statSync(itemPath).isDirectory();

          // Only delete files, keep directories
          if (!isDirectory) {
            try {
              fs.unlinkSync(itemPath);
              console.log(`Removed file from build root: ${item}`);
            } catch (err) {
              console.error(`Error removing ${item}: ${err}`);
            }
          }
        });
      }
    });
  }
}

// Export webpack configuration
module.exports = {
  ...defaultConfig,

  // Only define block-specific entry points, not the main index.js
  entry: getEntryPoints(),

  output: {
    path: path.resolve(process.cwd(), "build"),
    filename: "[name].js",
  },

  plugins: [
    // Clean the build directory first
    new CleanWebpackPlugin(),

    // Copy block.json files
    new CopyPlugin({
      patterns: [
        {
          from: "**/block.json",
          to: "[path][name][ext]",
          context: "src/",
          transform(content) {
            const blockJson = JSON.parse(content.toString());

            // Update file paths in block.json
            if (blockJson.editorScript?.startsWith("file:")) {
              blockJson.editorScript = "file:./index.js";
            }
            if (blockJson.script?.startsWith("file:")) {
              blockJson.script = "file:./index.js";
            }
            if (blockJson.editorStyle?.startsWith("file:")) {
              blockJson.editorStyle = "file:./index.css";
            }
            if (blockJson.style?.startsWith("file:")) {
              blockJson.style = "file:./style-index.css";
            }

            return Buffer.from(JSON.stringify(blockJson, null, 2));
          },
        },
      ],
    }),

    // Clean any files from the build root directory
    new CleanRootFilesPlugin(),

    // Filter out unwanted default plugins
    ...defaultConfig.plugins.filter(
      (plugin) =>
        plugin.constructor.name !== "CleanWebpackPlugin" &&
        plugin.constructor.name !== "CopyPlugin"
    ),
  ],

  // Customize module rules for SCSS
  module: {
    ...defaultConfig.module,
    rules: defaultConfig.module.rules.map((rule) => {
      // Find the rule that processes SCSS files
      if (rule.test && rule.test.toString().includes("scss")) {
        return {
          ...rule,
          use: rule.use.map((loader) => {
            // Customize MiniCssExtractPlugin loader
            if (
              loader.loader &&
              loader.loader.includes("mini-css-extract-plugin")
            ) {
              return {
                ...loader,
                options: {
                  ...loader.options,
                  // Ensure CSS files go to block directories
                  moduleFilename: (pathData) => {
                    const relativePath = pathData.chunk.name;

                    // Skip files that aren't in block directories
                    if (!relativePath || !relativePath.includes("blocks/")) {
                      return "ignored.css"; // Will be cleaned up
                    }

                    const blockPath = relativePath.substring(
                      0,
                      relativePath.lastIndexOf("/")
                    );

                    // Set appropriate filename based on source
                    if (pathData.context.resource) {
                      const resource = pathData.context.resource;
                      if (resource.endsWith("editor.scss")) {
                        return `${blockPath}/index.css`;
                      } else if (resource.endsWith("style.scss")) {
                        return `${blockPath}/style-index.css`;
                      }
                    }

                    // Default fallback
                    return `${blockPath}/index.css`;
                  },
                },
              };
            }
            return loader;
          }),
        };
      }
      return rule;
    }),
  },
};
