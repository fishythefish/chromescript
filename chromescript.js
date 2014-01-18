document.getElementById("submit").onclick(function() {
	chrome.tabs.executeScript({
		code: document.getElementById("scriptingspace").value()
	});
});