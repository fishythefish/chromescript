chrome.devtools.panels.create("ChromeScript", "icon/icon16.png", "chromescript.html", function(panel) {

});

var backgroundPageConnection = chrome.runtime.connect({
	name: "devtools-page"
});

backgroundPageConnection.onMessage.addListener(function(message) {

});

chrome.runtime.sendMessage({
	tabId: chrome.devtools.inspectedWindow.tabId,
	codeToInject: ""
});