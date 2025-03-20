/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {
  useBlockProps,
  InnerBlocks,
  RichText,
  BlockControls,
} from "@wordpress/block-editor";
import {ToolbarGroup, ToolbarButton} from "@wordpress/components";
import {useSelect, useDispatch} from "@wordpress/data";
import {useState, useEffect} from "@wordpress/element";
import {trash} from "@wordpress/icons";

/**
 * React Tabs dependencies
 */
import {TabPanel} from "react-tabs";

/**
 * Internal dependencies
 */
import "./editor.scss";

/**
 * Edit function for the Tab Item Block.
 *
 * @param {Object} props Block properties.
 * @return {JSX.Element} Block editing component.
 */
const Edit = (props) => {
  const {
    attributes: {title, tabId, initialOpen},
    setAttributes,
    clientId,
    isSelected,
  } = props;

  // Generate and store a unique ID for this tab if it doesn't have one yet
  useEffect(() => {
    if (!tabId) {
      setAttributes({tabId: `tab-${clientId.slice(0, 8)}`});
    }
  }, []);

  // Get parent's clientId and index of this tab
  const {parentClientId, tabIndex, isActiveTab} = useSelect(
    (select) => {
      const {getBlockParentsByBlockName, getBlockIndex, getBlock} =
        select("core/block-editor");
      const parentId = getBlockParentsByBlockName(
        clientId,
        "custom-blocks/tabs-container"
      )[0];

      // Get the parent block to check the active tab
      let activeTab = false;
      let index = -1;

      if (parentId) {
        const parentBlock = getBlock(parentId);
        index = getBlockIndex(clientId, parentId);

        if (parentBlock && parentBlock.attributes.activeTab === index) {
          activeTab = true;
        }
      }

      return {
        parentClientId: parentId,
        tabIndex: index,
        isActiveTab: activeTab,
      };
    },
    [clientId]
  );

  // Block editor functions
  const {removeBlock, updateBlockAttributes} = useDispatch("core/block-editor");

  // Remove this tab
  const removeTab = () => {
    removeBlock(clientId);
  };

  // Make this tab active in the parent
  useEffect(() => {
    if (isSelected && parentClientId && !isActiveTab) {
      updateBlockAttributes(parentClientId, {activeTab: tabIndex});
    }
  }, [isSelected, parentClientId, tabIndex]);

  // Block class based on active state
  const tabClasses = isActiveTab ? "tab-item active" : "tab-item";

  const blockProps = useBlockProps({
    className: tabClasses,
  });

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon={trash}
            label={__("Remove Tab", "custom-blocks")}
            onClick={removeTab}
          />
        </ToolbarGroup>
      </BlockControls>

      <div {...blockProps} data-tab-index={tabIndex}>
        <div className="tab-header">
          <RichText
            tagName="div"
            className="tab-title"
            value={title}
            onChange={(value) => setAttributes({title: value})}
            placeholder={__("Tab Title", "custom-blocks")}
            allowedFormats={["core/bold", "core/italic"]}
          />
        </div>

        <div className="tab-content">
          <div className="tab-inner-content">
            <InnerBlocks
              templateLock={false}
              renderAppender={
                isSelected ? InnerBlocks.ButtonBlockAppender : false
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
