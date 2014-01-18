window.onload = function() {

	var codeBox = document.getElementById("scriptingspace");

	var newButton = document.getElementById("new");
	var saveButton = document.getElementById("save");
	var saveAsButton = document.getElementById("saveas");
	var openButton = document.getElementById("open");
	var runButton = document.getElementById("run");

	runButton.addEventListener('click', run);

	function run() {
		chrome.tabs.executeScript({
			code: codeBox.value
		});
	}

};