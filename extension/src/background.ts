chrome.runtime.onInstalled.addListener(() => {
  console.log("Vtiger SmartFix: Background service worker installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "OPEN_SIDE_PANEL") {
    // In Manifest V3, we can open side panel on action click or from context menu/shortcut
    // But direct opening from content script depends on browser support
    // For now, we'll store the ticket data in session storage and suggest opening the panel
    chrome.storage.session.set({ currentTicket: message.data });
    
    // Attempt to open side panel if supported
    if (chrome.sidePanel && sender.tab?.windowId !== undefined) {
      chrome.sidePanel.open({ windowId: sender.tab.windowId });
    }
  }
});
