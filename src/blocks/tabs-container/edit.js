/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {
  useBlockProps,
  InnerBlocks,
  BlockControls,
  InspectorControls,
  ColorPalette,
} from "@wordpress/block-editor";
import {
  ToolbarGroup,
  ToolbarButton,
  Button,
  PanelBody,
  SelectControl,
  RangeControl,
} from "@wordpress/components";
import {useState, useEffect} from "@wordpress/element";
import {plus} from "@wordpress/icons";
import {useSelect, useDispatch} from "@wordpress/data";

/**
 * React Tabs dependencies
 */
import {TabList, Tabs, Tab} from "react-tabs";
import "react-tabs/style/react-tabs.css";

/**
 * Internal dependencies
 */
import "./editor.scss";

/**
 * Edit function for the Tabs Container Block.
 *
 * @param {Object} props Block properties.
 * @return {JSX.Element} Block editing component.
 */
const Edit = (props) => {
  const {
    attributes: {
      tabCount,
      activeTab,
      tabsAlignment,
      tabsStyle,
      backgroundColor,
      textColor,
    },
    setAttributes,
    clientId,
  } = props;

  const [selectedTabIndex, setSelectedTabIndex] = useState(activeTab);

  const blockProps = useBlockProps({
    className: `tabs-container tabs-style-${tabsStyle} tabs-align-${tabsAlignment}`,
    style: {
      backgroundColor: backgroundColor || undefined,
      color: textColor || undefined,
    },
  });

  // Get inner blocks of this container
  const innerBlocks = useSelect(
    (select) => {
      const {getBlocks} = select("core/block-editor");
      return getBlocks(clientId);
    },
    [clientId]
  );

  // Update local state and block attribute when tab selection changes
  const handleTabSelect = (index) => {
    setSelectedTabIndex(index);
    setAttributes({activeTab: index});
  };

  // Store the tab count in attributes when inner blocks change
  useEffect(() => {
    const newTabCount = innerBlocks.length;
    if (newTabCount !== tabCount) {
      setAttributes({tabCount: newTabCount});
    }

    // If the active tab no longer exists, select the last available tab
    if (selectedTabIndex >= newTabCount && newTabCount > 0) {
      const newIndex = newTabCount - 1;
      setSelectedTabIndex(newIndex);
      setAttributes({activeTab: newIndex});
    }
  }, [innerBlocks.length, tabCount]);

  // Block editor functions
  const {insertBlock} = useDispatch("core/block-editor");

  // Add a new tab
  const addTab = () => {
    const tabBlock = wp.blocks.createBlock("custom-blocks/tab-item", {
      title: `Tab ${innerBlocks.length + 1}`,
      initialOpen: innerBlocks.length === 0,
    });
    insertBlock(tabBlock, innerBlocks.length, clientId);
  };

  // The template ensures one tab is added by default
  const TEMPLATE = [
    ["custom-blocks/tab-item", {title: "Tab 1", initialOpen: true}],
  ];

  // Create tab buttons from inner blocks
  const tabButtons = innerBlocks.map((block, index) => {
    return (
      <Tab
        key={block.clientId}
        className={`tab-title-button ${selectedTabIndex === index ? "active" : ""}`}
      >
        {block.attributes.title || `Tab ${index + 1}`}
      </Tab>
    );
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Tabs Settings", "custom-blocks")}>
          <SelectControl
            label={__("Tab Alignment", "custom-blocks")}
            value={tabsAlignment}
            options={[
              {label: __("Left", "custom-blocks"), value: "left"},
              {label: __("Center", "custom-blocks"), value: "center"},
              {label: __("Right", "custom-blocks"), value: "right"},
            ]}
            onChange={(value) => setAttributes({tabsAlignment: value})}
          />

          <SelectControl
            label={__("Tab Style", "custom-blocks")}
            value={tabsStyle}
            options={[
              {label: __("Default", "custom-blocks"), value: "default"},
              {label: __("Boxed", "custom-blocks"), value: "boxed"},
              {label: __("Line", "custom-blocks"), value: "line"},
            ]}
            onChange={(value) => setAttributes({tabsStyle: value})}
          />

          <div className="components-base-control">
            <span className="components-base-control__label">
              {__("Background Color", "custom-blocks")}
            </span>
            <ColorPalette
              value={backgroundColor}
              onChange={(color) => setAttributes({backgroundColor: color})}
            />
          </div>

          <div className="components-base-control">
            <span className="components-base-control__label">
              {__("Text Color", "custom-blocks")}
            </span>
            <ColorPalette
              value={textColor}
              onChange={(color) => setAttributes({textColor: color})}
            />
          </div>
        </PanelBody>
      </InspectorControls>

      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon={plus}
            label={__("Add Tab", "custom-blocks")}
            onClick={addTab}
          />
        </ToolbarGroup>
      </BlockControls>

      <div {...blockProps}>
        <Tabs
          selectedIndex={selectedTabIndex}
          onSelect={handleTabSelect}
          className="tabs-component"
        >
          <TabList className={`tabs-navigation tabs-align-${tabsAlignment}`}>
            {tabButtons}
            <Button
              icon={plus}
              label={__("Add Tab", "custom-blocks")}
              onClick={addTab}
              className="add-tab-button"
            />
          </TabList>

          <div className="tabs-content-container">
            <InnerBlocks
              allowedBlocks={["custom-blocks/tab-item"]}
              template={innerBlocks.length === 0 ? TEMPLATE : undefined}
              templateLock={false}
              renderAppender={false}
            />
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default Edit;
