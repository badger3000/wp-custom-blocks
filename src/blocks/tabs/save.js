/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {useBlockProps, InnerBlocks} from "@wordpress/block-editor";

/**
 * Save component for the Tabs block
 */
function Save({attributes}) {
  const {tabs, activeTab, uniqueId} = attributes;
  const blockProps = useBlockProps.save({
    className: `tabs-block ${uniqueId}`,
  });

  return (
    <div {...blockProps}>
      <div className="tabs" data-active-tab={activeTab}>
        <div className="tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tabs-trigger ${activeTab === tab.id ? "active" : ""}`}
              data-state={activeTab === tab.id ? "active" : ""}
              data-tab-id={tab.id}
            >
              {tab.imageUrl && (
                <img src={tab.imageUrl} alt="" className="tabs-trigger-image" />
              )}
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        <div className="tabs-content">
          <InnerBlocks.Content />
        </div>
      </div>
    </div>
  );
}

export default Save;
