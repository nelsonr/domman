var assert = require('assert');

describe('vhostsParser', function() {
	describe('parse()', function() {
		var vhostsParser = require('../app/node_modules/apache-vhosts-parser.js');
		var expected = [
			{id: 0, ServerName: 'localhost', ServerAdmin: 'admin@localhost', DocumentRoot: '"C:\\apache-www\\"'},
			{id: 1, ServerName: 'domainA.dev', DocumentRoot: '"C:\\apache-www\\domainA"'},
			{id: 2, ServerName: 'domainB.dev', DocumentRoot: '"C:\\apache-www\\domainB"'}
		];

		it('should return list of virtual host objects', function() {
			assert.deepEqual(expected, vhostsParser.parse('assets/httpd-vhosts.conf'));
		});
	});
});
