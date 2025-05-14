/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {useBlockProps, InnerBlocks} from "@wordpress/block-editor";

/**
 * Save component for the Shadcn Tabs block
 *
 * @param {Object} props Block props
 * @return {JSX.Element} Block save component
 */
function Save({attributes}) {
  const {tabs, activeTab, uniqueId} = attributes;
  const blockProps = useBlockProps.save({
    className: `shadcn-tabs-block ${uniqueId}`,
  });

  return (
    <div {...blockProps}>
      <div className="shadcn-tabs" data-active-tab={activeTab}>
        <div className="shadcn-tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`shadcn-tabs-trigger ${
                activeTab === tab.id ? "active" : ""
              }`}
              data-state={activeTab === tab.id ? "active" : ""}
              data-tab-id={tab.id}
            >
              {tab.imageUrl && (
                <img
                  src={tab.imageUrl}
                  alt=""
                  className="shadcn-tabs-trigger-image"
                />
              )}
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        <div className="shadcn-tabs-content">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`shadcn-tabs-pane ${
                activeTab === tab.id ? "active" : ""
              }`}
              data-state={activeTab === tab.id ? "active" : ""}
              data-tab-id={tab.id}
            >
              <div className="tab-content">
                <InnerBlocks.Content />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Save;
