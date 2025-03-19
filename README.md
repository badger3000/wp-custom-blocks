# Custom Blocks WordPress Plugin

A flexible WordPress plugin for creating custom Gutenberg blocks. This plugin provides a structured foundation for building and managing multiple custom blocks using modern WordPress development practices.

## Features

- Modular architecture for creating and maintaining multiple blocks
- Built with WordPress Scripts and Webpack for modern development
- Modern block.json metadata approach for block registration
- SCSS styling with separate editor and frontend styles
- Block inspector controls for customizing block appearance
- Organized codebase following WordPress best practices

## Plugin Structure

```
custom-blocks/                       # Plugin root directory
├── build/                           # Compiled assets (generated)
├── src/                             # Source files
│   ├── index.js                     # Main entry point
│   └── blocks/                      # Individual blocks
│       └── sample-block/            # Sample block implementation
│           ├── block.json           # Block metadata
│           ├── index.js             # Block registration
│           ├── edit.js              # Edit component
│           ├── save.js              # Save component
│           ├── style.scss           # Frontend styles
│           └── editor.scss          # Editor-only styles
├── custom-blocks.php                # Main plugin file
├── package.json                     # NPM configuration
├── webpack.config.js                # Webpack configuration
└── README.md                        # This documentation
```

## Installation

1. Clone this repository into your WordPress plugins directory:

   ```
   cd wp-content/plugins/
   ```

2. Navigate to the plugin directory:

   ```
   cd custom-blocks
   ```

3. Install dependencies:

   ```
   npm install
   ```

   If you encounter dependency conflicts, you can try one of these alternative commands:

   ```
   npm install --legacy-peer-deps
   ```

   or

   ```
   npm install --force
   ```

4. Build the assets:

   ```
   npm run build
   ```

5. Activate the plugin through the WordPress admin interface.

## Development Workflow

1. Build the plugin using the included script:

   ```
   ./build.sh
   ```

   Or manually:

   ```
   npm install --legacy-peer-deps
   npm run build
   ```

2. Start the development build with automatic rebuild on file changes:

   ```
   npm run start
   ```

3. Make changes to your block files in the `src/blocks/` directory.

## Build Structure

The plugin uses a custom webpack configuration that ensures proper file organization:

- Each block has its own subdirectory in the build output
- Only the main `index.js` and `index.asset.php` files are kept in the root
- Block-specific assets are stored in their respective directories
- Shared code chunks are organized in dedicated directories
- All CSS files are properly scoped to their respective blocks
- Each block's `block.json` file defines paths to scripts and styles

The final build structure looks like this:

```
build/
├── index.js              # Main entry point that registers all blocks
├── index.asset.php       # Asset dependencies for the main file
├── vendors/              # Shared vendor code (if any)
│   └── common/           # Common dependencies
└── blocks/               # Directory containing all blocks
    └── sample-block/     # Sample block directory
        ├── block.json    # Block metadata
        ├── index.js      # Block implementation
        ├── index.css     # Editor styles
        ├── style-index.css # Frontend styles
        └── vendors.js    # Block-specific dependencies (if any)
```

## Optimized Build Process

The webpack configuration includes several optimizations:

1. **Smart Code Splitting**: Shared dependencies are organized in logical folders
2. **Whitelist Approach**: Only essential files are kept in the root directory
3. **Block Isolation**: Each block's assets are contained in its own directory
4. **Improved Performance**: CSS processing is optimized to reduce duplicated styles

## Sample Block

The plugin comes with a sample block implementation that demonstrates key Gutenberg block concepts:

- Rich text editing with the RichText component
- Color settings for background and text
- Padding adjustment with range control
- Basic styling with SCSS
- Block preview in the editor
- Block registration and rendering

To use the sample block:

1. Edit any post or page in WordPress
2. Click the "+" icon to add a new block
3. Search for "Sample Block" and select it
4. Use the block inspector panel on the right to customize appearance

## Creating a New Block

To create a new custom block:

1. Duplicate the `sample-block` directory within `src/blocks/` and rename it to your block name (e.g., `my-new-block`).

2. Edit the files in your new block directory:

   - `block.json`: Update the metadata (name, title, description, etc.)
   - `edit.js`: Customize the editor interface and controls
   - `save.js`: Define how the block renders on the frontend
   - `style.scss`: Add frontend styling
   - `editor.scss`: Add editor-specific styling
   - `index.js`: Usually doesn't need changes as it just imports the other files

3. Import your new block in `src/index.js`:

   ```javascript
   import "./blocks/sample-block/index.js";
   import "./blocks/my-new-block/index.js";
   ```

4. Add your block to the main PHP file by adding a new `register_block_type` call in the `custom_blocks_register_blocks` function:

   ```php
   // Register blocks using block.json
   register_block_type(CUSTOM_BLOCKS_PATH . 'build/blocks/sample-block');
   register_block_type(CUSTOM_BLOCKS_PATH . 'build/blocks/my-new-block');
   ```

5. Run the build process:
   ```
   npm run build
   ```

## Advanced Usage

### CSS-only Blocks

For blocks that only require CSS (no JavaScript), you can:

1. Register the block in PHP only
2. Create a style file for the block
3. Enqueue the style file in the main plugin file

### Server-side Rendering

For blocks that require server-side rendering:

1. Create a callback function in the main plugin file
2. Register the block with the `render_callback` parameter
3. Implement the frontend rendering logic in the callback function

### Block Patterns

This plugin architecture can be extended to register block patterns:

1. Create a new file for registering block patterns
2. Define the pattern content and properties
3. Include the file in the main plugin file

## Resources

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [WordPress Scripts Package](https://developer.wordpress.org/block-editor/packages/packages-scripts/)
- [Gutenberg Components](https://developer.wordpress.org/block-editor/packages/packages-components/)

## License

This plugin is licensed under the GPL v2 or later.
