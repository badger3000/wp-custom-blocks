<?php
/**
 * Server-side rendering of the `custom-blocks/related-posts` block.
 */

function get_related_posts($attributes) {
    $current_post_id = get_the_ID();
    $filter_by = $attributes['filterBy'];
    $number_of_posts = $attributes['numberOfPosts'];
    $terms = [];
    
    // Get current post's terms
    if ($filter_by === 'categories') {
        $terms = wp_get_post_categories($current_post_id);
    } else {
        $terms = wp_get_post_tags($current_post_id, ['fields' => 'ids']);
    }
    
    if (empty($terms)) {
        return [];
    }
    
    // Query arguments
    $args = [
        'post_type' => 'post',
        'posts_per_page' => $number_of_posts,
        'post__not_in' => [$current_post_id],
        'tax_query' => [
            [
                'taxonomy' => $filter_by === 'categories' ? 'category' : 'post_tag',
                'field' => 'term_id',
                'terms' => $terms,
            ],
        ],
    ];
    
    return get_posts($args);
}

function render_block_related_posts($attributes) {
    $related_posts = get_related_posts($attributes);
    
    if (empty($related_posts)) {
        return '<div class="wp-block-custom-blocks-related-posts">
            <p>' . __('No related posts found.', 'custom-blocks') . '</p>
        </div>';
    }
    
    $output = sprintf(
        '<div class="wp-block-custom-blocks-related-posts layout-%s">
            <div class="related-posts-grid">',
        esc_attr($attributes['displayLayout'])
    );
    
    foreach ($related_posts as $post) {
        $post_link = get_permalink($post);
        $output .= '<div class="related-post-item">';
        
        if ($attributes['showFeaturedImage'] && has_post_thumbnail($post)) {
            $output .= get_the_post_thumbnail($post, 'medium');
        }
        
        $output .= sprintf(
            '<h3><a href="%s">%s</a></h3>',
            esc_url($post_link),
            esc_html(get_the_title($post))
        );
        
        if ($attributes['showExcerpt']) {
            $output .= sprintf(
                '<div class="excerpt">%s</div>',
                wp_trim_words(get_the_excerpt($post), 20)
            );
        }
        
        if ($attributes['showDate']) {
            $output .= sprintf(
                '<div class="post-date">%s</div>',
                esc_html(get_the_date('', $post))
            );
        }
        
        if ($attributes['showAuthor']) {
            $output .= sprintf(
                '<div class="post-author">%s %s</div>',
                __('By', 'custom-blocks'),
                esc_html(get_the_author_meta('display_name', $post->post_author))
            );
        }
        
        $output .= '</div>';
    }
    
    $output .= '</div></div>';
    
    return $output;
}
