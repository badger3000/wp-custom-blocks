# Custom Blocks WordPress Plugin

A flexible WordPress plugin for creating custom Gutenberg blocks. This plugin provides a structured foundation for building and managing multiple custom blocks using modern WordPress development practices.

## Features

- Modular architecture for creating and maintaining multiple blocks
- Built with WordPress Scripts and Webpack for modern development
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

1. Start the development build with automatic rebuild on file changes:

   ```
   npm run start
   ```

2. Make changes to your block files in the `src/blocks/` directory.

3. For production build:
   ```
   npm run build
   ```

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

   - `index.js`: Update the block name, title, and other registration details
   - `edit.js`: Customize the editor interface and controls
   - `save.js`: Define how the block renders on the frontend
   - `style.scss`: Add frontend styling
   - `editor.scss`: Add editor-specific styling

3. Import your new block in `src/index.js` and add it to the registration array:

   ```javascript
   import * as myNewBlock from "./blocks/my-new-block";

   [
     sampleBlock,
     myNewBlock,
     // Add more blocks here
   ].forEach(registerBlock);
   ```

4. Add your block to the main PHP file by adding a new `register_block_type` call in the `custom_blocks_register_blocks` function:

   ```php
   register_block_type('custom-blocks/my-new-block', array(
       'editor_script' => 'custom-blocks-editor-script',
       'editor_style'  => 'custom-blocks-editor-style',
       'style'         => 'custom-blocks-frontend-style',
   ));
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
