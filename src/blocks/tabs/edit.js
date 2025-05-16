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
  SelectControl,
} from "@wordpress/components";
import {useState, useEffect} from "@wordpress/element";
import {createBlock, parse} from "@wordpress/blocks";
import {useDispatch, useSelect} from "@wordpress/data";

/**
 * Internal dependencies
 */
import {getPatternTemplate} from "../tab/patterns";

/**
 * Simple function to generate a random ID
 */
const generateRandomId = (length = 8) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

function Edit({attributes, setAttributes, clientId}) {
  const {tabs, activeTab, uniqueId} = attributes;
  const [selectedTabKey, setSelectedTabKey] = useState(
    activeTab || (tabs[0] && tabs[0].id)
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState("default");

  // Get the block editor data
  const {getBlockOrder, getBlock} = useSelect((select) => {
    return select(blockEditorStore);
  }, []);

  const {insertBlock, removeBlock, replaceInnerBlocks} =
    useDispatch(blockEditorStore);

  // Generate a unique ID for the block if it doesn't exist
  useEffect(() => {
    if (!uniqueId) {
      setAttributes({uniqueId: `tabs-${generateRandomId()}`});
    }
  }, [uniqueId, setAttributes]);

  // Available patterns for tab content
  const patternOptions = [
    {label: __("Default", "custom-blocks"), value: "default"},
    {label: __("Feature Grid", "custom-blocks"), value: "feature-grid"},
    {label: __("Media Showcase", "custom-blocks"), value: "media-showcase"},
    {label: __("FAQ Accordion", "custom-blocks"), value: "faq-accordion"},
  ];

  // Get the tab layout configuration based on pattern
  const getTabLayoutConfig = (patternName) => {
    switch (patternName) {
      case "feature-grid":
        return {
          contentLayout: "columns",
          horizontalAlignment: "center",
          contentWidth: "wide",
        };
      case "media-showcase":
        return {
          contentLayout: "media-text",
          contentWidth: "full",
          animationEffect: "fade",
        };
      case "faq-accordion":
        return {
          contentLayout: "default",
          contentWidth: "narrow",
          animationEffect: "slide",
        };
      default:
        return {
          contentLayout: "default",
          horizontalAlignment: "left",
          contentWidth: "wide",
        };
    }
  };

  // Create a tab content block
  // In tabs/edit.js
  const createTabContentBlock = (tabId, patternType = "default") => {
    // Configure attributes based on pattern type
    const attributes = {
      tabId: tabId,
      patternType: patternType,
      // Add other attributes based on pattern type
    };

    // Create the tab block (the tab block itself will handle content initialization)
    return createBlock("custom-blocks/tab", attributes);
  };

  // Initialize inner blocks for tabs
  useEffect(() => {
    if (isInitialized) {
      return;
    }

    const childBlocks = getBlockOrder(clientId);

    // Only initialize if there are tabs but no child blocks
    if (tabs.length > 0 && childBlocks.length === 0) {
      // Add tab content for each tab with alternating patterns
      tabs.forEach((tab, index) => {
        // Rotate through patterns for visual interest
        const patternOptions = [
          "feature-grid",
          "media-showcase",
          "faq-accordion",
        ];
        const patternName = patternOptions[index % patternOptions.length];

        const tabBlock = createTabContentBlock(tab.id, patternName);
        insertBlock(tabBlock, undefined, clientId);
      });

      setAttributes({
        blockIds: getBlockOrder(clientId),
      });

      setIsInitialized(true);
    } else if (childBlocks.length > 0) {
      setIsInitialized(true);
    }
  }, [
    clientId,
    getBlockOrder,
    insertBlock,
    isInitialized,
    setAttributes,
    tabs,
  ]);

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
    const newTabId = `tab-${generateRandomId()}`;
    const newTab = {
      id: newTabId,
      title: `Tab ${tabs.length + 1}`,
      imageUrl: "",
      imageId: 0,
    };

    // Create a new tab content block with the selected pattern
    const tabBlock = createTabContentBlock(newTabId, selectedPattern);
    insertBlock(tabBlock, undefined, clientId);

    // Update tabs attribute
    setAttributes({
      tabs: [...tabs, newTab],
      blockIds: getBlockOrder(clientId),
      activeTab: newTabId, // Make the new tab active
    });

    // Update the selected tab
    setSelectedTabKey(newTabId);
  };

  // Handle pattern change for new tabs
  const handlePatternChange = (pattern) => {
    setSelectedPattern(pattern);
  };

  // Apply pattern to existing tab
  const applyPatternToTab = (index, patternName) => {
    const childBlocks = getBlockOrder(clientId);
    if (childBlocks[index]) {
      const blockId = childBlocks[index];
      const block = getBlock(blockId);

      if (block) {
        // Get the pattern content
        const patternContent = getPatternTemplate(patternName);
        const innerBlocks = parse(patternContent);

        // Get layout config based on selected pattern
        const layoutConfig = getTabLayoutConfig(patternName);

        // Update the block attributes
        const updatedAttributes = {
          ...block.attributes,
          ...layoutConfig,
          patternName: patternName,
        };

        // Create a new block with the updated attributes and inner blocks
        const updatedBlock = createBlock(
          block.name,
          updatedAttributes,
          innerBlocks
        );

        // Replace the block
        replaceInnerBlocks(
          clientId,
          getBlockOrder(clientId).map((id, i) =>
            i === index ? updatedBlock : getBlock(id)
          )
        );
      }
    }
  };

  // Get block props
  const blockProps = useBlockProps({
    className: `tabs-block ${uniqueId || ""}`,
  });

  return (
    <div {...blockProps}>
      <InspectorControls>
        <Panel>
          <PanelBody title={__("Tab Settings", "custom-blocks")}>
            {tabs.map((tab, index) => (
              <div key={tab.id} className="tab-settings-panel">
                <Flex
                  align="flex-start"
                  justify="space-between"
                  className="tab-header"
                >
                  <FlexBlock>
                    <h3 className="tab-title">
                      {__("Tab", "custom-blocks")} {index + 1}
                    </h3>
                  </FlexBlock>
                  <FlexItem>
                    <Button
                      isDestructive
                      isSmall
                      icon="trash"
                      onClick={() => removeTab(index)}
                      disabled={tabs.length <= 1}
                      label={__("Remove tab", "custom-blocks")}
                    />
                  </FlexItem>
                </Flex>

                <TextControl
                  label={__("Title", "custom-blocks")}
                  value={tab.title}
                  onChange={(value) => updateTab(index, "title", value)}
                />

                <div className="tab-image-upload">
                  <p>{__("Tab Image", "custom-blocks")}</p>
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
                                {__("Replace", "custom-blocks")}
                              </Button>
                              <Button
                                onClick={() => {
                                  updateTab(index, "imageUrl", "");
                                  updateTab(index, "imageId", 0);
                                }}
                                isDestructive
                                isSmall
                              >
                                {__("Remove", "custom-blocks")}
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
                            {__("Upload Image", "custom-blocks")}
                          </Button>
                        )}
                      </div>
                    )}
                  />
                </div>

                <SelectControl
                  label={__("Content Pattern", "custom-blocks")}
                  value={"default"}
                  options={patternOptions}
                  onChange={(value) => applyPatternToTab(index, value)}
                  help={__(
                    "Apply a pre-designed content pattern to this tab",
                    "custom-blocks"
                  )}
                />
              </div>
            ))}

            <div className="add-tab-panel">
              <SelectControl
                label={__("New Tab Pattern", "custom-blocks")}
                value={selectedPattern}
                options={patternOptions}
                onChange={handlePatternChange}
              />

              <Button isPrimary className="add-tab-button" onClick={addTab}>
                {__("Add Tab", "custom-blocks")}
              </Button>
            </div>
          </PanelBody>
        </Panel>
      </InspectorControls>

      <div className="wp-block-tabs-editor">
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
            aria-label={__("Add tab", "custom-blocks")}
          >
            +
          </button>
        </div>

        <div className="tabs-content">
          {getBlockOrder(clientId).map((blockId, index) => {
            //if (index >= tabs.length) return null;

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
