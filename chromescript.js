window.onload = function() {

	if (getCurrentFile() === undefined) {
		setCurrentFile("tempChromeScript");
	}
	var isSaved = true;

	var filePicker = document.getElementById("FilePicker");
	var codeBox = document.getElementById("scriptingspace");

	codeBox.addEventListener('input', textChanged);

	populateFiles();

	var newButton = document.getElementById("new");
	var saveButton = document.getElementById("save");
	var saveAsButton = document.getElementById("saveas");
	var importButton = document.getElementById("import");
	var deleteButton = document.getElementById("delete");
	var runButton = document.getElementById("run");

	newButton.addEventListener('click', newFile);
	saveButton.addEventListener('click', save);
	saveAsButton.addEventListener('click', saveAs);
	importButton.addEventListener('click', importFile);
	deleteButton.addEventListener('click', deleteFile);
	runButton.addEventListener('click', run);

	function textChanged() {
		isSaved = false;
	}

	function newFile() {
		if (closeFile()) {
			setCurrentFile("tempChromeScript");
			codeBox.value = "";
		}
	}

	function save() {
		var file = getCurrentFile();
		if (file === "tempChromeScript" || file === undefined) return saveAs();
		var item = {};
		item[file] = codeBox.value;
		chrome.storage.local.set(item);
		isSaved = true;
	}

	function saveAs() {
		var name = prompt("Save as: ", "Enter script name") + ".js";
		chrome.storage.local.get(name, function(items) {
			if (items[name] === undefined || confirm("Script already exists. Overwrite?")) {
				setCurrentFile(name);
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

	function deleteFile() {
		var sure = confirm("Are you sure you want to delete this script?");
		if (sure) {
			var file = getCurrentFile();
			chrome.storage.local.remove(file);
			newFile();
		}
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
				if (/\.js$/.test(key)) {
					addFile(key.slice(0, -3));
				}
			}
		});
	}

	function closeFile() {
		return isSaved || confirm("Delete unsaved changes?");
	}

	function getCurrentFile() {
		var currentFile;
		chrome.storage.local.get("currentFile", function(items) {
			currentFile = items["currentFile"];
		});
		return currentFile;
	}

	function setCurrentFile(file) {
		var obj = {};
		obj["currentFile"] = file;
		chrome.storage.local.set(obj);
	}

};