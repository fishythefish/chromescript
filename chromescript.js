window.onload = function() {
	var codeBox = document.getElementById("scriptingspace");
	var runButton = document.getElementById("submit");

	runButton.onclick = function() {
		chrome.tabs.executeScript({
			//code: codeBox.value
			code: 'alert("Hello")'
		});
	};
};