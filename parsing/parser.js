dictionary = [
	[/go\(\"([^\"]+)\"\)/g, 'location.href = "http://$1"'],
	[/go\(\'([^\']+)\'\)/g, "location.href = 'http://$1'"]
];

function parseCode(code) {
	for (var index in dictionary) {
		code = code.replace(dictionary[index][0], dictionary[index][1]);
	}
	return code;
}