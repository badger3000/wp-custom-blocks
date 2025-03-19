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

    // Register blocks using block.json
    register_block_type(CUSTOM_BLOCKS_PATH . 'build/blocks/sample-block');
    
    // Register additional blocks here
    // register_block_type(CUSTOM_BLOCKS_PATH . 'build/blocks/another-block');
}
add_action('init', 'custom_blocks_register_blocks');

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
