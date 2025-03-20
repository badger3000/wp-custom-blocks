/**
 * WordPress dependencies
 */
import {__} from "@wordpress/i18n";
import {useBlockProps, InnerBlocks} from "@wordpress/block-editor";

/**
 * Save function for the Tabs Container Block.
 *
 * @param {Object} props Block properties.
 * @return {JSX.Element} Block rendering component.
 */
const Save = (props) => {
  const {
    attributes: {
      activeTab,
      tabsAlignment,
      tabsStyle,
      backgroundColor,
      textColor,
    },
  } = props;

  const blockProps = useBlockProps.save({
    className: `tabs-container tabs-style-${tabsStyle} tabs-align-${tabsAlignment}`,
    style: {
      backgroundColor: backgroundColor || undefined,
      color: textColor || undefined,
    },
  });

  // Generate a unique ID for this tabs container instance
  const uniqueId = `tabs-container-${Math.floor(Math.random() * 10000)}`;

  return (
    <div {...blockProps} id={uniqueId} data-active-tab={activeTab}>
      <div className="tabs-component">
        <div className={`tabs-navigation tabs-align-${tabsAlignment}`}>
          {/* Tab buttons will be generated via JavaScript */}
        </div>
        <div className="tabs-content-container">
          <InnerBlocks.Content />
        </div>
      </div>

      {/* Client-side script for tabs functionality */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              document.addEventListener('DOMContentLoaded', function() {
                const container = document.getElementById('${uniqueId}');
                if (!container) return;
                
                const activeTabIndex = parseInt(container.getAttribute('data-active-tab')) || 0;
                const tabItems = container.querySelectorAll('.wp-block-custom-blocks-tab-item');
                const tabsNav = container.querySelector('.tabs-navigation');
                
                // Create tab buttons dynamically from tab items
                if (tabsNav && tabItems.length > 0) {
                  tabItems.forEach((item, index) => {
                    const tabButton = document.createElement('button');
                    tabButton.className = 'tab-button' + (index === activeTabIndex ? ' active' : '');
                    tabButton.setAttribute('data-tab-index', index);
                    tabButton.textContent = item.getAttribute('data-tab-title') || 'Tab ' + (index + 1);
                    
                    tabButton.addEventListener('click', function() {
                      // Deactivate all tabs
                      container.querySelectorAll('.tab-button').forEach(btn => {
                        btn.classList.remove('active');
                      });
                      tabItems.forEach(tab => {
                        tab.classList.remove('active');
                      });
                      
                      // Activate clicked tab
                      this.classList.add('active');
                      tabItems[index].classList.add('active');
                    });
                    
                    tabsNav.appendChild(tabButton);
                  });
                  
                  // Set initial active tab
                  if (tabItems[activeTabIndex]) {
                    tabItems[activeTabIndex].classList.add('active');
                  } else if (tabItems[0]) {
                    tabItems[0].classList.add('active');
                    container.querySelectorAll('.tab-button')[0]?.classList.add('active');
                  }
                }
              });
            })();
          `,
        }}
      />
    </div>
  );
};

export default Save;
