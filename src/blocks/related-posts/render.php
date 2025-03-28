<?php
/**
 * Server-side rendering of the `custom-blocks/related-posts` block.
 */

function get_related_posts($attributes) {
    global $post;
    
    // Force debug output to error log
    error_log('Related Posts - Starting get_related_posts function');
    
    // Get post ID in FSE context
    $current_post_id = 0;
    
    // First try the global post object
    if (isset($post) && is_object($post)) {
        $current_post_id = $post->ID;
        error_log('Related Posts - Got ID from global post: ' . $current_post_id);
    }
    
    // Then try get_the_ID()
    if (!$current_post_id) {
        $current_post_id = get_the_ID();
        error_log('Related Posts - Got ID from get_the_ID(): ' . $current_post_id);
    }
    
    // Finally try get_queried_object
    if (!$current_post_id) {
        $queried_object = get_queried_object();
        if ($queried_object instanceof WP_Post) {
            $current_post_id = $queried_object->ID;
            error_log('Related Posts - Got ID from queried object: ' . $current_post_id);
        }
    }
    
    error_log('Related Posts - Final Post ID: ' . $current_post_id);
    error_log('Related Posts - Post Type: ' . get_post_type($current_post_id));
    
    // Get current post's terms
    $filter_by = isset($attributes['filterBy']) ? $attributes['filterBy'] : 'categories';
    $number_of_posts = isset($attributes['numberOfPosts']) ? $attributes['numberOfPosts'] : 3;
    
    if ($filter_by === 'categories') {
        $terms = wp_get_post_categories($current_post_id, ['fields' => 'ids']);
    } else {
        $terms = wp_get_post_tags($current_post_id, ['fields' => 'ids']);
    }
    
    error_log('Related Posts - Terms found: ' . print_r($terms, true));
    
    if (empty($terms)) {
        error_log('Related Posts - No terms found');
        return [];
    }
    
    // Query arguments
    $args = [
        'post_type' => 'post',
        'posts_per_page' => $number_of_posts,
        'post__not_in' => [$current_post_id],
        'orderby' => 'rand',
        'tax_query' => [
            [
                'taxonomy' => $filter_by === 'categories' ? 'category' : 'post_tag',
                'field' => 'term_id',
                'terms' => $terms,
            ],
        ],
    ];
    
    // Query for posts
    $query = new WP_Query($args);
    error_log('Related Posts - Query SQL: ' . $query->request);
    error_log('Related Posts - Posts found: ' . $query->post_count);
    
    return $query->posts;
}

function render_block_related_posts($attributes, $content, $block = null) {
    error_log('Related Posts - Starting render function');
    error_log('Related Posts - Block context: ' . print_r($block, true));
    
    // Check if we're in the block editor
    $is_editor = defined('REST_REQUEST') && REST_REQUEST;
    
    if ($is_editor) {
        return '<div class="wp-block-custom-blocks-related-posts">
            <p>' . __('Related posts will appear here on the live site.', 'custom-blocks') . '</p>
        </div>';
    }
    
    // Get related posts
    $related_posts = get_related_posts($attributes);
    
    // Start output
    $output = '';
    
    // Add debug info for admins
    if (current_user_can('manage_options')) {
        global $post;
        $output .= '<div style="background: #f0f0f0; padding: 10px; margin: 10px 0; border: 1px solid #ccc;">';
        $output .= '<strong>Related Posts Debug:</strong><br>';
        $output .= 'Current Post ID: ' . (isset($post) ? $post->ID : 'No global post') . '<br>';
        $output .= 'get_the_ID(): ' . get_the_ID() . '<br>';
        $output .= 'is_single(): ' . (is_single() ? 'true' : 'false') . '<br>';
        $output .= 'Found Posts: ' . count($related_posts) . '<br>';
        $output .= '</div>';
    }
    
    if (empty($related_posts)) {
        return $output . '<div class="wp-block-custom-blocks-related-posts">
            <p>' . __('No related posts found.', 'custom-blocks') . '</p>
        </div>';
    }
    
    $output .= sprintf(
        '<div class="wp-block-custom-blocks-related-posts layout-%s">
            <div class="related-posts-grid">',
        isset($attributes['displayLayout']) ? esc_attr($attributes['displayLayout']) : 'grid'
    );
    
    foreach ($related_posts as $related_post) {
        $post_link = get_permalink($related_post);
        $output .= '<div class="related-post-item">';
        
        if (isset($attributes['showFeaturedImage']) && $attributes['showFeaturedImage'] && has_post_thumbnail($related_post)) {
            $output .= get_the_post_thumbnail($related_post, 'medium');
        }
        
        $output .= sprintf(
            '<h3><a href="%s">%s</a></h3>',
            esc_url($post_link),
            esc_html(get_the_title($related_post))
        );
        
        if (isset($attributes['showExcerpt']) && $attributes['showExcerpt']) {
            $output .= sprintf(
                '<div class="excerpt">%s</div>',
                wp_trim_words(get_the_excerpt($related_post), 20)
            );
        }
        
        if (isset($attributes['showDate']) && $attributes['showDate']) {
            $output .= sprintf(
                '<div class="post-date">%s</div>',
                esc_html(get_the_date('', $related_post))
            );
        }
        
        if (isset($attributes['showAuthor']) && $attributes['showAuthor']) {
            $output .= sprintf(
                '<div class="post-author">%s %s</div>',
                __('By', 'custom-blocks'),
                esc_html(get_the_author_meta('display_name', $related_post->post_author))
            );
        }
        
        $output .= '</div>';
    }
    
    $output .= '</div></div>';
    
    return $output;
}
