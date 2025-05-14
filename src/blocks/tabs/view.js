/**
 * View script for the Tabs block
 * This script handles tab functionality on the frontend
 */

document.addEventListener("DOMContentLoaded", function () {
  initTabs();
});

/**
 * Initialize the tab functionality
 */
function initTabs() {
  const tabBlocks = document.querySelectorAll(".tabs-block");

  tabBlocks.forEach((block) => {
    const tabsContainer = block.querySelector(".tabs");
    const tabTriggers = block.querySelectorAll(".tabs-trigger");
    const tabPanes = block.querySelectorAll(".tabs-pane");

    // Set initial active tab
    const initialActiveTab = tabsContainer.getAttribute("data-active-tab");

    // Initialize active state
    tabTriggers.forEach((trigger) => {
      const tabId = trigger.getAttribute("data-tab-id");
      if (tabId === initialActiveTab) {
        trigger.setAttribute("data-state", "active");
        trigger.classList.add("active");
      } else {
        trigger.setAttribute("data-state", "");
        trigger.classList.remove("active");
      }
    });

    tabPanes.forEach((pane) => {
      const tabId = pane.getAttribute("data-tab-id");
      if (tabId === initialActiveTab) {
        pane.setAttribute("data-state", "active");
        pane.classList.add("active");
      } else {
        pane.setAttribute("data-state", "");
        pane.classList.remove("active");
      }
    });

    // Add click event listeners
    tabTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const tabId = trigger.getAttribute("data-tab-id");

        // Update active tab trigger
        tabTriggers.forEach((t) => {
          if (t.getAttribute("data-tab-id") === tabId) {
            t.setAttribute("data-state", "active");
            t.classList.add("active");
          } else {
            t.setAttribute("data-state", "");
            t.classList.remove("active");
          }
        });

        // Update active tab pane
        tabPanes.forEach((p) => {
          if (p.getAttribute("data-tab-id") === tabId) {
            p.setAttribute("data-state", "active");
            p.classList.add("active");
          } else {
            p.setAttribute("data-state", "");
            p.classList.remove("active");
          }
        });
      });
    });
  });
}
