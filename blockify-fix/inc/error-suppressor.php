<?php

/**
 * Error Suppressor for WordPress 6.7+ textdomain issues
 * Must be loaded first before any other code
 *
 * @package Blockify
 */

// Only run this code if we're not already in an error state
if (!defined('BLOCKIFY_ERROR_SUPPRESSION_ACTIVE')) {
    define('BLOCKIFY_ERROR_SUPPRESSION_ACTIVE', true);

    // Suppress textdomain warnings by setting WP_DEBUG_DISPLAY to false
    if (!defined('WP_DEBUG_DISPLAY')) {
        define('WP_DEBUG_DISPLAY', false);
    }

    // Option 1: Buffer output to prevent "headers already sent" errors
    // Only do this if we're not in the admin-ajax.php context (which could break AJAX)
    if (!defined('DOING_AJAX') && !isset($_SERVER['REQUEST_URI']) || strpos($_SERVER['REQUEST_URI'], 'admin-ajax.php') === false) {
        ob_start();
    }

    // Option 2: Suppress only the specific textdomain warnings
    add_filter('doing_it_wrong_trigger_error', function ($trigger, $function) {
        if ($function === '_load_textdomain_just_in_time') {
            return false; // Don't trigger error for this specific function
        }
        return $trigger;
    }, 10, 2);
}

// Let the rest of WordPress load normally