// Extension icon click handler
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Get current window ID
    const windowId = tab.windowId;

    // Open Side Panel
    await chrome.sidePanel.open({ windowId });
  } catch (error) {
    console.error('Failed to open Side Panel:', error);
  }
});
