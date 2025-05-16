<?php
/**
 * Server-side rendering of the Tab block
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the block content.
 */
function render_block_tab($attributes, $content, $block) {
    // Extract attributes
    $content_layout = $attributes['contentLayout'] ?? 'default';
    $vertical_alignment = $attributes['verticalAlignment'] ?? 'top';
    $horizontal_alignment = $attributes['horizontalAlignment'] ?? 'left';
    $content_width = $attributes['contentWidth'] ?? 'wide';
    $animation_effect = $attributes['animationEffect'] ?? 'none';
    $tab_id = $attributes['tabId'] ?? '';
    
    // Get tab ID from custom attribute or from parent block context
    if (empty($tab_id) && !empty($block->context['custom-blocks/tabId'])) {
        $tab_id = $block->context['custom-blocks/tabId'];
    }
    
    // Generate class names
    $classes = [
        'tab-content-block',
        'tabs-pane',
        "layout-{$content_layout}",
        "valign-{$vertical_alignment}",
        "halign-{$horizontal_alignment}",
        "width-{$content_width}",
        "animation-{$animation_effect}",
    ];
    
    // Get wrapper attributes (for block supports like color, spacing, etc.)
    $wrapper_attributes = get_block_wrapper_attributes([
        'class' => implode(' ', $classes),
        'data-tab-id' => $tab_id,
    ]);
    
    // Build output
    $output = sprintf(
        '<div %1$s>%2$s</div>',
        $wrapper_attributes,
        $content
    );
    
    return $output;
}
function render_tab_content_block( $attributes, $content, $block ) {
    // Extract attributes
    $content_layout = isset( $attributes['contentLayout'] ) ? $attributes['contentLayout'] : 'default';
    $vertical_alignment = isset( $attributes['verticalAlignment'] ) ? $attributes['verticalAlignment'] : 'top';
    $horizontal_alignment = isset( $attributes['horizontalAlignment'] ) ? $attributes['horizontalAlignment'] : 'left';
    $content_width = isset( $attributes['contentWidth'] ) ? $attributes['contentWidth'] : 'wide';
    $animation_effect = isset( $attributes['animationEffect'] ) ? $attributes['animationEffect'] : 'none';
    $tab_id = isset( $attributes['tabId'] ) ? $attributes['tabId'] : '';
    
    // Generate class names based on attributes
    $class_names = array(
        'tab-content-block',
        'tabs-pane',
        'layout-' . esc_attr( $content_layout ),
        'valign-' . esc_attr( $vertical_alignment ),
        'halign-' . esc_attr( $horizontal_alignment ),
        'width-' . esc_attr( $content_width ),
        'animation-' . esc_attr( $animation_effect ),
    );
    
    // Get inner blocks content
    $inner_content = $block->inner_blocks_content;
    
    // Start building the output
    $output = '<div class="' . esc_attr( implode( ' ', $class_names ) ) . '" data-tab-id="' . esc_attr( $tab_id ) . '">';
    $output .= $inner_content;
    $output .= '</div>';
    
    return $output;
}

/**
 * Server-side rendering of the Tabs block
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 *
 * @return string Returns the block content.
 */
function render_block_tabs($attributes, $content, $block) {
    // Extract attributes
    $tabs = $attributes['tabs'] ?? [];
    $active_tab = $attributes['activeTab'] ?? '';
    $unique_id = $attributes['uniqueId'] ?? 'tabs-' . uniqid();
    
    // If there are no tabs, return the content as-is
    if (empty($tabs)) {
        return $content;
    }
    
    // Get wrapper attributes with our custom class
    $wrapper_attributes = get_block_wrapper_attributes([
        'class' => 'tabs-block ' . $unique_id,
    ]);
    
    // Start building output
    $output = "<div {$wrapper_attributes}>";
    $output .= "<div class='tabs' data-active-tab='" . esc_attr($active_tab) . "'>";
    
    // Build tabs list
    $output .= "<div class='tabs-list'>";
    foreach($tabs as $tab) {
        $is_active = ($active_tab === $tab['id']) ? 'active' : '';
        $data_state = ($active_tab === $tab['id']) ? 'active' : '';
        
        $output .= "<button class='tabs-trigger " . esc_attr($is_active) . "' ";
        $output .= "data-state='" . esc_attr($data_state) . "' ";
        $output .= "data-tab-id='" . esc_attr($tab['id']) . "'>";
        
        if (!empty($tab['imageUrl'])) {
            $output .= "<img src='" . esc_url($tab['imageUrl']) . "' alt='' class='tabs-trigger-image'>";
        }
        
        $output .= "<span>" . esc_html($tab['title']) . "</span>";
        $output .= "</button>";
    }
    $output .= "</div>"; // End tabs-list
    
    // Add tabs content with block content
    $output .= "<div class='tabs-content'>";
    
    // Process inner blocks (apply the tabId to each tab child block via context)
    $tab_contents = [];
    
    if (!empty($block->inner_blocks)) {
        foreach($tabs as $index => $tab) {
            // Only process blocks that exist
            if (isset($block->inner_blocks[$index])) {
                $inner_block = $block->inner_blocks[$index];
                
                // Create context with tab ID to pass to child blocks
                $context = ['custom-blocks/tabId' => $tab['id']];
                
                // Get tab content with context
                $tab_content = $inner_block->render(['custom-blocks/tabId' => $tab['id']]);
                
                // Build pane wrapper
                $is_active = ($active_tab === $tab['id']) ? 'active' : '';
                $data_state = ($active_tab === $tab['id']) ? 'active' : '';
                
                $tab_contents[] = sprintf(
                    '<div class="tabs-pane %1$s" data-state="%2$s" data-tab-id="%3$s">%4$s</div>',
                    esc_attr($is_active),
                    esc_attr($data_state),
                    esc_attr($tab['id']),
                    $tab_content
                );
            }
        }
    }
    
    $output .= implode('', $tab_contents);
    $output .= "</div>"; // End tabs-content
    
    $output .= "</div>"; // End tabs
    $output .= "</div>"; // End tabs-block
    
    return $output;
}