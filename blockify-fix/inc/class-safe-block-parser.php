<?php

/**
 * Safe Block Parser
 *
 * Provides a safe version of WP_Block_Parser that handles null values correctly.
 *
 * @package Blockify
 */

// Load the WordPress block parser class if not already loaded
if (!class_exists('WP_Block_Parser')) {
    require_once ABSPATH . WPINC . '/class-wp-block-parser.php';
}

/**
 * Safe Block Parser class
 * 
 * Extends the WordPress block parser to handle null values safely.
 */
class Safe_WP_Block_Parser extends WP_Block_Parser
{
    /**
     * Parses a document and returns an array of parsed blocks.
     *
     * @param string $document Input document being parsed.
     * @return array An array of parsed block objects.
     */
    public function parse($document)
    {
        // Make sure document is never null
        if ($document === null) {
            $document = '';
        }

        return parent::parse($document);
    }
}

/**
 * Register our custom block parser class
 */
function blockify_register_safe_block_parser()
{
    // Now register our custom parser
    add_filter('block_parser_class', function () {
        return 'Safe_WP_Block_Parser';
    });
}
add_action('init', 'blockify_register_safe_block_parser', 0);
