/**
 * Load application configuration file
 *
 * @param file
 * @returns {object}
 */
function loadConfig(file) {
	var fs = require('fs');

	return JSON.parse(fs.readFileSync('./' + file).toString());
}

/**
 * Show application window after a delay to prevent content flash
 */
function preventFlash() {
	var gui = require('nw.gui');
	var win = gui.Window.get();

	var t = setTimeout(function() {
		win.show();
		clearTimeout(t);
	}, 1000);
}

function equal(objA, objB) {
	for (attr in objA) {
		if (objA[attr] !== objB[attr]) return false;
	}

	return true;
}
