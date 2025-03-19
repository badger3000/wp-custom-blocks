/**
 * External dependencies
 */
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * Get block name from a file path
 */
function getBlockNameFromPath(filePath) {
  const parts = filePath.split("/");
  const blockIndex = parts.indexOf("blocks");
  if (blockIndex !== -1 && parts.length > blockIndex + 1) {
    return parts[blockIndex + 1];
  }
  return null;
}

/**
 * Find blocks in the src directory
 */
const fs = require("fs");
function getBlockEntryPoints() {
  const entryPoints = {
    // Only include the main index.js - this is necessary to register blocks
    index: path.resolve(process.cwd(), "src", "index.js"),
  };

  // Check if blocks directory exists
  const blocksDir = path.resolve(process.cwd(), "src", "blocks");
  if (fs.existsSync(blocksDir)) {
    // Get all block directories
    const blockFolders = fs
      .readdirSync(blocksDir, {withFileTypes: true})
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    // Add each block as an entry point
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
 * Custom webpack configuration
 */
module.exports = {
  ...defaultConfig,
  entry: getBlockEntryPoints(),
  output: {
    path: path.resolve(process.cwd(), "build"),
    filename: "[name].js",
  },
  plugins: [
    // Filter out the default MiniCssExtractPlugin and replace with our own
    ...defaultConfig.plugins.filter(
      (plugin) =>
        // Keep all plugins except MiniCssExtractPlugin and StyleLintPlugin
        plugin.constructor.name !== "MiniCssExtractPlugin" &&
        plugin.constructor.name !== "StylelintWebpackPlugin"
    ),
    // Add our customized MiniCssExtractPlugin
    new MiniCssExtractPlugin({
      filename: ({chunk}) => {
        // Check if chunk or chunk.name is null/undefined
        if (!chunk || !chunk.name) {
          return "[name].css";
        }

        // We only want CSS files in block directories, not in the root
        if (chunk.name === "index") {
          // For the main index file
          return "index.css";
        }

        // For block styles
        if (chunk.name.includes("blocks/")) {
          // For editor styles (simplified approach)
          if (chunk.name.endsWith("editor")) {
            const blockPath = chunk.name.substring(
              0,
              chunk.name.lastIndexOf("/")
            );
            return `${blockPath}/index.css`;
          }
          // Main block style
          if (chunk.name.endsWith("index")) {
            const blockPath = chunk.name.substring(
              0,
              chunk.name.lastIndexOf("/")
            );
            return `${blockPath}/style-index.css`;
          }
        }

        // Default fallback
        return "[name].css";
      },
    }),
    // Clean everything first
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!fonts/**", "!images/**"],
    }),
    // Copy block.json files to build directory
    new CopyPlugin({
      patterns: [
        {
          from: "**/block.json",
          to: "[path][name][ext]",
          context: "src/",
          noErrorOnMissing: true,
          transform(content, absoluteFrom) {
            const blockName = getBlockNameFromPath(absoluteFrom);
            if (!blockName) return content;

            // Update paths in block.json to point to built files
            const blockJson = JSON.parse(content.toString());

            // Update file paths if needed
            if (
              blockJson.editorScript &&
              blockJson.editorScript.startsWith("file:")
            ) {
              blockJson.editorScript = "file:./index.js";
            }
            if (blockJson.script && blockJson.script.startsWith("file:")) {
              blockJson.script = "file:./index.js";
            }
            if (
              blockJson.editorStyle &&
              blockJson.editorStyle.startsWith("file:")
            ) {
              blockJson.editorStyle = "file:./index.css";
            }
            if (blockJson.style && blockJson.style.startsWith("file:")) {
              blockJson.style = "file:./style-index.css";
            }

            return Buffer.from(JSON.stringify(blockJson, null, 2));
          },
        },
      ],
    }),
    // Delete unwanted files from root after build (needs to run after all other plugins)
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap(
          "DeleteUnwantedRootFiles",
          (compilation) => {
            // Files to KEEP in the root directory (whitelist approach)
            const whitelistedFiles = new Set(["index.js", "index.asset.php"]);

            // Get absolute path to build directory
            const buildDir = path.resolve(process.cwd(), "build");

            // Read all files in the root build directory
            try {
              const files = fs.readdirSync(buildDir);

              // Filter for files only (not directories) and not in whitelist
              files.forEach((file) => {
                const filePath = path.join(buildDir, file);
                const isDirectory = fs.statSync(filePath).isDirectory();

                // Skip directories and whitelisted files
                if (isDirectory || whitelistedFiles.has(file)) {
                  return;
                }

                // Delete the file
                try {
                  fs.unlinkSync(filePath);
                  console.log(
                    `Deleted ${file} from build root (not whitelisted)`
                  );
                } catch (err) {
                  console.error(`Error deleting ${file}: ${err}`);
                }
              });
            } catch (err) {
              console.error(`Error reading build directory: ${err}`);
            }
          }
        );
      },
    },
  ],
  optimization: {
    ...defaultConfig.optimization,
    // Configure code splitting more precisely
    splitChunks: {
      chunks: "all",
      automaticNameDelimiter: "-",
      cacheGroups: {
        // Process style chunks
        style: {
          name(module, chunks, cacheGroupKey) {
            // Don't create style chunks for the main index
            if (chunks.some((chunk) => chunk.name === "index")) {
              return null;
            }

            // For block styles, keep them with their block
            if (
              chunks.some(
                (chunk) => chunk.name && chunk.name.includes("blocks/")
              )
            ) {
              // Get the block path from the chunk name (blocks/sample-block/index -> blocks/sample-block)
              const chunkName = chunks[0].name;
              const blockPath = chunkName.substring(
                0,
                chunkName.lastIndexOf("/")
              );
              return `${blockPath}/style-index`;
            }

            return defaultConfig.optimization.splitChunks.cacheGroups.style.name(
              module,
              chunks,
              cacheGroupKey
            );
          },
          test: defaultConfig.optimization.splitChunks.cacheGroups.style.test,
          chunks: "all",
          enforce: true,
        },

        // Process shared code chunks
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module, chunks, cacheGroupKey) {
            // If it's used by a block, put it in the block's directory
            if (
              chunks.some(
                (chunk) => chunk.name && chunk.name.includes("blocks/")
              )
            ) {
              const chunkName = chunks[0].name;
              const blockPath = chunkName.substring(
                0,
                chunkName.lastIndexOf("/")
              );
              return `${blockPath}/vendors`;
            }
            // Otherwise put it in a vendors directory to avoid cluttering the root
            return "vendors/common";
          },
          priority: -10,
          chunks: "all",
        },

        // Fallback for any other chunks
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
          name(module, chunks, cacheGroupKey) {
            // Always put chunks in a dedicated directory
            return "chunks/common";
          },
        },
      },
    },
  },
};
