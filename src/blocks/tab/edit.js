/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {
  InspectorControls,
  InnerBlocks,
  useBlockProps,
} from "@wordpress/block-editor";
import {PanelBody, SelectControl, RadioControl} from "@wordpress/components";
import {getPatternTemplate} from "./patterns";

/**
 * Edit component for the Tab block
 */
function Edit({attributes, setAttributes}) {
  const {
    contentLayout,
    verticalAlignment,
    horizontalAlignment,
    contentWidth,
    animationEffect,
  } = attributes;

  // Get layout options
  const layoutOptions = [
    {label: __("Default", "custom-blocks"), value: "default"},
    {label: __("Columns", "custom-blocks"), value: "columns"},
    {label: __("Media & Text", "custom-blocks"), value: "media-text"},
  ];

  // Get width options
  const widthOptions = [
    {label: __("Wide", "custom-blocks"), value: "wide"},
    {label: __("Full", "custom-blocks"), value: "full"},
    {label: __("Narrow", "custom-blocks"), value: "narrow"},
  ];

  // Get animation options
  const animationOptions = [
    {label: __("None", "custom-blocks"), value: "none"},
    {label: __("Fade", "custom-blocks"), value: "fade"},
    {label: __("Slide", "custom-blocks"), value: "slide"},
    {label: __("Zoom", "custom-blocks"), value: "zoom"},
  ];
  // Initialize with pattern template if patternType is set and not yet initialized
  useEffect(() => {
    if (!initialized && patternType && getPatternTemplate) {
      const template = getPatternTemplate(patternType);
      // Create blocks from template or set inner blocks
      setInitialized(true);
    }
  }, [patternType, initialized]);

  // Prepare block props
  const blockProps = useBlockProps({
    className: `tab-content-block layout-${contentLayout} valign-${verticalAlignment} halign-${horizontalAlignment} width-${contentWidth} animation-${animationEffect}`,
  });

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__("Layout Settings", "custom-blocks")}>
          <SelectControl
            label={__("Content Layout", "custom-blocks")}
            value={contentLayout}
            options={layoutOptions}
            onChange={(value) => setAttributes({contentLayout: value})}
          />

          <SelectControl
            label={__("Content Width", "custom-blocks")}
            value={contentWidth}
            options={widthOptions}
            onChange={(value) => setAttributes({contentWidth: value})}
          />

          <RadioControl
            label={__("Vertical Alignment", "custom-blocks")}
            selected={verticalAlignment}
            options={[
              {label: __("Top", "custom-blocks"), value: "top"},
              {label: __("Center", "custom-blocks"), value: "center"},
              {label: __("Bottom", "custom-blocks"), value: "bottom"},
            ]}
            onChange={(value) => setAttributes({verticalAlignment: value})}
          />

          <RadioControl
            label={__("Horizontal Alignment", "custom-blocks")}
            selected={horizontalAlignment}
            options={[
              {label: __("Left", "custom-blocks"), value: "left"},
              {label: __("Center", "custom-blocks"), value: "center"},
              {label: __("Right", "custom-blocks"), value: "right"},
            ]}
            onChange={(value) => setAttributes({horizontalAlignment: value})}
          />
        </PanelBody>

        <PanelBody title={__("Animation Settings", "custom-blocks")}>
          <SelectControl
            label={__("Animation Effect", "custom-blocks")}
            value={animationEffect}
            options={animationOptions}
            onChange={(value) => setAttributes({animationEffect: value})}
          />
        </PanelBody>
      </InspectorControls>

      <div className="tab-content-edit-container">
        <InnerBlocks
          template={[
            [
              "core/heading",
              {level: 3, content: __("Tab Content", "custom-blocks")},
            ],
            [
              "core/paragraph",
              {content: __("Add your content here...", "custom-blocks")},
            ],
          ]}
          templateLock={false}
        />
      </div>
    </div>
  );
}

export default Edit;
