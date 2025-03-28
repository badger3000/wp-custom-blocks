import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default function Edit({ attributes, setAttributes }) {
    const {
        filterBy,
        numberOfPosts,
        displayLayout,
        showFeaturedImage,
        showExcerpt,
        showDate,
        showAuthor,
    } = attributes;

    // Get current post's categories and tags
    const postData = useSelect((select) => {
        const { getCurrentPostId } = select('core/editor');
        const { getEntityRecord } = select(coreStore);
        const postId = getCurrentPostId();
        const post = getEntityRecord('postType', 'post', postId);
        
        return {
            categories: post?.categories || [],
            tags: post?.tags || [],
        };
    }, []);

    // Get related posts based on current post's terms
    const relatedPosts = useSelect((select) => {
        const { getEntityRecords } = select(coreStore);
        const query = {
            per_page: numberOfPosts,
            _embed: true,
        };

        if (filterBy === 'categories' && postData.categories.length) {
            query.categories = postData.categories;
        } else if (filterBy === 'tags' && postData.tags.length) {
            query.tags = postData.tags;
        }

        return getEntityRecords('postType', 'post', query);
    }, [numberOfPosts, filterBy, postData]);

    const blockProps = useBlockProps({
        className: `related-posts-block layout-${displayLayout}`,
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Related Posts Settings', 'custom-blocks')}>
                    <SelectControl
                        label={__('Filter By', 'custom-blocks')}
                        value={filterBy}
                        options={[
                            { label: 'Categories', value: 'categories' },
                            { label: 'Tags', value: 'tags' },
                        ]}
                        onChange={(value) => setAttributes({ filterBy: value })}
                    />
                    <RangeControl
                        label={__('Number of Posts', 'custom-blocks')}
                        value={numberOfPosts}
                        onChange={(value) => setAttributes({ numberOfPosts: value })}
                        min={1}
                        max={6}
                    />
                    <SelectControl
                        label={__('Display Layout', 'custom-blocks')}
                        value={displayLayout}
                        options={[
                            { label: 'Grid', value: 'grid' },
                            { label: 'List', value: 'list' },
                        ]}
                        onChange={(value) => setAttributes({ displayLayout: value })}
                    />
                    <ToggleControl
                        label={__('Show Featured Image', 'custom-blocks')}
                        checked={showFeaturedImage}
                        onChange={() => setAttributes({ showFeaturedImage: !showFeaturedImage })}
                    />
                    <ToggleControl
                        label={__('Show Excerpt', 'custom-blocks')}
                        checked={showExcerpt}
                        onChange={() => setAttributes({ showExcerpt: !showExcerpt })}
                    />
                    <ToggleControl
                        label={__('Show Date', 'custom-blocks')}
                        checked={showDate}
                        onChange={() => setAttributes({ showDate: !showDate })}
                    />
                    <ToggleControl
                        label={__('Show Author', 'custom-blocks')}
                        checked={showAuthor}
                        onChange={() => setAttributes({ showAuthor: !showAuthor })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="related-posts-grid">
                    {relatedPosts?.map((post) => (
                        <div key={post.id} className="related-post-item">
                            {showFeaturedImage && post._embedded?.['wp:featuredmedia'] && (
                                <img
                                    src={post._embedded['wp:featuredmedia'][0].source_url}
                                    alt={post.title.rendered}
                                />
                            )}
                            <h3>{post.title.rendered}</h3>
                            {showExcerpt && (
                                <div
                                    className="excerpt"
                                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                                />
                            )}
                            {showDate && (
                                <div className="post-date">
                                    {new Date(post.date).toLocaleDateString()}
                                </div>
                            )}
                            {showAuthor && post._embedded?.author && (
                                <div className="post-author">
                                    {__('By', 'custom-blocks')} {post._embedded.author[0].name}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
