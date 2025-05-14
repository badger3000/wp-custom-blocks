/**
 * WordPress dependencies
 */
import {useBlockProps, InnerBlocks} from "@wordpress/block-editor";

/**
 * Save component for the Tab Content block
 *
 * @param {Object} props Block props
 * @return {JSX.Element} Block save component
 */
function Save({attributes}) {
  const {
    contentLayout,
    verticalAlignment,
    horizontalAlignment,
    contentWidth,
    animationEffect,
  } = attributes;

  // Set block props with classes based on attributes
  const blockProps = useBlockProps.save({
    className: `tab-content-block layout-${contentLayout} valign-${verticalAlignment} halign-${horizontalAlignment} width-${contentWidth} animation-${animationEffect}`,
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}

export default Save;
