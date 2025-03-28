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
    // Check if we're in the block editor
    $is_editor = defined('REST_REQUEST') && REST_REQUEST;
    
    if ($is_editor) {
        return '<div class="wp-block-custom-blocks-related-posts">
            <p>' . __('Related posts carousel will appear here on the live site.', 'custom-blocks') . '</p>
        </div>';
    }
    
    // Get related posts
    $related_posts = get_related_posts($attributes);
    
    if (empty($related_posts)) {
        return '<div class="wp-block-custom-blocks-related-posts">
            <p>' . __('No related posts found.', 'custom-blocks') . '</p>
        </div>';
    }
    
    // Get fallback image URL
    $fallback_image = plugins_url('assets/images/placeholder.svg', dirname(dirname(dirname(__FILE__))));

    // Start output
    $output = sprintf(
        '<div class="wp-block-custom-blocks-related-posts" data-slides-per-view="%d" data-autoplay="%s" data-delay="%d" data-loop="%s">',
        isset($attributes['slidesPerView']) ? intval($attributes['slidesPerView']) : 3,
        isset($attributes['autoplay']) ? 'true' : 'false',
        isset($attributes['autoplayDelay']) ? intval($attributes['autoplayDelay']) : 3000,
        isset($attributes['loop']) ? 'true' : 'false'
    );
    
    // Add Swiper container
    $output .= '<div class="swiper">
        <div class="swiper-wrapper">';
    
    foreach ($related_posts as $related_post) {
        $post_link = get_permalink($related_post);
        $image = get_the_post_thumbnail_url($related_post->ID, 'medium');
        if (!$image) {
            $image = $fallback_image;
        }
        
        $tags = get_the_tags($related_post->ID);
        $first_tag = $tags ? $tags[0]->name : '';
        
        $output .= '<div class="swiper-slide">
            <a href="' . esc_url($post_link) . '" class="related-post-card">';
            
        // Image container
        $output .= '<div class="card-image">';
        $output .= sprintf(
            '<img src="%s" alt="%s" loading="lazy" />',
            esc_url($image),
            esc_attr($related_post->post_title)
        );
        
        // Show tag if enabled and exists
        if (isset($attributes['showTags']) && $attributes['showTags'] && $first_tag) {
            $output .= sprintf(
                '<span class="card-tag">%s</span>',
                esc_html($first_tag)
            );
        }
        $output .= '</div>';

        // Content container
        $output .= '<div class="card-content">';
        
        $output .= '<h3 class="card-title">' . esc_html(get_the_title($related_post)) . '</h3>';
        
        if (isset($attributes['showExcerpt']) && $attributes['showExcerpt']) {
            $output .= '<div class="card-excerpt">' . wp_trim_words(get_the_excerpt($related_post), 15) . '</div>';
        }
        
        if (isset($attributes['showDate']) && $attributes['showDate']) {
            $output .= '<div class="card-date">' . esc_html(get_the_date('', $related_post)) . '</div>';
        }
        
        $output .= '</div>'; // End card-content
        
        $output .= '</a></div>';
    }
    
    $output .= '</div>
        <div class="swiper-pagination"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    </div></div>';
    
    return $output;
}
