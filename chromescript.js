var CURRENT = "currentFile";
var TEMP = "New Script";
var SUFFIX = ".cjs";
var SUFFIX_REGEX = /\.cjs$/;
var editor;

window.onload = function() {

	setCurrentFile(TEMP).then(function() {});
	chrome.storage.local.get(TEMP, function(items) {
		codeBox.setValue(items[TEMP]);
	});
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

	codeBox.focus();
    codeBox.on("change", textChanged);
    codeBox.on("blur", codeBlur);

	populateFiles().then(function() {});

	var newButton = document.getElementById("new");
	var saveButton = document.getElementById("save");
	var saveAsButton = document.getElementById("saveas");
	var deleteButton = document.getElementById("delete");
	var runButton = document.getElementById("run");

	newButton.addEventListener('click', newFile);
	saveButton.addEventListener('click', save);
	saveAsButton.addEventListener('click', saveAs);
	deleteButton.addEventListener('click', deleteFile);
	runButton.addEventListener('click', run);

	function textChanged() {
		isSaved = false;
	}

	function codeBlur() {
		getCurrentFile().then(function(file) {
			if (file.valueOf() === TEMP.valueOf()) {
				var item = {};
				item[TEMP] = codeBox.getValue();
				chrome.storage.local.set(item, function() {
					isSaved = true;
				});
			}
		});
	}

	function newFile() {
		if (closeFile()) {
			setCurrentFile(TEMP).then(function() {
				codeBox.setValue("");
				isSaved = true;
			});
		}
	}

	function save() {
		getCurrentFile().then(function(file) {
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
				setCurrentFile(name).then(function() {
					var item = {};
					item[name] = codeBox.getValue();
					chrome.storage.local.set(item, function() {
						populateFiles().then(function() {
							isSaved = true;
						});
					});
				});
			}
		});
	}

	function deleteFile() {
		getCurrentFile().then(function(file) {
			if (codeBox.getValue().length === 0 && file.valueOf() === TEMP.valueOf()) return;
			var sure = confirm("Are you sure you want to delete this script?");
			if (sure) {
				isSaved = true;
				chrome.storage.local.remove(file, function() {
					populateFiles().then(function() {
						newFile();
					});
				});
			}
		});
	}

	function run() {
		runCode(codeBox.getValue());
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
		return new Promise(function(resolve, reject) {
			clearFiles();
			chrome.storage.local.get(null, function(items) {
				for (var key in items) {
					if (SUFFIX_REGEX.test(key)) {
						addFile(key);
					}
				}
				resolve();
			});
		});
	}

	function closeFile() {
		return isSaved || confirm("Delete unsaved changes?");
	}

	function getCurrentFile() {
		return new Promise(function(resolve, reject) {
			var currentFile;
			chrome.storage.local.get(CURRENT, function(items) {
				currentFile = items[CURRENT];
				if (currentFile === undefined) {
					currentFile = TEMP;
					setCurrentFile(currentFile).then(function() {
						resolve(currentFile);
					});
				} else {
					resolve(currentFile);
				}
			});
		});
	}

	function setCurrentFile(file) {
		return new Promise(function(resolve, reject) {
			var obj = {};
			obj[CURRENT] = file;
			chrome.storage.local.set(obj, function() {
				fileLabel.innerHTML = file;
				resolve();
			});
		});
	}

	function openFile(file) {
		if (closeFile()) {
			setCurrentFile(file).then(function() {
				chrome.storage.local.get(file, function(items) {
					codeBox.setValue(items[file]);
					isSaved = true;
				});
			});
		}
	}
};

function runCode(code) {
	chrome.tabs.executeScript({
		code: parseCode(code)
	});
}

var contextItem = chrome.contextMenus.create({
	"id" : "1337",
	"title" : "ID",
	"type" : "normal",
	"contexts" : ["all"]
	});

function setKeyBindings(file){
    editor.setOption("keyMap", "vim");
}
