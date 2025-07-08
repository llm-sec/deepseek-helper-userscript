/// <reference types="chrome" />

console.log("Background service worker started.");

chrome.runtime.onInstalled.addListener(() => {
    console.log("DeepSeek Helper extension installed.");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'showNotification') {
        chrome.notifications.create(request.options);
    }
}); 