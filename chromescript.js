window.onload = function() {

	var currentFile;
	var isSaved = true;

	var filePicker = document.getElementById("FilePicker");
	var codeBox = document.getElementById("scriptingspace");

	codeBox.addEventListener('onkeydown', textChanged);

	populateFiles();

	var newButton = document.getElementById("new");
	var saveButton = document.getElementById("save");
	var saveAsButton = document.getElementById("saveas");
	var importButton = document.getElementById("import");
	var runButton = document.getElementById("run");

	newButton.addEventListener('click', newFile);
	saveButton.addEventListener('click', save);
	saveAsButton.addEventListener('click', saveAs);
	importButton.addEventListener('click', importFile);
	runButton.addEventListener('click', run);

	function textChanged() {
		isSaved = false;
	}

	function newFile() {

	}

	function save() {
		isSaved = true;
	}

	function saveAs() {
		var name = prompt("Save as: ", "Enter script name");
		chrome.storage.local.get(name, function(items) {
			if (items[name] === undefined || confirm("Script already exists. Overwrite?")) {
				var item = {};
				item[name] = codeBox.value;
				chrome.storage.local.set(item);
				populateFiles();
				isSaved = true;
			}
		});
	}

	function importFile() {

	}

	function run() {
		chrome.tabs.executeScript({
			code: codeBox.value
		});
	}

	function clearFiles() {
		while (filePicker.length > 0) {
			filePicker.remove(0);
		}
	}

	function addFile(name) {
		var option = document.createElement("option");
		option.text = name;
		filePicker.add(option);
	}

	function populateFiles() {
		clearFiles();
		chrome.storage.local.get(null, function(items) {
			for (var key in items) {
				addFile(key);
			}
		});
	}

	function closeFile() {
		if (isSaved) return;
		prompt("")
	}

};