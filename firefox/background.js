// Extension icon click handler
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Firefox: Use sidebarAction API
    if (typeof browser !== 'undefined' && browser.sidebarAction) {
      await browser.sidebarAction.open();
    } else if (typeof chrome !== 'undefined' && chrome.sidePanel) {
      // Chrome: Use sidePanel API
      const windowId = tab.windowId;
      await chrome.sidePanel.open({ windowId });
    }
  } catch (error) {
    console.error('Failed to open sidebar:', error);
  }
});
