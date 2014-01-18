var CURRENT = "currentFile";
var TEMP = "New File";

window.onload = function() {

	var isSaved = true;

	var filePicker = document.getElementById("FilePicker");
	var codeBox = document.getElementById("scriptingspace");
	var fileLabel = document.getElementById("filename");

	filePicker.addEventListener('dblclick', function() {
		var index = this.selectedIndex;
		openFile(this.children[index].value);
	});
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
			setCurrentFile(TEMP);
			codeBox.value = "";
			isSaved = true;
		}
	}

	function save() {
		var file = getCurrentFile();
		if (file.valueOf() === TEMP.valueOf() || file === undefined) return saveAs();
		var item = {};
		item[file] = codeBox.value;
		chrome.storage.local.set(item);
		isSaved = true;
	}

	function saveAs() {
		var name = prompt("Save as: ", "Enter script name");
		if (name === null) return;
		name += ".js";
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
		if (codeBox.value.length === 0 && getCurrentFile().valueOf() === TEMP.valueOf()) return;
		var sure = confirm("Are you sure you want to delete this script?");
		if (sure) {
			isSaved = true;
			var file = getCurrentFile();
			chrome.storage.local.remove(file);
			populateFiles();
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
		option.value = name;
		option.text = name.slice(0, -3);
		filePicker.add(option);
	}

	function populateFiles() {
		clearFiles();
		chrome.storage.local.get(null, function(items) {
			for (var key in items) {
				if (/\.js$/.test(key)) {
					addFile(key);
				}
			}
		});
	}

	function closeFile() {
		return isSaved || confirm("Delete unsaved changes?");
	}

	function getCurrentFile() {
		var currentFile;
		chrome.storage.local.get(CURRENT, function(items) {
			currentFile = items[CURRENT];
		});
		if (currentFile === undefined) {
			currentFile = TEMP;
			setCurrentFile(currentFile);
		}
		return currentFile;
	}

	function setCurrentFile(file) {
		var obj = {};
		obj[CURRENT] = file;
		chrome.storage.local.set(obj);
		fileLabel.innerHTML=file;
	}

	function openFile(file) {
		if (closeFile()) {
			setCurrentFile(file);
			chrome.storage.local.get(file, function(items) {
				codeBox.value = items[file];
			});
			isSaved = true;
		}
	}

};