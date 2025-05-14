<?php
/**
 * Server-side rendering of the Tab Content block
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the block content.
 */
function render_tab_content_block( $attributes, $content, $block ) {
    // Extract attributes
    $content_layout = isset( $attributes['contentLayout'] ) ? $attributes['contentLayout'] : 'default';
    $vertical_alignment = isset( $attributes['verticalAlignment'] ) ? $attributes['verticalAlignment'] : 'top';
    $horizontal_alignment = isset( $attributes['horizontalAlignment'] ) ? $attributes['horizontalAlignment'] : 'left';
    $content_width = isset( $attributes['contentWidth'] ) ? $attributes['contentWidth'] : 'wide';
    $animation_effect = isset( $attributes['animationEffect'] ) ? $attributes['animationEffect'] : 'none';
    
    // Generate class names based on attributes
    $class_names = array(
        'tab-content-block',
        'layout-' . esc_attr( $content_layout ),
        'valign-' . esc_attr( $vertical_alignment ),
        'halign-' . esc_attr( $horizontal_alignment ),
        'width-' . esc_attr( $content_width ),
        'animation-' . esc_attr( $animation_effect ),
    );
    
    // Get inner blocks content
    $inner_content = $block->inner_blocks_content;
    
    // Start building the output
    $output = '<div class="' . esc_attr( implode( ' ', $class_names ) ) . '">';
    $output .= $inner_content;
    $output .= '</div>';
    
    return $output;
}

/**
 * Register the dynamic block.
 *
 * @return void
 */
function register_block_my_plugin_tab_content() {
    register_block_type( __DIR__, array(
        'render_callback' => 'render_tab_content_block',
    ) );
}

add_action( 'init', 'register_block_my_plugin_tab_content' );