/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {
  useBlockProps,
  RichText,
  InspectorControls,
} from "@wordpress/block-editor";
import {PanelBody, ColorPalette, RangeControl} from "@wordpress/components";

/**
 * Internal dependencies
 */
import "./editor.scss";

/**
 * Edit function for the Sample Block.
 *
 * @param {Object} props Block properties.
 * @return {JSX.Element} Block editing component.
 */
const Edit = (props) => {
  const {
    attributes: {content, backgroundColor, textColor, padding},
    setAttributes,
  } = props;

  const blockProps = useBlockProps({
    style: {
      backgroundColor,
      color: textColor,
      padding: `${padding}px`,
    },
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Block Settings", "custom-blocks")}>
          <div className="custom-blocks-color-settings">
            <div className="custom-blocks-color-setting">
              <h2>{__("Background Color", "custom-blocks")}</h2>
              <ColorPalette
                value={backgroundColor}
                onChange={(color) => setAttributes({backgroundColor: color})}
              />
            </div>
            <div className="custom-blocks-color-setting">
              <h2>{__("Text Color", "custom-blocks")}</h2>
              <ColorPalette
                value={textColor}
                onChange={(color) => setAttributes({textColor: color})}
              />
            </div>
          </div>
          <RangeControl
            label={__("Padding", "custom-blocks")}
            value={padding}
            onChange={(value) => setAttributes({padding: value})}
            min={0}
            max={100}
          />
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <RichText
          tagName="p"
          value={content}
          onChange={(value) => setAttributes({content: value})}
          placeholder={__("Enter content here...", "custom-blocks")}
        />
      </div>
    </>
  );
};

export default Edit;
