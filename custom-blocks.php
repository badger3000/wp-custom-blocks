<?php
/**
 * Plugin Name: Custom Blocks
 * Description: A flexible plugin for creating custom Gutenberg blocks
 * Version: 1.0.0
 * Author: WordPress Developer
 * Text Domain: custom-blocks
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('CUSTOM_BLOCKS_PATH', plugin_dir_path(__FILE__));
define('CUSTOM_BLOCKS_URL', plugin_dir_url(__FILE__));
define('CUSTOM_BLOCKS_VERSION', '1.0.0');

/**
 * Register blocks and their assets
 */
function custom_blocks_register_blocks() {
    // Check if Gutenberg is available
    if (!function_exists('register_block_type')) {
        return;
    }

    // Register script & style for blocks
    wp_register_script(
        'custom-blocks-editor-script',
        CUSTOM_BLOCKS_URL . 'build/index.js',
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components'),
        CUSTOM_BLOCKS_VERSION,
        true
    );

    wp_register_style(
        'custom-blocks-editor-style',
        CUSTOM_BLOCKS_URL . 'build/index.css',
        array('wp-edit-blocks'),
        CUSTOM_BLOCKS_VERSION
    );

    wp_register_style(
        'custom-blocks-frontend-style',
        CUSTOM_BLOCKS_URL . 'build/style-index.css',
        array(),
        CUSTOM_BLOCKS_VERSION
    );

    // Register blocks - the registration is handled in JS through registerBlockType
    register_block_type('custom-blocks/sample-block', array(
        'editor_script' => 'custom-blocks-editor-script',
        'editor_style'  => 'custom-blocks-editor-style',
        'style'         => 'custom-blocks-frontend-style',
    ));
}
add_action('init', 'custom_blocks_register_blocks');

/**
 * Enqueue block assets
 */
function custom_blocks_enqueue_block_assets() {
    // Only load if Gutenberg is available
    if (!function_exists('register_block_type')) {
        return;
    }

    // Make block data available to JS
    wp_localize_script(
        'custom-blocks-editor-script',
        'customBlocksData',
        array(
            'pluginUrl' => CUSTOM_BLOCKS_URL,
        )
    );
}
add_action('enqueue_block_editor_assets', 'custom_blocks_enqueue_block_assets');

/**
 * Plugin activation
 */
function custom_blocks_activate() {
    // Activation code, if needed
}
register_activation_hook(__FILE__, 'custom_blocks_activate');

/**
 * Plugin deactivation
 */
function custom_blocks_deactivate() {
    // Deactivation code, if needed
}
register_deactivation_hook(__FILE__, 'custom_blocks_deactivate');
