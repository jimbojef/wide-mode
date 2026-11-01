importScripts('toggle.js');

chrome.action.onClicked.addListener(async (tab) => {
  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: toggleWide,
    });
    await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#2e7d32' });
    await chrome.action.setBadgeText({ tabId: tab.id, text: result === 'on' ? 'ON' : '' });
  } catch (e) {
    // e.g. brave:// or chrome:// pages and web stores: extensions are blocked there
    await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#c62828' });
    await chrome.action.setBadgeText({ tabId: tab.id, text: '!' });
  }
});
