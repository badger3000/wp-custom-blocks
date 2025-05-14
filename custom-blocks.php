<?php
/**
 * Plugin Name:       Custom Blocks
 * Description:       Custom blocks for WordPress.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:          0.1.0
 * Author:           Your Name
 * License:          GPL-2.0-or-later
 * License URI:      https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:      custom-blocks
 *
 * @package          create-block
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Registers the block using the metadata loaded from the `block.json` manifest.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_custom_blocks_block_init() {
    // Register blocks
    register_block_type(__DIR__ . '/build/blocks/calculator');
    register_block_type(__DIR__ . '/build/blocks/sample-block');
    register_block_type(__DIR__ . '/build/blocks/tabs');
    register_block_type(__DIR__ . '/build/blocks/tab');
    
    // Register related posts block with explicit render callback
    $related_posts_metadata = wp_json_file_decode(__DIR__ . '/build/blocks/related-posts/block.json', ['associative' => true]);
    register_block_type(__DIR__ . '/build/blocks/related-posts', [
        'render_callback' => 'render_block_related_posts',
        'attributes' => $related_posts_metadata['attributes'] ?? []
    ]);
}
add_action('init', 'create_block_custom_blocks_block_init');

// Ensure render function is available
require_once __DIR__ . '/src/blocks/related-posts/render.php';
require_once __DIR__ . '/src/blocks/tab/render.php';

/**
 * Enqueue block scripts and localize data
 */
function custom_blocks_enqueue_scripts() {
    if (has_block('custom-blocks/calculator')) {
        wp_localize_script('custom-blocks-calculator-view-script', 'calculatorData', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('calculator_email_nonce')
        ));
    }
    // Only enqueue Swiper assets if the related posts block is present
    if (has_block('custom-blocks/related-posts')) {
        wp_enqueue_style(
            'swiper',
            'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
            [],
            '11.0.5'
        );
    }
}
add_action('wp_enqueue_scripts', 'custom_blocks_enqueue_scripts');

// Customize email sender for calculator emails
function calculator_email_from($original_email_address) {
    return 'calculator@yourdomain.com'; // Replace with your desired from email
}

function calculator_email_from_name($original_email_from) {
    return 'Debt Calculator'; // Replace with your desired from name
}

// Add these filters before the handle_calculator_email function
add_filter('wp_mail_from', 'calculator_email_from');
add_filter('wp_mail_from_name', 'calculator_email_from_name');

/**
 * Handle sending calculator results via email
 */
function handle_calculator_email() {
    // Verify nonce for security
    if (!check_ajax_referer('calculator_email_nonce', 'nonce', false)) {
        wp_send_json_error('Invalid security token');
        return;
    }

    // Get POST data
    $email = sanitize_email($_POST['email']);
    $balance = floatval($_POST['balance']);
    $interest = floatval($_POST['interest']);
    $debt_type = sanitize_text_field($_POST['debtType']);
    $monthly = floatval($_POST['monthly']);
    $months = intval($_POST['months']);
    $principal = floatval($_POST['principal']);
    $total_interest = floatval($_POST['totalInterest']);

    // Validate email
    if (!is_email($email)) {
        wp_send_json_error('Invalid email address');
        return;
    }

    // Create email content
    $subject = 'Your Debt Calculator Results';
    $message = sprintf(
        'Here are your debt calculation results:

Debt Type: %s
Balance Owed: $%s
Interest Rate: %s%%
Monthly Payment: $%s

Months to Pay Off: %s
Total Principal: $%s
Total Interest: $%s

Thank you for using our Debt Calculator!',
        ucwords(str_replace('-', ' ', $debt_type)),
        number_format($balance, 2),
        number_format($interest, 1),
        number_format($monthly, 2),
        $months,
        number_format($principal, 2),
        number_format($total_interest, 2)
    );

    // Set up email headers with BCC
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'Bcc: admin@yourdomain.com' // Replace with your desired BCC email
    );
    
    // Send email
    $sent = wp_mail($email, $subject, $message, $headers);

    if ($sent) {
        wp_send_json_success('Email sent successfully');
    } else {
        wp_send_json_error('Failed to send email');
    }
}
add_action('wp_ajax_send_calculator_results', 'handle_calculator_email');
add_action('wp_ajax_nopriv_send_calculator_results', 'handle_calculator_email');

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
