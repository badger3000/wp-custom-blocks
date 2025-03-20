/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {useBlockProps, InnerBlocks} from "@wordpress/block-editor";

/**
 * Save function for the Tab Item Block.
 *
 * @param {Object} props Block properties.
 * @return {JSX.Element} Block rendering component.
 */
const Save = (props) => {
  const {
    attributes: {title, tabId, initialOpen},
  } = props;

  const blockProps = useBlockProps.save({
    className: "tab-item",
    "data-tab-title": title,
    "data-tab-id": tabId,
  });

  return (
    <div {...blockProps}>
      <div className="tab-content">
        <div className="tab-inner-content">
          <InnerBlocks.Content />
        </div>
      </div>
    </div>
  );
};

export default Save;
