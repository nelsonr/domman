var assert = require('assert');

describe('vhostsParser', function() {
	var vhostsParser = require('../app/node_modules/apache-vhosts-parser.js');

	describe('parse()', function() {
		var expected = [
			{id: 0, ServerName: 'localhost', ServerAdmin: 'admin@localhost', DocumentRoot: 'C:\\apache-www\\'},
			{id: 1, ServerName: 'domainA.dev', DocumentRoot: 'C:\\apache-www\\domainA'},
			{id: 2, ServerName: 'domainB.dev', DocumentRoot: 'C:\\apache-www\\domainB'}
		];

		it('should return list of virtual host objects', function() {
			assert.deepEqual(expected, vhostsParser.parse('assets/httpd-vhosts.conf'));
		});
	});
});

describe('tools', function() {
	var tools = require('../app/js/tools.js');

    describe('compareObjects()', function() {
	    it("should return false if two objects don't match", function() {
		    var objA = {a: 1, b: 2},
			    objB = {a: 1, b: 3};

	        assert.equal(false, tools.compareObjects(objA, objB));
	    });

	    it('should return true if two objects match', function() {
		    var objA = {a: 1, b: 2},
			    objB = {a: 1, b: 2};

	        assert.equal(true, tools.compareObjects(objA, objB));
	    });
    });
});
