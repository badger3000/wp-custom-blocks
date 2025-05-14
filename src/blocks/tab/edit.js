/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {
  InnerBlocks,
  useBlockProps,
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
  useInnerBlocksProps,
} from "@wordpress/block-editor";
import {
  Panel,
  PanelBody,
  SelectControl,
  ToggleControl,
  Button,
  ButtonGroup,
  Flex,
  FlexItem,
  __experimentalBoxControl as BoxControl,
} from "@wordpress/components";

/**
 * Edit component for the Tab Content block
 *
 * @param {Object} props Block props
 * @return {JSX.Element} Block edit component
 */
function Edit({attributes, setAttributes, clientId}) {
  const {
    contentLayout,
    verticalAlignment,
    horizontalAlignment,
    contentWidth,
    animationEffect,
  } = attributes;

  // Define allowed blocks - allow everything except the parent tabs block
  const ALLOWED_BLOCKS = ["core/*"];

  // Block patterns to showcase in the block inserter
  const TEMPLATE = [
    [
      "core/heading",
      {level: 3, content: __("Tab Content Heading", "my-plugin")},
    ],
    [
      "core/paragraph",
      {
        content: __(
          "Add content for this tab here. You can use any blocks or patterns.",
          "my-plugin"
        ),
      },
    ],
  ];

  // Set block props with additional classes based on attributes
  const blockProps = useBlockProps({
    className: `tab-content-block layout-${contentLayout} valign-${verticalAlignment} halign-${horizontalAlignment} width-${contentWidth} animation-${animationEffect}`,
  });

  // Set inner blocks props
  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    allowedBlocks: ALLOWED_BLOCKS,
    template: TEMPLATE,
    templateLock: false,
    renderAppender: () => <InnerBlocks.ButtonBlockAppender />,
  });

  // Layout options
  const layoutOptions = [
    {value: "default", label: __("Default", "my-plugin")},
    {value: "columns", label: __("Columns", "my-plugin")},
    {value: "cards", label: __("Cards", "my-plugin")},
    {value: "media-text", label: __("Media & Text", "my-plugin")},
  ];

  // Animation options
  const animationOptions = [
    {value: "none", label: __("None", "my-plugin")},
    {value: "fade", label: __("Fade In", "my-plugin")},
    {value: "slide", label: __("Slide In", "my-plugin")},
    {value: "zoom", label: __("Zoom In", "my-plugin")},
  ];

  // Content width options
  const widthOptions = [
    {value: "wide", label: __("Wide", "my-plugin")},
    {value: "narrow", label: __("Narrow", "my-plugin")},
    {value: "full", label: __("Full Width", "my-plugin")},
  ];

  return (
    <>
      <BlockControls>
        <AlignmentToolbar
          value={horizontalAlignment}
          onChange={(value) =>
            setAttributes({horizontalAlignment: value || "left"})
          }
        />
      </BlockControls>

      <InspectorControls>
        <Panel>
          <PanelBody
            title={__("Content Settings", "my-plugin")}
            initialOpen={true}
          >
            <SelectControl
              label={__("Layout Type", "my-plugin")}
              value={contentLayout}
              options={layoutOptions}
              onChange={(value) => setAttributes({contentLayout: value})}
              help={__(
                "Select a layout preset for this tab content",
                "my-plugin"
              )}
            />

            <SelectControl
              label={__("Content Width", "my-plugin")}
              value={contentWidth}
              options={widthOptions}
              onChange={(value) => setAttributes({contentWidth: value})}
            />

            <p>{__("Vertical Alignment", "my-plugin")}</p>
            <ButtonGroup>
              <Button
                isSmall
                isPrimary={verticalAlignment === "top"}
                isSecondary={verticalAlignment !== "top"}
                onClick={() => setAttributes({verticalAlignment: "top"})}
              >
                {__("Top", "my-plugin")}
              </Button>
              <Button
                isSmall
                isPrimary={verticalAlignment === "center"}
                isSecondary={verticalAlignment !== "center"}
                onClick={() => setAttributes({verticalAlignment: "center"})}
              >
                {__("Center", "my-plugin")}
              </Button>
              <Button
                isSmall
                isPrimary={verticalAlignment === "bottom"}
                isSecondary={verticalAlignment !== "bottom"}
                onClick={() => setAttributes({verticalAlignment: "bottom"})}
              >
                {__("Bottom", "my-plugin")}
              </Button>
            </ButtonGroup>
          </PanelBody>

          <PanelBody title={__("Animation", "my-plugin")} initialOpen={false}>
            <SelectControl
              label={__("Tab Reveal Animation", "my-plugin")}
              value={animationEffect}
              options={animationOptions}
              onChange={(value) => setAttributes({animationEffect: value})}
              help={__("Animation when tab is revealed", "my-plugin")}
            />
          </PanelBody>

          <PanelBody title={__("Presets", "my-plugin")} initialOpen={false}>
            <p>{__("Quick Layout Presets", "my-plugin")}</p>
            <Flex gap={2} justify="flex-start" align="flex-start" wrap={true}>
              <FlexItem style={{flexBasis: "48%", marginBottom: "10px"}}>
                <Button
                  isSecondary
                  className="layout-preset-button"
                  onClick={() => {
                    setAttributes({
                      contentLayout: "default",
                      contentWidth: "wide",
                      verticalAlignment: "top",
                      horizontalAlignment: "left",
                      animationEffect: "none",
                    });
                  }}
                >
                  {__("Default", "my-plugin")}
                </Button>
              </FlexItem>
              <FlexItem style={{flexBasis: "48%", marginBottom: "10px"}}>
                <Button
                  isSecondary
                  className="layout-preset-button"
                  onClick={() => {
                    setAttributes({
                      contentLayout: "columns",
                      contentWidth: "full",
                      verticalAlignment: "top",
                      horizontalAlignment: "center",
                      animationEffect: "fade",
                    });
                  }}
                >
                  {__("Featured Content", "my-plugin")}
                </Button>
              </FlexItem>
              <FlexItem style={{flexBasis: "48%", marginBottom: "10px"}}>
                <Button
                  isSecondary
                  className="layout-preset-button"
                  onClick={() => {
                    setAttributes({
                      contentLayout: "cards",
                      contentWidth: "narrow",
                      verticalAlignment: "center",
                      horizontalAlignment: "center",
                      animationEffect: "slide",
                    });
                  }}
                >
                  {__("Card Group", "my-plugin")}
                </Button>
              </FlexItem>
              <FlexItem style={{flexBasis: "48%", marginBottom: "10px"}}>
                <Button
                  isSecondary
                  className="layout-preset-button"
                  onClick={() => {
                    setAttributes({
                      contentLayout: "media-text",
                      contentWidth: "wide",
                      verticalAlignment: "center",
                      horizontalAlignment: "left",
                      animationEffect: "zoom",
                    });
                  }}
                >
                  {__("Media Showcase", "my-plugin")}
                </Button>
              </FlexItem>
            </Flex>
          </PanelBody>
        </Panel>
      </InspectorControls>

      <div {...innerBlocksProps} />
    </>
  );
}

export default Edit;
