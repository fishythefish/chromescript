var CURRENT = "currentFile";
var TEMP = "New Script";
var SUFFIX = ".cjs";
var SUFFIX_REGEX = /\.cjs$/;

window.onload = function() {

	var isSaved = true;

    document.editor = CodeMirror.fromTextArea(scriptingspace, {
        mode: "text/javascript",
        lineNumbers: true,
        lineWrapping: true,
    });


	var filePicker = document.getElementById("FilePicker");
	var codeBox = document.editor;
	var fileLabel = document.getElementById("filename");

	filePicker.addEventListener('dblclick', function() {
		var index = this.selectedIndex;
		openFile(this.children[index].value);
	});

    codeBox.on(codeBox.change, textChanged);

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
			codeBox.setValue("");
			isSaved = true;
		}
	}

	function save() {
		getCurrentFile(function(file) {
			if (file.valueOf() === TEMP.valueOf() || file === undefined) return saveAs();
			var item = {};
			item[file] = codeBox.getValue();
			chrome.storage.local.set(item, function() {
				isSaved = true;
			});
		});
	}

	function saveAs() {
		var name = prompt("Save as: ", "Enter script name");
		if (name === null) return;
		name += SUFFIX;
		chrome.storage.local.get(name, function(items) {
			if (items[name] === undefined || confirm("Script already exists. Overwrite?")) {
				setCurrentFile(name);
				var item = {};
				item[name] = codeBox.getValue();
				chrome.storage.local.set(item, function() {
					populateFiles();
					isSaved = true;
				});
			}
		});
	}

	function importFile() {

	}

	function deleteFile() {
		getCurrentFile(function(file) {
			if (codeBox.getValue().length === 0 && file.valueOf() === TEMP.valueOf()) return;
			var sure = confirm("Are you sure you want to delete this script?");
			if (sure) {
				isSaved = true;
				chrome.storage.local.remove(file, function() {
					populateFiles();
					newFile();
				});
			}
		});
	}

	function run() {
		chrome.tabs.executeScript({
			code: codeBox.getValue()
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
		option.text = name.slice(0, -SUFFIX.length);
		filePicker.add(option);
	}

	function populateFiles() {
		clearFiles();
		chrome.storage.local.get(null, function(items) {
			for (var key in items) {
				if (SUFFIX_REGEX.test(key)) {
					addFile(key);
				}
			}
		});
	}

	function closeFile() {
		return isSaved || confirm("Delete unsaved changes?");
	}

	function getCurrentFile(callback) {
		var currentFile;
		chrome.storage.local.get(CURRENT, function(items) {
			currentFile = items[CURRENT];
			if (currentFile === undefined) {
				currentFile = TEMP;
				setCurrentFile(currentFile);
			}
			callback(currentFile);
		});
	}

	function setCurrentFile(file) {
		var obj = {};
		obj[CURRENT] = file;
		chrome.storage.local.set(obj, function() {
			fileLabel.innerHTML = file;
		});
	}

	function openFile(file) {
		if (closeFile()) {
			setCurrentFile(file);
			chrome.storage.local.get(file, function(items) {
				codeBox.setvalue(items[file]);
				isSaved = true;
			});
		}
	}

};
