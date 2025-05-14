/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {
  InspectorControls,
  InnerBlocks,
  useBlockProps,
  MediaUpload,
  store as blockEditorStore,
} from "@wordpress/block-editor";
import {
  Panel,
  PanelBody,
  TextControl,
  Button,
  Flex,
  FlexItem,
  FlexBlock,
  Disabled,
} from "@wordpress/components";
import {useState, useEffect} from "@wordpress/element";
import {createBlock} from "@wordpress/blocks";
import {useDispatch, useSelect} from "@wordpress/data";
import {store as coreStore} from "@wordpress/core-data";

/**
 * External dependencies
 */
import {v4 as uuidv4} from "uuid";

/**
 * Edit component for the Shadcn Tabs block
 *
 * @param {Object} props Block props
 * @return {JSX.Element} Block edit component
 */
function Edit({attributes, setAttributes, clientId}) {
  const {tabs, activeTab, uniqueId} = attributes;
  const [selectedTabKey, setSelectedTabKey] = useState(activeTab);

  // Generate a unique ID for the block if it doesn't exist
  useEffect(() => {
    if (!uniqueId) {
      setAttributes({uniqueId: `shadcn-tabs-${uuidv4().slice(0, 8)}`});
    }
  }, []);

  // Get the block editor data
  const {getBlockOrder, getBlock} = useSelect((select) => {
    return select(blockEditorStore);
  }, []);

  const {insertBlock, updateBlockAttributes, removeBlock} =
    useDispatch(blockEditorStore);

  // Initialize inner blocks for tabs if they don't exist
  useEffect(() => {
    const childBlocks = getBlockOrder(clientId);

    if (childBlocks.length === 0 && tabs.length > 0) {
      // Create inner blocks for each tab
      tabs.forEach((tab) => {
        const innerBlock = createBlock("core/group", {
          className: `tab-content tab-${tab.id}`,
          "data-tab-id": tab.id,
        });
        insertBlock(innerBlock, undefined, clientId);
      });
    }

    // Update blockIds attribute to keep track of inner blocks
    setAttributes({
      blockIds: getBlockOrder(clientId),
    });
  }, []);

  // Handle tab update
  const updateTab = (index, property, value) => {
    const newTabs = [...tabs];
    newTabs[index][property] = value;
    setAttributes({tabs: newTabs});
  };

  // Handle tab selection
  const handleTabSelect = (tabKey) => {
    setSelectedTabKey(tabKey);
    setAttributes({activeTab: tabKey});
  };

  // Remove tab at specified index
  const removeTab = (indexToRemove) => {
    if (tabs.length <= 1) {
      return; // Don't remove the last tab
    }

    // Get child blocks
    const childBlocks = getBlockOrder(clientId);

    // Remove corresponding inner block
    if (childBlocks[indexToRemove]) {
      removeBlock(childBlocks[indexToRemove]);
    }

    // Remove tab from tabs array
    const newTabs = tabs.filter((_, index) => index !== indexToRemove);

    // Update active tab if necessary
    let newActiveTab = activeTab;
    if (newTabs.length > 0 && !newTabs.find((tab) => tab.id === activeTab)) {
      newActiveTab = newTabs[0].id;
      setSelectedTabKey(newActiveTab);
    }

    // Update attributes
    setAttributes({
      tabs: newTabs,
      activeTab: newActiveTab,
      blockIds: getBlockOrder(clientId).filter(
        (_, index) => index !== indexToRemove
      ),
    });
  };

  // Add a new tab
  const addTab = () => {
    const newTabId = `tab-${uuidv4().slice(0, 8)}`;
    const newTab = {
      id: newTabId,
      title: `Tab ${tabs.length + 1}`,
      imageUrl: "",
      imageId: 0,
    };

    // Create a new inner block for the tab
    const innerBlock = createBlock("core/group", {
      className: `tab-content tab-${newTabId}`,
      "data-tab-id": newTabId,
    });
    insertBlock(innerBlock, undefined, clientId);

    // Update tabs attribute
    setAttributes({
      tabs: [...tabs, newTab],
      blockIds: getBlockOrder(clientId),
    });
  };

  // Get block props
  const blockProps = useBlockProps({
    className: `shadcn-tabs-block ${uniqueId}`,
  });

  return (
    <div {...blockProps}>
      <InspectorControls>
        <Panel>
          <PanelBody title={__("Tab Settings", "my-plugin")}>
            {tabs.map((tab, index) => (
              <div key={tab.id} className="tab-settings-panel">
                <Flex
                  align="flex-start"
                  justify="space-between"
                  className="tab-header"
                >
                  <FlexBlock>
                    <h3 className="tab-title">
                      {__("Tab", "my-plugin")} {index + 1}
                    </h3>
                  </FlexBlock>
                  <FlexItem>
                    <Button
                      isDestructive
                      isSmall
                      icon="trash"
                      onClick={() => removeTab(index)}
                      disabled={tabs.length <= 1}
                      label={__("Remove tab", "my-plugin")}
                    />
                  </FlexItem>
                </Flex>

                <TextControl
                  label={__("Title", "my-plugin")}
                  value={tab.title}
                  onChange={(value) => updateTab(index, "title", value)}
                />

                <div className="tab-image-upload">
                  <p>{__("Tab Image", "my-plugin")}</p>
                  <MediaUpload
                    onSelect={(media) => {
                      updateTab(index, "imageUrl", media.url);
                      updateTab(index, "imageId", media.id);
                    }}
                    allowedTypes={["image"]}
                    value={tab.imageId}
                    render={({open}) => (
                      <div className="tab-image-controls">
                        {tab.imageUrl ? (
                          <div className="tab-image-preview">
                            <img
                              src={tab.imageUrl}
                              alt={tab.title}
                              className="tab-thumbnail"
                            />
                            <Flex gap={2} className="tab-image-buttons">
                              <Button onClick={open} isSecondary isSmall>
                                {__("Replace", "my-plugin")}
                              </Button>
                              <Button
                                onClick={() => {
                                  updateTab(index, "imageUrl", "");
                                  updateTab(index, "imageId", 0);
                                }}
                                isDestructive
                                isSmall
                              >
                                {__("Remove", "my-plugin")}
                              </Button>
                            </Flex>
                          </div>
                        ) : (
                          <Button
                            onClick={open}
                            isPrimary
                            isSmall
                            className="tab-upload-button"
                          >
                            {__("Upload Image", "my-plugin")}
                          </Button>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button isPrimary className="add-tab-button" onClick={addTab}>
              {__("Add Tab", "my-plugin")}
            </Button>
          </PanelBody>
        </Panel>
      </InspectorControls>

      <div className="wp-block-shadcn-tabs-editor">
        <div className="tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${
                selectedTabKey === tab.id ? "active" : ""
              }`}
              onClick={() => handleTabSelect(tab.id)}
              data-tab-id={tab.id}
            >
              {tab.imageUrl && (
                <img src={tab.imageUrl} alt="" className="tab-image" />
              )}
              <span>{tab.title}</span>
            </button>
          ))}
          <button
            className="add-tab-inline"
            onClick={addTab}
            aria-label={__("Add tab", "my-plugin")}
          >
            +
          </button>
        </div>

        <div className="tabs-content">
          {getBlockOrder(clientId).map((blockId, index) => {
            if (index >= tabs.length) return null;

            const block = getBlock(blockId);
            const tabId = tabs[index].id;

            return (
              <div
                key={blockId}
                className={`tab-panel ${
                  selectedTabKey === tabId ? "active" : "hidden"
                }`}
                style={{display: selectedTabKey === tabId ? "block" : "none"}}
                data-tab-id={tabId}
              >
                <InnerBlocks
                  renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
                  templateLock={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Edit;
