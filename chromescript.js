window.onload = function() {
	var codeBox = document.getElementById("scriptingspace");
	var runButton = document.getElementById("run");

	runButton.onclick = function() {
		chrome.tabs.executeScript({
			code: codeBox.value
		});
	};
};