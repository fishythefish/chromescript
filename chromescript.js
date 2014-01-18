window.onload = function() {

	chrome.storage.onChanged.addListener(function(changes, namespace) {
		for (key in changes) {
    		var storageChange = changes[key];
    		console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  		}
	});

	var filePicker = document.getElementById("FilePicker");
	var codeBox = document.getElementById("scriptingspace");

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

	function newFile() {

	};

	function save() {

	};

	function saveAs() {
		var name = prompt("Save as: ", "Enter script name");
		chrome.storage.local.get(name, function(items) {
			if (!items[name] !== undefined || confirm("Script already exists. Overwrite?")) {
				var item = {};
				item[name] = codeBox.value;
				chrome.storage.local.set(item);
				populateFiles();
			}
		});
	};

	function importFile() {

	};

	function run() {
		chrome.tabs.executeScript({
			code: codeBox.value
		});
	};

	function clearFiles() {
		while (filePicker.length > 0) {
			filePicker.remove(0);
		}
	};

	function addFile(name) {
		var option = document.createElement("option");
		option.text = name;
		filePicker.add(option);
	};

	function populateFiles() {
		clearFiles();
		chrome.storage.local.get(null, function(items) {
			for (key in items) {
				addFile(key);
			}
		});
	};

};